// Pulls the authored-content export from the Base44 platform into
// imports/base44/ — the same files the Admin Export page downloads — so the
// Knowledge Compiler can run unattended in CI.
//
// Env:
//   BASE44_EXPORT_URL      exportContent function URL
//                          (default: https://theblockchainlibrary.com/api/apps/6a4cfcf76d7d1bf88148c979/functions/exportContent)
//   KNOWLEDGE_SYNC_TOKEN   shared secret, also stored as a Base44 app secret
//   BASE44_EXPORT_DIR      output folder (default: imports/base44)
//
// The manifest's exportDate is the newest `updated_date` across all content,
// not the wall clock, so an unchanged platform produces an identical build
// and the sync workflow commits nothing.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const EXPORT_URL = process.env.BASE44_EXPORT_URL ||
  "https://theblockchainlibrary.com/api/apps/6a4cfcf76d7d1bf88148c979/functions/exportContent";
const TOKEN = process.env.KNOWLEDGE_SYNC_TOKEN;
const outDir = path.resolve(process.cwd(), process.env.BASE44_EXPORT_DIR || "imports/base44");

// Must match EXPORT_CONTENT_TYPES in the Base44 app (base44/shared/exportLogic.ts).
const CONTENT_TYPES = [
  { key: "glossary", label: "Glossary", file: "glossary.json" },
  { key: "articles", label: "Articles / Topics", file: "articles.json" },
  { key: "books", label: "Books", file: "books.json" },
  { key: "research", label: "Research", file: "research.json" },
  { key: "learning-paths", label: "Learning Paths", file: "learning-paths.json" },
  { key: "resources", label: "Developer Resources", file: "resources.json" },
  { key: "code-snippets", label: "Code Snippets", file: "code-examples.json" },
  { key: "rpc", label: "RPC Endpoints", file: "rpc.json" },
  { key: "authors", label: "Authors", file: "authors.json" },
  { key: "categories", label: "Categories", file: "categories.json" },
  { key: "news", label: "News", file: "news.json" },
  { key: "newsletters", label: "Newsletters", file: "newsletters.json" }
];

if (!TOKEN) {
  console.error("KNOWLEDGE_SYNC_TOKEN is not set.");
  process.exit(1);
}

const sha256 = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

async function call(type, attempt = 1) {
  try {
    const res = await fetch(EXPORT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-knowledge-sync-token": TOKEN },
      body: JSON.stringify({ type }),
      signal: AbortSignal.timeout(300_000)
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${type}: HTTP ${res.status} ${text.slice(0, 200)}`);
    const data = JSON.parse(text);
    if (!Array.isArray(data.records)) throw new Error(`${type}: response has no records array`);
    return data;
  } catch (error) {
    if (attempt >= 3) throw error;
    console.warn(`WARN ${error.message} — retrying (${attempt}/3)`);
    await new Promise(r => setTimeout(r, 5000 * attempt));
    return call(type, attempt + 1);
  }
}

const writeJson = (name, value) =>
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(value, null, 2) + "\n");

fs.mkdirSync(outDir, { recursive: true });

const manifest = {
  exportDate: null,
  version: "1.0.0",
  schemaVersion: "1.0",
  contentTypes: {},
  checksums: {},
  recordCounts: {}
};
let newest = null;

for (const ct of CONTENT_TYPES) {
  const data = await call(ct.key);
  writeJson(ct.file, data.records);
  manifest.contentTypes[ct.key] = { label: ct.label, file: ct.file, count: data.records.length, lastUpdated: data.lastUpdated };
  manifest.recordCounts[ct.key] = data.records.length;
  manifest.checksums[ct.file] = sha256(data.records);
  if (data.lastUpdated && (!newest || new Date(data.lastUpdated) > new Date(newest))) newest = data.lastUpdated;
  console.log(`${ct.key}: ${data.records.length}`);
}

const rel = await call("relationships");
writeJson("relationships.json", rel.records);
manifest.contentTypes.relationships = { file: "relationships.json", count: rel.records.length };
manifest.recordCounts.relationships = rel.records.length;
manifest.checksums["relationships.json"] = sha256(rel.records);
console.log(`relationships: ${rel.records.length}`);

const iso = newest ? new Date(newest.endsWith("Z") || /[+-]\d\d:\d\d$/.test(newest) ? newest : `${newest}Z`).toISOString() : null;
manifest.exportDate = iso;
writeJson("manifest.json", manifest);
console.log(`Base44 export pulled to ${outDir} (content as of ${iso}).`);
