// SessionStart hook: injects the interaction standard (F1-F15) into every
// session. Always on — there is no opt-in flag, because this is the norm, not a
// mode.
//
// Ported from ayghri/i-have-adhd (MIT), hooks/always-on.mjs. Two deliberate
// changes from upstream:
//   1. No `.i-have-adhd-always` flag check — the standard is unconditional.
//   2. Failure is LOUD, not silent. Upstream exits 0 quietly when the skill file
//      is missing. Here, the consumers of this plugin have deleted their local
//      copies of the rules precisely because this hook serves them; a silent
//      failure would drop the standard with no signal at all.
//
// Still never blocks session start: every path exits 0.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ALERT =
  "INTERACTION STANDARD FAILED TO LOAD — responses this session are ungoverned. " +
  "See https://github.com/licorsy/interaction-governance";

try {
  // Resolve the skill relative to this script, not a trusted env var.
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const skillPath = path.join(
    scriptDir,
    "..",
    "skills",
    "interaction-standard",
    "SKILL.md",
  );

  if (!fs.existsSync(skillPath)) {
    process.stdout.write(`${ALERT} (skill file not found at ${skillPath})\n`);
    process.exit(0);
  }

  // Strip a leading YAML frontmatter block (--- ... --- at the very top).
  const body = fs
    .readFileSync(skillPath, "utf8")
    .replace(/^---[^\S\r\n]*\r?\n[\s\S]*?\r?\n---[^\S\r\n]*(?:\r?\n|$)/, "")
    .replace(/(?:\r?\n)+$/, "");

  if (!body.trim()) {
    process.stdout.write(`${ALERT} (skill file is empty)\n`);
    process.exit(0);
  }

  process.stdout.write(
    "INTERACTION STANDARD ACTIVE (F1-F15). The ruleset below applies to every " +
      "response in this session. A scheduled routine follows the literal " +
      "template of its own prompt instead (F13.c).\n\n" +
      `${body}\n`,
  );
} catch (err) {
  process.stdout.write(`${ALERT} (${err && err.message})\n`);
  process.exit(0);
}
