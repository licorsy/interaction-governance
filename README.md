# interaction-governance

Agent response format as a **single-owner convention**. The rules live here;
consuming repositories reference them and do not restate them.

Third of the Licorsy governance family, alongside
[`docs-governance`](https://github.com/licorsy/docs-governance) (document
consistency) and [`git-governance`](https://github.com/licorsy/git-governance)
(branch and merge policy). Same shape, different concern.

## Why it exists

The rules it now owns were previously spread across seven files — a global
config, a repository's agent instructions, a "canonical" reference nobody read
at runtime, and four paste destinations. They had already drifted: the closing
block existed in six of them but not in the one that declared itself canonical.

Single owner, mechanically enforced references, is the fix. It is the same
discipline `ENGINEERING-STANDARDS.md` applies to branch taxonomy —
*"deliberately not restated here"*.

## Install

```bash
claude plugin marketplace add licorsy/interaction-governance
claude plugin install interaction-governance@interaction-governance
```

Then open a **new session** — the skill listing is built at session start.

## What you get

| Component | Kind | Effect |
|---|---|---|
| `interaction-standard` | skill | The F1–F15 rules |
| `always-on.mjs` | SessionStart hook | Injects the rules into every session |
| `check-closing-format.py` | Stop hook | Blocks the one recurring closing defect |
| `tooling-catalog` | skill | Taxonomy and procedure for agent tooling |
| `inventory.sh` | script | Prints what is actually installed, from disk |

## The standard

[`standard/INTERACTION-STANDARD.md`](standard/INTERACTION-STANDARD.md) is the
**single source**. Fifteen rules in four groups — opening, body, closing,
language — plus a pre-send check.

Seven rules are adopted or adapted from
[`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd) (MIT). Three of
its rules are deliberately overridden. The reasoning for every override is kept
in
[`reference/provenance.md`](skills/interaction-standard/reference/provenance.md)
— written down so it is not rediscovered as a bug later.

## Editing the standard

Edit **only** `standard/INTERACTION-STANDARD.md`, then:

```bash
node scripts/sync-platforms.mjs          # regenerate the platform mirrors
node scripts/sync-platforms.mjs --check  # what CI runs
```

Every mirror carries a `GENERATED — DO NOT EDIT` banner. CI fails if any mirror
drifts from the source, and if the generated skill exceeds **6144 bytes** — it
is injected into every session, so its size is a running cost, not a detail.

## Portability, stated honestly

The **source** is platform-neutral, and the source/mirror split exists so Codex,
Cursor and Gemini can be added by appending one entry to `TARGETS` in the
generator, without refactoring.

Today only the Claude Code mirror is generated. And **injection and
close-checking are Claude Code specific** — they are hooks. Other platforms can
receive the standard as an instruction file, which is delivery, not enforcement.
That gap is real and is not papered over.

## Not in this repository

The **inventory** of what is installed on a particular machine. `tooling-catalog`
carries the taxonomy and the procedure, which are true anywhere; a machine's
inventory is that machine's own business, and publishing it here would publish
it. `scripts/inventory.sh` reads the local truth and prints it for you to keep
wherever you keep such things.

## License

MIT. See [`NOTICE`](NOTICE) for upstream attribution.
