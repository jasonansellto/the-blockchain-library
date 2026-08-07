import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const errors = [];
const releasePath = path.join(cwd, "knowledge-release.json");
const docsIndex = path.join(cwd, "generated", "v2", "mintlify-index.json");

if (!fs.existsSync(releasePath)) errors.push("Missing knowledge-release.json");
if (!fs.existsSync(docsIndex)) errors.push("Missing generated/v2/mintlify-index.json");

if (!errors.length) {
  const release = JSON.parse(fs.readFileSync(releasePath, "utf8"));
  const docs = JSON.parse(fs.readFileSync(docsIndex, "utf8"));
  const compiled = JSON.parse(fs.readFileSync(path.join(cwd, "data", "compiled", "manifest.json"), "utf8"));

  if (release.buildId !== compiled.buildId) errors.push("knowledge-release.json buildId does not match compiled manifest");
  if (docs.buildId !== compiled.buildId) errors.push("Mintlify index buildId does not match compiled manifest");
  if (!docs.pages?.length) errors.push("No generated Mintlify pages");
}

if (errors.length) {
  console.error(`Knowledge distribution validation failed (${errors.length})`);
  errors.forEach(e => console.error(`- ${e}`));
  process.exit(1);
}

console.log("Knowledge distribution validation passed.");
