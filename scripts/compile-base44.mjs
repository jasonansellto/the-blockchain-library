import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const importDir = path.resolve(root, process.env.BASE44_EXPORT_DIR || "imports/base44");
const outDir = path.resolve(root, process.env.KNOWLEDGE_OUTPUT_DIR || "data/compiled");
const manifest = JSON.parse(fs.readFileSync(path.join(importDir, "manifest.json"), "utf8"));
fs.mkdirSync(outDir, { recursive: true });

const TYPE_MAP = {
  glossary: "glossary",
  articles: "topic",
  books: "book",
  research: "research",
  "learning-paths": "learning-path",
  resources: "resource",
  "code-snippets": "code-example",
  rpc: "infrastructure",
  authors: "author",
  categories: "category",
  news: "news",
  newsletters: "newsletter"
};

const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (name, value) =>
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(value, null, 2) + "\n");

const slugify = value => String(value || "")
  .normalize("NFKD")
  .toLowerCase()
  .replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 180);

const uniq = values => [...new Set(values.filter(v => v !== null && v !== undefined && v !== ""))];

const clean = value => {
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [key, val] of Object.entries(value)) {
    if ([
      "created_by_id", "is_sample", "created_date", "updated_date",
      "id", "views", "downloads", "enrolled_count"
    ].includes(key)) continue;
    out[key] = clean(val);
  }
  return out;
};

function pickArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const value of Object.values(payload)) if (Array.isArray(value)) return value;
  return [];
}

function titleFor(type, item) {
  return item.title || item.name || item.term || item.network || item.provider || item.slug || item.id;
}

function canonicalUrl(type, slug) {
  const prefix = {
    glossary: "/glossary/",
    topic: "/topics/",
    book: "/books/",
    research: "/research/",
    "learning-path": "/learn/",
    resource: "/developers/resources/",
    "code-example": "/developers/code-examples/",
    infrastructure: "/developers/rpc/",
    author: "/authors/",
    category: "/categories/",
    newsletter: "/newsletter/",
    news: "/news/"
  }[type] || "/";
  return `${prefix}${slug}`;
}

function normalize(sourceType, item) {
  const type = TYPE_MAP[sourceType] || sourceType;
  const title = titleFor(type, item);
  const slug = item.slug || slugify(title);
  const sourceId = item.id || item.internal_id || slug;
  const uid = `${type}:${slug}`;
  return {
    uid,
    id: slug,
    type,
    sourceType,
    sourceId,
    sourceIds: [String(sourceId)],
    title,
    aliases: [],
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

function richness(o) {
  let score = 0;
  for (const value of [o.summary, o.seoTitle, o.seoDescription, o.categoryId, o.difficulty]) if (value) score += 4;
  score += Math.min((o.tags || []).length, 8);
  score += Math.min(JSON.stringify(o.data || {}).length / 500, 20);
  if (o.status === "published") score += 5;
  if (o.visibility === "public") score += 3;
  return score;
}

function mergeData(base, other) {
  if (Array.isArray(base) || Array.isArray(other)) {
    const a = Array.isArray(base) ? base : [];
    const b = Array.isArray(other) ? other : [];
    const map = new Map();
    for (const item of [...a, ...b]) {
      const key = typeof item === "object" ? JSON.stringify(item) : String(item);
      if (!map.has(key)) map.set(key, item);
    }
    return [...map.values()];
  }
  if (base && typeof base === "object" && other && typeof other === "object") {
    const out = { ...base };
    for (const [key, value] of Object.entries(other)) {
      out[key] = key in out ? mergeData(out[key], value) : value;
    }
    return out;
  }
  return base ?? other;
}

function mergeCanonical(group) {
  const sorted = [...group].sort((a, b) => richness(b) - richness(a));
  const base = structuredClone(sorted[0]);
  const sourceIds = [];
  const aliases = [];
  let mergedData = {};

  for (const item of sorted) {
    sourceIds.push(...(item.sourceIds || [item.sourceId]).map(String));
    if (item.title && item.title !== base.title) aliases.push(item.title);
    if (item.slug && item.slug !== base.slug) aliases.push(item.slug);
    base.tags = uniq([...(base.tags || []), ...(item.tags || [])]);
    if (!base.summary && item.summary) base.summary = item.summary;
    if (!base.seoTitle && item.seoTitle) base.seoTitle = item.seoTitle;
    if (!base.seoDescription && item.seoDescription) base.seoDescription = item.seoDescription;
    if (!base.categoryId && item.categoryId) base.categoryId = item.categoryId;
    if (!base.difficulty && item.difficulty) base.difficulty = item.difficulty;
    mergedData = mergeData(mergedData, item.data || {});
  }

  base.sourceIds = uniq(sourceIds);
  base.sourceId = base.sourceIds[0];
  base.aliases = uniq([...(base.aliases || []), ...aliases]);
  base.data = mergedData;
  base.reconciliation = {
    mergedRecords: group.length,
    canonicalSelectionScore: Number(richness(base).toFixed(2))
  };
  return base;
}

const rawCollections = {};
const normalizedRaw = [];
const exactDuplicateRows = [];

for (const [sourceType, meta] of Object.entries(manifest.contentTypes || {})) {
  if (!meta.file || sourceType === "relationships") continue;
  const file = path.join(importDir, meta.file);
  if (!fs.existsSync(file)) continue;
  const rows = pickArray(readJson(file));
  rawCollections[sourceType] = rows;

  const seenSource = new Set();
  for (const row of rows) {
    const object = normalize(sourceType, row);
    const exactKey = `${sourceType}:${object.sourceId}`;
    if (seenSource.has(exactKey)) {
      exactDuplicateRows.push({ sourceType, sourceId: String(object.sourceId), uid: object.uid, title: object.title });
      continue;
    }
    seenSource.add(exactKey);
    normalizedRaw.push(object);
  }
}

const byUidGroup = new Map();
for (const object of normalizedRaw) {
  if (!byUidGroup.has(object.uid)) byUidGroup.set(object.uid, []);
  byUidGroup.get(object.uid).push(object);
}

const canonicalMerges = [];
const catalog = [];
for (const [uid, group] of byUidGroup) {
  const canonical = mergeCanonical(group);
  catalog.push(canonical);
  if (group.length > 1) {
    canonicalMerges.push({
      uid,
      title: canonical.title,
      sourceIds: canonical.sourceIds,
      mergedRecords: group.length,
      sourceTypes: uniq(group.map(x => x.sourceType))
    });
  }
}

const byUid = new Map(catalog.map(o => [o.uid, o]));
const sourceIdToUid = new Map();
const slugToUid = new Map();
const titleToUid = new Map();
const aliasToUid = new Map();

for (const object of catalog) {
  for (const sid of object.sourceIds || []) sourceIdToUid.set(String(sid), object.uid);
  slugToUid.set(object.slug, object.uid);
  if (object.title) titleToUid.set(object.title.trim().toLowerCase(), object.uid);
  for (const alias of object.aliases || []) aliasToUid.set(slugify(alias), object.uid);
}

function resolveTarget(target) {
  if (!target) return null;
  const rawId = String(target.id || "").trim();
  const label = String(target.label || "").trim();
  if (sourceIdToUid.has(rawId)) return sourceIdToUid.get(rawId);
  if (slugToUid.has(rawId)) return slugToUid.get(rawId);
  if (titleToUid.has(rawId.toLowerCase())) return titleToUid.get(rawId.toLowerCase());
  if (label && titleToUid.has(label.toLowerCase())) return titleToUid.get(label.toLowerCase());
  for (const candidate of [slugify(rawId), slugify(label)]) {
    if (!candidate) continue;
    if (slugToUid.has(candidate)) return slugToUid.get(candidate);
    if (aliasToUid.has(candidate)) return aliasToUid.get(candidate);
  }
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
  const relationships = pickArray(readJson(path.join(importDir, relMeta.file)));
  for (const rel of relationships) {
    const sourceUid = resolveTarget(rel.source);
    const targetUid = resolveTarget(rel.target);
    if (!sourceUid || !targetUid) {
      unresolved.push({
        source: rel.source || null,
        target: rel.target || null,
        relationshipType: rel.relationshipType || null,
        missing: !sourceUid ? "source" : "target"
      });
      continue;
    }
    addEdge(sourceUid, targetUid, rel.relationshipType || "related-to", "base44", {
      strength: rel.strength ?? 1,
      category: rel.category ?? null
    });
  }
}

for (const object of catalog) {
  const d = object.data || {};
  const declared = [
    ["related_glossary", "glossary", "related-glossary"],
    ["related_articles", "topic", "related-article"],
    ["related_books", "book", "related-book"],
    ["related_research", "research", "related-research"],
    ["related_resources", "resource", "related-resource"]
  ];
  for (const [field, targetType, edgeType] of declared) {
    for (const ref of d[field] || []) {
      const raw = typeof ref === "string" ? ref : ref?.slug || ref?.id || ref?.title;
      if (!raw) continue;
      const targetUid = resolveTarget({ id: raw, label: raw }) || `${targetType}:${slugify(raw)}`;
      if (byUid.has(targetUid)) addEdge(object.uid, targetUid, edgeType, "embedded");
    }
  }
}

const related = Object.fromEntries(catalog.map(object => [object.uid, []]));
for (const edge of edges) {
  const target = byUid.get(edge.to);
  if (!target || !related[edge.from]) continue;
  related[edge.from].push({
    uid: target.uid,
    type: target.type,
    title: target.title,
    canonicalUrl: target.canonicalUrl,
    relationship: edge.type,
    strength: edge.strength ?? 1
  });
}
for (const list of Object.values(related)) {
  list.sort((a, b) => (b.strength ?? 1) - (a.strength ?? 1) || a.title.localeCompare(b.title));
}

const searchIndex = catalog
  .filter(o => o.visibility === "public" && o.status !== "draft")
  .map(o => ({
    id: o.uid,
    type: o.type,
    title: o.title,
    aliases: o.aliases || [],
    summary: o.summary,
    categoryId: o.categoryId,
    tags: o.tags,
    canonicalUrl: o.canonicalUrl,
    text: [o.title, ...(o.aliases || []), o.summary, o.seoTitle, o.seoDescription, ...(o.tags || [])]
      .filter(Boolean).join(" ")
  }));

const missingConceptCounter = new Map();
for (const rel of unresolved) {
  const target = rel.target || {};
  const label = String(target.label || target.id || "").trim();
  if (!label) continue;
  const key = slugify(label);
  const existing = missingConceptCounter.get(key) || { key, label, count: 0, relationshipTypes: new Set(), examples: [] };
  existing.count++;
  if (rel.relationshipType) existing.relationshipTypes.add(rel.relationshipType);
  if (existing.examples.length < 5) existing.examples.push({ source: rel.source, target: rel.target });
  missingConceptCounter.set(key, existing);
}

const missingConcepts = [...missingConceptCounter.values()]
  .map(x => ({ ...x, relationshipTypes: [...x.relationshipTypes] }))
  .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

const counts = {};
for (const [sourceType, rows] of Object.entries(rawCollections)) counts[sourceType] = rows.length;
const canonicalCounts = Object.fromEntries(
  Object.entries(TYPE_MAP).map(([sourceType, type]) => [sourceType, catalog.filter(x => x.sourceType === sourceType || x.type === type).length])
);

const quality = {
  rawObjects: Object.values(counts).reduce((a, b) => a + b, 0),
  canonicalObjects: catalog.length,
  exactDuplicateRowsRemoved: exactDuplicateRows.length,
  canonicalMergeGroups: canonicalMerges.length,
  canonicalMergeExcessRows: canonicalMerges.reduce((sum, x) => sum + (x.mergedRecords - 1), 0),
  duplicateCanonicalUids: 0,
  totalEdges: edges.length,
  unresolvedRelationships: unresolved.length,
  uniqueMissingConcepts: missingConcepts.length,
  selfEdgesSkipped,
  missingSeoDescription: catalog.filter(x => !x.seoDescription).length,
  missingTags: catalog.filter(x => !x.tags?.length).length,
  uncategorized: catalog.filter(x => !x.categoryId && !["author", "news", "newsletter"].includes(x.type)).length
};

const buildId = crypto.createHash("sha256")
  .update(JSON.stringify({ exportDate: manifest.exportDate, checksums: manifest.checksums, quality }))
  .digest("hex").slice(0, 16);

const compiledManifest = {
  compilerVersion: "2.0.1",
  schemaVersion: "2.0",
  buildId,
  source: {
    exportDate: manifest.exportDate || null,
    version: manifest.version || null,
    schemaVersion: manifest.schemaVersion || null
  },
  generatedAt: new Date().toISOString(),
  sourceCounts: counts,
  totals: {
    rawObjects: quality.rawObjects,
    canonicalObjects: catalog.length,
    edges: edges.length,
    searchableObjects: searchIndex.length
  },
  quality,
  files: {
    catalog: "catalog.json",
    graph: "graph.json",
    related: "related.json",
    searchIndex: "search-index.json",
    reconciliation: "reconciliation.json",
    missingConcepts: "missing-concepts.json",
    duplicateMerges: "duplicate-merges.json",
    sourceMap: "source-map.json"
  }
};

const sourceMap = {};
for (const object of catalog) for (const sourceId of object.sourceIds || []) sourceMap[sourceId] = object.uid;

writeJson("catalog.json", catalog);
writeJson("graph.json", {
  version: "2.0.1",
  buildId,
  nodes: catalog.map(o => ({
    id: o.uid,
    type: o.type,
    label: o.title,
    canonicalUrl: o.canonicalUrl,
    categoryId: o.categoryId,
    difficulty: o.difficulty
  })),
  edges
});
writeJson("related.json", related);
writeJson("search-index.json", searchIndex);
writeJson("missing-concepts.json", missingConcepts);
writeJson("duplicate-merges.json", { exactDuplicateRows, canonicalMerges });
writeJson("source-map.json", sourceMap);
writeJson("reconciliation.json", {
  buildId,
  sourceCounts: counts,
  canonicalCounts,
  quality,
  exactDuplicateRows,
  canonicalMerges,
  unresolvedRelationships: unresolved,
  topMissingConcepts: missingConcepts.slice(0, 100)
});
writeJson("manifest.json", compiledManifest);

console.log("Knowledge Compiler v2.0.1 reconciliation complete.");
console.log(JSON.stringify(compiledManifest, null, 2));
