import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = process.cwd();
const compiledDir = path.join(cwd, "data", "compiled");
const outputRoot = path.join(cwd, "generated", "v2");

const read = name => JSON.parse(fs.readFileSync(path.join(compiledDir, name), "utf8"));
const ensure = dir => fs.mkdirSync(dir, { recursive: true });
const escape = value => String(value ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
const stripHtml = value => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const mdText = value => String(value ?? "").replace(/\r/g, "").trim();
const safeArray = value => Array.isArray(value) ? value : [];

if (!fs.existsSync(path.join(compiledDir, "catalog.json"))) {
  console.error("Missing data/compiled/catalog.json. Run npm run build:v2 first.");
  process.exit(1);
}

const catalog = read("catalog.json");
const related = fs.existsSync(path.join(compiledDir, "related.json")) ? read("related.json") : {};
const manifest = fs.existsSync(path.join(compiledDir, "manifest.json")) ? read("manifest.json") : {};

fs.rmSync(outputRoot, { recursive: true, force: true });
ensure(outputRoot);

const DOC_TYPES = new Set([
  "glossary", "topic", "book", "research",
  "learning-path", "resource", "code-example", "infrastructure"
]);

const typeFolder = {
  glossary: "glossary",
  topic: "topics",
  book: "books",
  research: "research",
  "learning-path": "learning-paths",
  resource: "resources",
  "code-example": "code-examples",
  infrastructure: "rpc"
};

const typeLabel = {
  glossary: "Glossary",
  topic: "Topics & Articles",
  book: "Books",
  research: "Research",
  "learning-path": "Learning Paths",
  resource: "Developer Resources",
  "code-example": "Code Examples",
  infrastructure: "RPC & Infrastructure"
};

function routeSlug(object) {
  const slug = String(object.slug || object.id || "item").replace(/^\/+|\/+$/g, "");
  if (slug.length <= 96) return slug;
  const digest = crypto.createHash("sha1").update(object.uid || slug).digest("hex").slice(0, 8);
  return `${slug.slice(0, 82).replace(/-+$/g, "")}-${digest}`;
}

function frontmatter(object, description) {
  return `---\ntitle: "${escape(object.title)}"\ndescription: "${escape(description.slice(0, 280))}"\n---\n\n`;
}

const publishable = catalog.filter(object =>
  DOC_TYPES.has(object.type) &&
  (!object.visibility || object.visibility === "public") &&
  object.status !== "draft"
);

const docRouteByUid = new Map();
for (const object of publishable) {
  const folder = typeFolder[object.type];
  docRouteByUid.set(object.uid, `/generated/v2/${folder}/${routeSlug(object)}`);
}

function relationBlock(uid) {
  const items = safeArray(related[uid]).slice(0, 16);
  if (!items.length) return "";
  return `\n## Related knowledge\n\n${items.map(item => {
    const route = docRouteByUid.get(item.uid);
    if (route) return `- [${item.title}](${route}) — ${item.relationship || "related"}`;
    if (item.canonicalUrl) return `- [${item.title}](${item.canonicalUrl}) — ${item.relationship || "related"}`;
    return `- ${item.title} — ${item.relationship || "related"}`;
  }).join("\n")}\n`;
}

function detailsFor(object) {
  const d = object.data || {};
  const blocks = [];

  if (object.type === "glossary") {
    if (d.definition) blocks.push(`## Definition\n\n${mdText(d.definition)}`);
    if (d.simple_explanation && d.simple_explanation !== d.definition)
      blocks.push(`## Simple explanation\n\n${mdText(d.simple_explanation)}`);
    if (d.why_it_matters) blocks.push(`## Why it matters\n\n${mdText(d.why_it_matters)}`);
    if (d.how_it_works) blocks.push(`## How it works\n\n${mdText(d.how_it_works)}`);
    if (d.real_world_example) blocks.push(`## Real-world example\n\n${mdText(d.real_world_example)}`);
    if (safeArray(d.advantages).length) blocks.push(`## Advantages\n\n${d.advantages.map(x => `- ${x}`).join("\n")}`);
    if (safeArray(d.limitations).length) blocks.push(`## Limitations\n\n${d.limitations.map(x => `- ${x}`).join("\n")}`);
    if (safeArray(d.common_misconceptions).length) blocks.push(`## Common misconceptions\n\n${d.common_misconceptions.map(x => `- ${x}`).join("\n")}`);
  } else if (object.type === "topic") {
    const body = d.body || d.content || d.description || object.summary;
    if (body) blocks.push(mdText(body));
    if (safeArray(d.key_takeaways).length) blocks.push(`## Key takeaways\n\n${d.key_takeaways.map(x => `- ${x}`).join("\n")}`);
    if (safeArray(d.source_links).length) blocks.push(`## Sources\n\n${d.source_links.map(x => `- [${x.title || x.url}](${x.url})`).join("\n")}`);
  } else if (object.type === "book") {
    if (d.subtitle) blocks.push(`**${mdText(d.subtitle)}**`);
    if (d.description) blocks.push(mdText(d.description));
    const metadata = [
      ["Author", safeArray(d.author_ids).join(", ") || d.author],
      ["Publisher", d.publisher],
      ["Publication", d.publication_date || d.publication_year],
      ["ISBN", d.isbn],
      ["Series", d.series]
    ].filter(([,v]) => v);
    if (metadata.length) blocks.push(`## Publication details\n\n${metadata.map(([k,v]) => `- **${k}:** ${v}`).join("\n")}`);
    if (safeArray(d.key_learnings).length) blocks.push(`## Key learnings\n\n${d.key_learnings.map(x => `- ${x}`).join("\n")}`);
  } else if (object.type === "research") {
    if (d.abstract) blocks.push(`## Abstract\n\n${mdText(d.abstract)}`);
    if (safeArray(d.authors).length) blocks.push(`**Authors:** ${d.authors.join(", ")}`);
    if (d.publication) blocks.push(`**Publication:** ${d.publication}`);
    if (d.publication_date) blocks.push(`**Publication date:** ${d.publication_date}`);
    if (d.doi) blocks.push(`**DOI:** ${d.doi}`);
    if (safeArray(d.key_findings).length) blocks.push(`## Key findings\n\n${d.key_findings.map(x => `- ${x}`).join("\n")}`);
    if (d.citation) blocks.push(`## Citation\n\n${mdText(d.citation)}`);
  } else if (object.type === "learning-path") {
    if (d.description) blocks.push(mdText(d.description));
    if (d.estimated_time) blocks.push(`**Estimated time:** ${d.estimated_time}`);
    if (safeArray(d.lessons).length) {
      blocks.push(`## Lessons\n\n${[...d.lessons].sort((a,b) => (a.order ?? 0) - (b.order ?? 0))
        .map((x,i) => `${i+1}. **${x.title}**${x.duration ? ` — ${x.duration}` : ""}`).join("\n")}`);
    }
  } else if (object.type === "resource") {
    if (d.tagline) blocks.push(`**${mdText(d.tagline)}**`);
    if (d.description) blocks.push(mdText(d.description));
    const meta = [
      ["Organization", d.official_org],
      ["Category", d.category],
      ["Difficulty", d.difficulty],
      ["Official", d.is_official === true ? "Yes" : null],
      ["Editorial label", d.editorial_label]
    ].filter(([,v]) => v);
    if (meta.length) blocks.push(`## Resource details\n\n${meta.map(([k,v]) => `- **${k}:** ${v}`).join("\n")}`);
    if (d.url) blocks.push(`## Official resource\n\n[Visit ${object.title}](${d.url})`);
  } else if (object.type === "code-example") {
    if (d.description) blocks.push(mdText(d.description));
    if (d.explanation) blocks.push(`## Explanation\n\n${mdText(d.explanation)}`);
    if (d.code) blocks.push(`## Code\n\n\`\`\`${d.language || ""}\n${d.code}\n\`\`\``);
  } else if (object.type === "infrastructure") {
    if (d.description) blocks.push(mdText(d.description));
    const meta = [
      ["Network", d.network || d.chain],
      ["Chain ID", d.chain_id || d.chainId],
      ["RPC URL", d.rpc_url || d.url],
      ["Native currency", d.native_currency || d.currency]
    ].filter(([,v]) => v);
    if (meta.length) blocks.push(`## Endpoint details\n\n${meta.map(([k,v]) => `- **${k}:** ${v}`).join("\n")}`);
  }

  return blocks.filter(Boolean).join("\n\n");
}

const generated = [];
for (const object of publishable) {
  const folder = typeFolder[object.type];
  const dir = path.join(outputRoot, folder);
  ensure(dir);

  const safeSlug = routeSlug(object);
  const summary = stripHtml(object.summary || object.seoDescription || `${object.title} — The Blockchain Library`);
  const body = frontmatter(object, summary) +
    `# ${object.title}\n\n` +
    (summary ? `${summary}\n\n` : "") +
    detailsFor(object) +
    relationBlock(object.uid) +
    `\n---\n\n**Canonical knowledge ID:** \`${object.uid}\`\n`;

  fs.writeFileSync(path.join(dir, `${safeSlug}.mdx`), body);
  generated.push({
    uid: object.uid,
    type: object.type,
    title: object.title,
    path: `generated/v2/${folder}/${safeSlug}`,
    sourceCanonicalUrl: object.canonicalUrl,
    sourceSlug: object.slug,
    routeSlug: safeSlug
  });
}

ensure(path.join(outputRoot, "catalogs"));
for (const type of DOC_TYPES) {
  const folder = typeFolder[type];
  const entries = generated.filter(x => x.type === type).sort((a,b) => a.title.localeCompare(b.title));
  const body =
    `---\ntitle: "${typeLabel[type]}"\ndescription: "${entries.length} canonical ${typeLabel[type].toLowerCase()} synchronized from The Blockchain Library Knowledge Engine."\n---\n\n` +
    `# ${typeLabel[type]}\n\n` +
    `**${entries.length} canonical records** · Knowledge build \`${manifest.buildId || "unknown"}\`\n\n` +
    entries.map(x => `- [${x.title}](/${x.path})`).join("\n") + "\n";
  fs.writeFileSync(path.join(outputRoot, "catalogs", `${folder}.mdx`), body);
}

const indexBody =
`---
title: "Knowledge Release ${manifest.compilerVersion || "v2"}"
description: "Synchronized canonical knowledge from The Blockchain Library Knowledge Engine."
---

# Knowledge Release

This documentation collection is generated from the canonical compiled Knowledge Engine.

- **Build ID:** \`${manifest.buildId || "unknown"}\`
- **Compiler:** ${manifest.compilerVersion || "unknown"}
- **Canonical objects:** ${manifest.totals?.canonicalObjects ?? catalog.length}
- **Knowledge graph edges:** ${manifest.totals?.edges ?? "unknown"}
- **Generated documentation pages:** ${generated.length}

## Catalogs

${[...DOC_TYPES].map(type => `- [${typeLabel[type]}](/generated/v2/catalogs/${typeFolder[type]})`).join("\n")}

Generated files should not be edited manually. Update the authored source in Base44, export, compile, and redistribute.
`;
fs.writeFileSync(path.join(outputRoot, "index.mdx"), indexBody);

fs.writeFileSync(path.join(outputRoot, "mintlify-index.json"), JSON.stringify({
  generatedAt: manifest.source?.exportDate || manifest.generatedAt || null,
  buildId: manifest.buildId || null,
  pages: generated
}, null, 2) + "\n");

console.log(`Mintlify distribution generated: ${generated.length} pages.`);
