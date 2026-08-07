import fs from "node:fs";
import path from "node:path";

const d = path.join(process.cwd(), "data", "knowledge");
const exists = n => fs.existsSync(path.join(d, n));
const read = n => JSON.parse(fs.readFileSync(path.join(d, n), "utf8"));
const errors = [];

if (!exists("topics-expanded.json")) errors.push("Missing topics-expanded.json");
if (!exists("glossary-expanded.json")) errors.push("Missing glossary-expanded.json");

if (!errors.length) {
  const topics = read("topics-expanded.json").topics ?? [];
  const glossary = read("glossary-expanded.json").entries ?? [];
  const topicIds = new Set(topics.map(t => t.id));
  const topicUids = new Set(topics.map(t => t.uid));
  const glossaryUids = new Set(glossary.map(g => g.uid));

  if (topics.length < 100) errors.push(`Expected at least 100 topics, found ${topics.length}`);
  if (glossary.length < 250) errors.push(`Expected at least 250 glossary entries, found ${glossary.length}`);
  if (topicUids.size !== topics.length) errors.push("Duplicate topic UIDs");
  if (glossaryUids.size !== glossary.length) errors.push("Duplicate glossary UIDs");

  for (const t of topics) {
    for (const related of t.relatedTopics ?? []) {
      if (!topicIds.has(related)) errors.push(`${t.id}: unknown related topic ${related}`);
    }
  }

  for (const file of ["books.json","research.json","tutorials.json","code-examples.json","ai-prompts.json","quizzes.json"]) {
    if (!exists(file)) continue;
    const doc = read(file);
    const arr = Object.values(doc).find(v => Array.isArray(v)) ?? [];
    for (const object of arr) {
      for (const topicId of object.topicIds ?? []) {
        if (!topicIds.has(topicId)) errors.push(`${file}/${object.id}: unknown topicId ${topicId}`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Knowledge Platform validation failed (${errors.length})`);
  errors.forEach(e => console.error(`- ${e}`));
  process.exit(1);
}
console.log("Knowledge Platform validation passed.");
