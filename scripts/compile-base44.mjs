import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const importDir = path.resolve(root, process.env.BASE44_EXPORT_DIR || "imports/base44");
const outDir = path.resolve(root, process.env.KNOWLEDGE_OUTPUT_DIR || "data/compiled");
const manifest = JSON.parse(fs.readFileSync(path.join(importDir, "manifest.json"), "utf8"));
fs.mkdirSync(outDir, { recursive: true });

const TYPE_MAP = {
  glossary: "glossary", articles: "topic", books: "book", research: "research",
  "learning-paths": "learning-path", resources: "resource", "code-snippets": "code-example",
  rpc: "infrastructure", authors: "author", categories: "category", news: "news", newsletters: "newsletter"
};
const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (name, value) => fs.writeFileSync(path.join(outDir, name), JSON.stringify(value, null, 2) + "\n");
const slugify = value => String(value || "").normalize("NFKD").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 180);

const clean = value => {
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [key, val] of Object.entries(value)) {
    if (["created_by_id", "is_sample", "created_date", "updated_date", "id", "views", "downloads", "enrolled_count"].includes(key)) continue;
    out[key] = clean(val);
  }
  return out;
};
const pickArray = payload => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const value of Object.values(payload)) if (Array.isArray(value)) return value;
  return [];
};
const titleFor = item => item.title || item.name || item.term || item.network || item.provider || item.slug || item.id;
const canonicalUrl = (type, slug) => {
  const prefix = {
    glossary: "/glossary/", topic: "/topics/", book: "/books/", research: "/research/",
    "learning-path": "/learn/", resource: "/developers/resources/", "code-example": "/developers/code-examples/",
    infrastructure: "/developers/rpc/", author: "/authors/", category: "/categories/",
    newsletter: "/newsletter/", news: "/news/"
  }[type] || "/";
  return `${prefix}${slug}`;
};

function normalize(sourceType, item) {
  const type = TYPE_MAP[sourceType] || sourceType;
  const title = titleFor(item);
  const slug = item.slug || slugify(title);
  const sourceId = item.id || item.internal_id || slug;
  return {
    uid: `${type}:${slug}`,
    id: slug,
    type,
    sourceType,
    sourceId,
    title,
    slug,
    canonicalUrl: canonicalUrl(type, slug),
    language: item.language || "en",
    visibility: item.visibility || item.access_level || "public",
    status: item.status || "published",
    difficulty: item.difficulty || item.reading_level || null,
    categoryId: item.category_id || null,
    tags: Array.isArray(item.tags) ? item.tags : [],
    summary: item.summary || item.short_description || item.description || item.definition || "",
    seoTitle: item.seo_title || null,
    seoDescription: item.seo_description || null,
    data: clean(item)
  };
}

const collections = {};
const catalog = [];
const sourceIdToUid = new Map();
const slugToUid = new Map();
const titleToUid = new Map();

for (const [sourceType, meta] of Object.entries(manifest.contentTypes || {})) {
  if (!meta.file || sourceType === "relationships") continue;
  const file = path.join(importDir, meta.file);
  if (!fs.existsSync(file)) continue;
  collections[sourceType] = pickArray(readJson(file)).map(row => normalize(sourceType, row));
  for (const object of collections[sourceType]) {
    catalog.push(object);
    if (object.sourceId) sourceIdToUid.set(String(object.sourceId), object.uid);
    if (object.slug) slugToUid.set(object.slug, object.uid);
    if (object.title) titleToUid.set(object.title.trim().toLowerCase(), object.uid);
  }
}

const byUid = new Map(catalog.map(o => [o.uid, o]));
function resolveTarget(target) {
  if (!target) return null;
  const rawId = String(target.id || "");
  const label = String(target.label || "").trim();
  if (sourceIdToUid.has(rawId)) return sourceIdToUid.get(rawId);
  if (slugToUid.has(rawId)) return slugToUid.get(rawId);
  const normalized = slugify(rawId || label);
  if (slugToUid.has(normalized)) return slugToUid.get(normalized);
  if (label && titleToUid.has(label.toLowerCase())) return titleToUid.get(label.toLowerCase());
  return null;
}

const edges = [];
const edgeKeys = new Set();
const unresolved = [];
let selfEdgesSkipped = 0;
function addEdge(from, to, type, source, meta = {}) {
  if (!from || !to) return;
  if (from === to) { selfEdgesSkipped++; return; }
  const key = `${from}|${to}|${type}`;
  if (edgeKeys.has(key)) return;
  edgeKeys.add(key);
  edges.push({ from, to, type, source, ...meta });
}

const relMeta = manifest.contentTypes?.relationships;
if (relMeta?.file && fs.existsSync(path.join(importDir, relMeta.file))) {
  for (const rel of pickArray(readJson(path.join(importDir, relMeta.file)))) {
    const sourceUid = sourceIdToUid.get(String(rel.source?.id || "")) || slugToUid.get(rel.source?.slug || "") || titleToUid.get(String(rel.source?.title || "").trim().toLowerCase());
    const targetUid = resolveTarget(rel.target);
    if (!sourceUid || !targetUid) {
      unresolved.push({ source: rel.source || null, target: rel.target || null, relationshipType: rel.relationshipType || null, missing: !sourceUid ? "source" : "target" });
      continue;
    }
    addEdge(sourceUid, targetUid, rel.relationshipType || "related-to", "base44", { strength: rel.strength ?? 1, category: rel.category ?? null });
  }
}

for (const object of catalog) {
  const d = object.data || {};
  const declared = [
    ["related_glossary", "glossary", "related-glossary"], ["related_articles", "topic", "related-article"],
    ["related_books", "book", "related-book"], ["related_research", "research", "related-research"],
    ["related_resources", "resource", "related-resource"]
  ];
  for (const [field, targetType, edgeType] of declared) {
    for (const ref of d[field] || []) {
      const raw = typeof ref === "string" ? ref : ref?.slug || ref?.id || ref?.title;
      if (!raw) continue;
      const candidate = `${targetType}:${slugify(raw)}`;
      if (byUid.has(candidate)) addEdge(object.uid, candidate, edgeType, "embedded");
    }
  }
}

const related = Object.fromEntries(catalog.map(o => [o.uid, []]));
for (const edge of edges) {
  const target = byUid.get(edge.to);
  if (!target) continue;
  related[edge.from].push({ uid: target.uid, type: target.type, title: target.title, canonicalUrl: target.canonicalUrl, relationship: edge.type, strength: edge.strength ?? 1 });
}
for (const list of Object.values(related)) list.sort((a,b) => (b.strength ?? 1) - (a.strength ?? 1) || a.title.localeCompare(b.title));

const searchIndex = catalog.filter(o => o.visibility === "public" && o.status !== "draft").map(o => ({
  id: o.uid, type: o.type, title: o.title, summary: o.summary, categoryId: o.categoryId,
  tags: o.tags, canonicalUrl: o.canonicalUrl,
  text: [o.title, o.summary, o.seoTitle, o.seoDescription, ...(o.tags || [])].filter(Boolean).join(" ")
}));

const counts = Object.fromEntries(Object.entries(collections).map(([key, rows]) => [key, rows.length]));
const duplicates = [];
for (const [kind, values] of [["uid", catalog.map(x => x.uid)], ["canonicalUrl", catalog.map(x => x.canonicalUrl)]]) {
  const seen = new Set();
  for (const value of values) { if (seen.has(value)) duplicates.push({ kind, value }); seen.add(value); }
}

const quality = {
  totalObjects: catalog.length,
  totalEdges: edges.length,
  unresolvedRelationships: unresolved.length,
  selfEdgesSkipped,
  duplicateKeys: duplicates.length,
  missingSeoDescription: catalog.filter(x => !x.seoDescription).length,
  missingTags: catalog.filter(x => !x.tags?.length).length,
  uncategorized: catalog.filter(x => !x.categoryId && !["author", "news", "newsletter"].includes(x.type)).length
};
const buildId = crypto.createHash("sha256").update(JSON.stringify({ exportDate: manifest.exportDate, checksums: manifest.checksums, counts })).digest("hex").slice(0,16);
const compiledManifest = {
  compilerVersion: "2.0.0", schemaVersion: "2.0", buildId,
  source: { exportDate: manifest.exportDate || null, version: manifest.version || null, schemaVersion: manifest.schemaVersion || null },
  generatedAt: new Date().toISOString(), counts,
  totals: { objects: catalog.length, edges: edges.length, searchableObjects: searchIndex.length },
  quality,
  files: { catalog: "catalog.json", graph: "graph.json", related: "related.json", searchIndex: "search-index.json", reconciliation: "reconciliation.json" }
};

writeJson("catalog.json", catalog);
writeJson("graph.json", { version: "2.0.0", buildId, nodes: catalog.map(o => ({ id:o.uid, type:o.type, label:o.title, canonicalUrl:o.canonicalUrl, categoryId:o.categoryId, difficulty:o.difficulty })), edges });
writeJson("related.json", related);
writeJson("search-index.json", searchIndex);
writeJson("reconciliation.json", { buildId, counts, quality, duplicates, unresolvedRelationships: unresolved });
writeJson("manifest.json", compiledManifest);
console.log("Knowledge Compiler v2 complete.");
console.log(JSON.stringify(compiledManifest, null, 2));
