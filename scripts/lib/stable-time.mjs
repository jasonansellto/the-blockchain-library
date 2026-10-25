import fs from "node:fs";

// Reproducible build timestamps.
//
// CI regenerates every artifact and fails if the result differs from what is
// committed, so a fresh `new Date()` on each run can never pass. These helpers
// keep `generatedAt` stable unless the artifact's content actually changes.

const withoutStamp = value => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const { generatedAt, ...rest } = value;
  return rest;
};

export const nowIso = () => process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString()
  : new Date().toISOString();

// Returns the generatedAt already on disk when nothing else in `next` changed;
// otherwise a new timestamp (SOURCE_DATE_EPOCH-aware).
export function stableGeneratedAt(filePath, next) {
  try {
    const previous = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (previous?.generatedAt &&
        JSON.stringify(withoutStamp(previous)) === JSON.stringify(withoutStamp(next))) {
      return previous.generatedAt;
    }
  } catch {
    // no previous artifact
  }
  return nowIso();
}

// Writes `value` as pretty JSON, keeping its previous generatedAt when the
// content is otherwise identical.
export function writeStableJson(filePath, value) {
  const out = value && typeof value === "object" && !Array.isArray(value) && "generatedAt" in value
    ? { ...value, generatedAt: stableGeneratedAt(filePath, value) }
    : value;
  fs.writeFileSync(filePath, JSON.stringify(out, null, 2) + "\n");
  return out;
}
