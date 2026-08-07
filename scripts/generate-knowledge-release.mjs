import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = process.cwd();
const compiledDir = path.join(cwd, "data", "compiled");
const publicDir = path.join(cwd, "public", "knowledge");
fs.mkdirSync(publicDir, { recursive: true });

const read = name => JSON.parse(fs.readFileSync(path.join(compiledDir, name), "utf8"));
const copyJson = name => fs.copyFileSync(path.join(compiledDir, name), path.join(publicDir, name));
const checksum = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

const manifest = read("manifest.json");
const files = [
  "manifest.json",
  "catalog.json",
  "graph.json",
  "related.json",
  "search-index.json",
  "reconciliation.json",
  "missing-concepts.json",
  "duplicate-merges.json",
  "source-map.json"
].filter(name => fs.existsSync(path.join(compiledDir, name)));

for (const name of files) copyJson(name);

const release = {
  releaseVersion: "2.1.0",
  compilerVersion: manifest.compilerVersion,
  schemaVersion: manifest.schemaVersion,
  buildId: manifest.buildId,
  source: manifest.source,
  generatedAt: new Date().toISOString(),
  totals: manifest.totals,
  quality: manifest.quality,
  distribution: {
    website: "https://theblockchainlibrary.com",
    documentation: "https://docs.theblockchainlibrary.com",
    repository: "https://github.com/jasonansellto/the-blockchain-library"
  },
  publicFiles: Object.fromEntries(files.map(name => [
    name,
    {
      path: `/knowledge/${name}`,
      sha256: checksum(path.join(publicDir, name))
    }
  ])),
  syncContract: {
    authoredContentOwner: "Base44",
    canonicalKnowledgeOwner: "GitHub",
    documentationPresentation: "Mintlify",
    safeWebsiteReturnFields: [
      "canonicalUid",
      "canonicalStatus",
      "compiledBuildId",
      "normalizedSlug",
      "compiledRelationships",
      "knowledgeQuality",
      "canonicalSearchMetadata"
    ]
  }
};

fs.writeFileSync(path.join(publicDir, "knowledge-release.json"), JSON.stringify(release, null, 2) + "\n");
fs.writeFileSync(path.join(cwd, "knowledge-release.json"), JSON.stringify(release, null, 2) + "\n");
console.log(`Knowledge release ${release.releaseVersion} generated for build ${release.buildId}.`);
