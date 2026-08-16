#!/usr/bin/env node
// Generates each platform's copy of the interaction standard from the single
// source, standard/INTERACTION-STANDARD.md.
//
// Why a generator when there is only one target today: the source/mirror split
// is what lets Codex, Cursor and Gemini be added later without refactoring, and
// what stops "multi-model support" from meaning "four copies to drift". Adding
// a platform = adding one entry to TARGETS.
//
//   node scripts/sync-platforms.mjs          write the mirrors
//   node scripts/sync-platforms.mjs --check  exit 1 if any mirror is stale (CI)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "standard", "INTERACTION-STANDARD.md");

const TARGETS = [
  {
    platform: "claude-code",
    file: path.join(ROOT, "skills", "interaction-standard", "SKILL.md"),
    frontmatter: [
      "---",
      "name: interaction-standard",
      "description: The F1-F15 response-format standard. Loaded automatically at" +
        " SessionStart by this plugin's hook and applied to every response;" +
        " invoke it directly to re-read the rules, settle a formatting question," +
        " or check a draft reply against the pre-send check.",
      "---",
      "",
    ].join("\n"),
  },
  // Later, without refactoring:
  //   { platform: "codex",  file: ".codex-plugin/…" }
  //   { platform: "cursor", file: ".cursor/skills/interaction-standard/SKILL.md" }
  //   { platform: "gemini", file: "GEMINI.md" }
];

const BANNER =
  "<!-- GENERATED FROM standard/INTERACTION-STANDARD.md — DO NOT EDIT.\n" +
  "     Edit the source, then run: node scripts/sync-platforms.mjs -->\n\n";

function render(target, body) {
  return `${target.frontmatter || ""}${BANNER}${body}`;
}

function main() {
  const check = process.argv.includes("--check");

  if (!fs.existsSync(SOURCE)) {
    console.error(`source not found: ${SOURCE}`);
    process.exit(1);
  }
  const body = fs.readFileSync(SOURCE, "utf8");

  let stale = 0;
  for (const target of TARGETS) {
    const want = render(target, body);
    const rel = path.relative(ROOT, target.file);
    const have = fs.existsSync(target.file)
      ? fs.readFileSync(target.file, "utf8")
      : null;

    if (have === want) {
      console.log(`ok    ${rel}`);
      continue;
    }
    if (check) {
      console.error(`STALE ${rel} — run: node scripts/sync-platforms.mjs`);
      stale += 1;
      continue;
    }
    fs.mkdirSync(path.dirname(target.file), { recursive: true });
    fs.writeFileSync(target.file, want);
    console.log(`wrote ${rel}`);
  }

  if (stale) {
    console.error(`\n${stale} mirror(s) out of sync with the source.`);
    process.exit(1);
  }
}

main();
