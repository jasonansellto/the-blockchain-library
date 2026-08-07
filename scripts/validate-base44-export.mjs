import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const importDir = path.resolve(root, process.env.BASE44_EXPORT_DIR || "imports/base44");
const manifestPath = path.join(importDir, "manifest.json");
const errors = [];
const warnings = [];

const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const canonicalSha256 = value => crypto
  .createHash("sha256")
  .update(JSON.stringify(value))
  .digest("hex");

if (!fs.existsSync(manifestPath)) {
  errors.push(`Missing ${manifestPath}`);
} else {
  const manifest = readJson(manifestPath);
  if (!manifest.schemaVersion) warnings.push("manifest.json has no schemaVersion");
  if (!manifest.contentTypes || typeof manifest.contentTypes !== "object") {
    errors.push("manifest.json has no contentTypes object");
  }

  for (const [type, meta] of Object.entries(manifest.contentTypes || {})) {
    if (!meta.file) continue;
    const file = path.join(importDir, meta.file);
    if (!fs.existsSync(file)) {
      errors.push(`${type}: missing ${meta.file}`);
      continue;
    }

    let payload;
    try { payload = readJson(file); }
    catch (error) {
      errors.push(`${type}: invalid JSON in ${meta.file}: ${error.message}`);
      continue;
    }

    const count = Array.isArray(payload)
      ? payload.length
      : Array.isArray(payload?.items)
        ? payload.items.length
        : null;

    if (count === null) warnings.push(`${type}: ${meta.file} is not a top-level array`);
    if (Number.isInteger(meta.count) && count !== null && meta.count !== count) {
      errors.push(`${type}: manifest count ${meta.count} != file count ${count}`);
    }

    const expected = manifest.checksums?.[meta.file];
    if (expected) {
      const actual = canonicalSha256(payload);
      if (expected !== actual) errors.push(`${type}: checksum mismatch for ${meta.file}`);
    }
  }
}

warnings.forEach(message => console.warn(`WARN ${message}`));
if (errors.length) {
  console.error(`Base44 export validation failed (${errors.length})`);
  errors.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log(`Base44 export validation passed: ${importDir}`);
