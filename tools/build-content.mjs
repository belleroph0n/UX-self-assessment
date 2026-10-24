// Reads the YAML files in /content, checks them, and writes src/generated/content.json
// for the app. Run with: npm run content
// Any problem stops the build with a plain-English message.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import YAML from "yaml";
import Ajv from "ajv/dist/2020.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => YAML.parse(readFileSync(join(root, "content", name), "utf8"));

const content = {
  meta: read("meta.yaml"),
  categories: read("categories.yaml").categories,
  criteria: read("criteria.yaml").criteria,
  scoring: read("scoring.yaml"),
  materiality: read("materiality.yaml"),
  tiers: read("tiers.yaml"),
  sources: read("sources.yaml").sources,
  profile: read("profile.yaml").characteristics,
};

const problems = [];
const warn = [];

// 1. Structure
const schema = JSON.parse(readFileSync(join(root, "schema", "content.schema.json"), "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
if (!validate(content)) {
  for (const e of validate.errors) {
    const where = e.instancePath.replace(/^\//, "").replace(/\//g, " > ") || "content";
    let item = "";
    const m = e.instancePath.match(/^\/criteria\/(\d+)/);
    if (m) item = ` (criterion ${content.criteria[Number(m[1])]?.id ?? "?"})`;
    problems.push(`${where}${item}: ${e.message}`);
  }
}

// 2. Rules the schema can't express
const catIds = new Set(content.categories.map((c) => c.id));
const pts = content.categories.reduce((a, c) => a + c.points, 0);
if (pts !== 100) problems.push(`Category points total ${pts}; they must total 100 (categories.yaml).`);

const seen = new Set();
for (const c of content.criteria) {
  if (seen.has(c.id)) problems.push(`Duplicate criterion ID ${c.id} (criteria.yaml).`);
  seen.add(c.id);
  if (!catIds.has(c.category)) problems.push(`${c.id}: category '${c.category}' is not in categories.yaml.`);
  if (!c.id.startsWith(c.category + "-")) problems.push(`${c.id}: ID prefix doesn't match category '${c.category}'.`);
  const words = c.link?.label?.trim().split(/\s+/).length ?? 0;
  if (words > 6) problems.push(`${c.id}: link label has ${words} words; keep it to 6 or fewer.`);
}
const simpleW = content.scoring.simple_set_weight;
for (const cat of content.categories) {
  if (!content.criteria.some((c) => c.category === cat.id && c.weight === simpleW))
    warn.push(`Category ${cat.id} has no weight-${simpleW} criteria, so it won't appear in the simple assessment.`);
}

const mins = content.scoring.ratings.map((r) => r.min);
if (mins.some((m, i) => i > 0 && m >= mins[i - 1])) problems.push("scoring.yaml: ratings must be listed from highest 'min' to lowest.");
if (mins[mins.length - 1] !== 0) problems.push("scoring.yaml: the last rating must have min: 0.");

const ratingIds = new Set(content.scoring.ratings.map((r) => r.id));
const tierIds = new Set(content.tiers.tiers.map((t) => t.id));
for (const [r, t] of Object.entries(content.tiers.rating_to_tier))
  if (!tierIds.has(t)) problems.push(`tiers.yaml: rating ${r} maps to unknown tier '${t}'.`);
for (const t of content.tiers.tiers)
  if (!ratingIds.has(t.target_rating)) problems.push(`tiers.yaml: tier ${t.id} has unknown target_rating '${t.target_rating}'.`);

const levelRatings = content.materiality.levels.map((l) => l.rating).join(",");
if (levelRatings !== "1,2,3,4,5") problems.push("materiality.yaml: levels must be ratings 1 to 5 in order.");
const matIds = new Set();
for (const f of content.materiality.factors) {
  if (matIds.has(f.id)) problems.push(`Duplicate materiality factor ID ${f.id}.`);
  matIds.add(f.id);
}

for (const w of warn) console.warn(`Warning: ${w}`);
if (problems.length) {
  console.error(`\nContent check failed with ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error("");
  process.exit(1);
}

mkdirSync(join(root, "src", "generated"), { recursive: true });
writeFileSync(join(root, "src", "generated", "content.json"), JSON.stringify(content, null, 1));
const simple = content.criteria.filter((c) => c.weight === simpleW).length;
console.log(`Content OK: v${content.meta.content_version}, ${content.criteria.length} criteria (${simple} in the simple set), ${content.materiality.factors.length} materiality factors.`);
