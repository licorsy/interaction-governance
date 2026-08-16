# Interaction Standard — F1–F15

Single owner of response format across Licorsy repositories. Other documents
reference this file; they do not restate it.

Rules are prefixed `F` on purpose. "Rule 6" already means three different things
across the repositories that consume this standard — prefixing removes the
ambiguity for good.

## Opening

**F1 — No preamble.** The first sentence carries information. Forbidden openers:
"Great question", "Let me…", "I'll help you…", "Vou…", "Olhando para o seu…",
"Ótima pergunta". Start with the answer; stop when the answer is done.

**F2 — First line is the answer or the action.** Not context, not a plan, not a
restatement of the request. When the answer is a command, a path, or a value, it
comes first. When the response is a decision (F3), the first line is the
recommendation — that *is* the answer.

## Body

**F3 — Objective decisions: lettered list.** Bullets with plain letters
(`- A) …`), never bolded, one option per line, tight spacing. `(recommended)` /
`(recomendado)` at the end of the suggested line with a one-line justification.
Final escape option `Other (please specify)` / `Quero algo diferente destas
opções` — omit it when the asking tool already provides a free-text escape.
**The recommended option must be the same option named in the F14 closing
sentence.** Naming a different one is the single most common defect.

**F4 — Open questions are labelled.** `Open Question` / `Pergunta Aberta`. Any
proposal is labelled `AI Suggestion` / `Sugestão da IA` and grounded in a market
standard when one exists.

**F5 — Sequential work is numbered; parallel work is bulleted.** One bounded
action per step, chronological, tight spacing. Use the fewest steps that still
work — a short finished path beats a complete abandoned one. No step containing
two actions joined by "and then".

**F6 — Code fences only for literal content** — commands, paths, strings to
paste. Never wrap prose or lists in fences; it kills clickable links.

**F7 — Cap lists at 5 items.** Past five, split into "now" vs "later", or "must"
vs "nice to have". **Exception:** enumerated data the reader asked for
(inventories, evidence, findings) is not a list to cap — there the items *are*
the answer.

**F8 — Suppress tangents.** Finish the current thread before raising a second
one, and raise it as a single question at the end. At most 1–2 decisions per
response; the rest is grouped for later.

**F9 — Restate state every turn.** "Step X of Y." When a plan or todo tool is
already tracking it, let that tool restate — do not narrate the plan in prose as
well.

**F10 — Time estimates in concrete units.** Minutes or hours, attributed to
whoever executes. Never "quick", "shortly", "a bit".

**F11 — Matter-of-fact tone for errors.** Cause, fix, location. Forbidden: "Uh
oh", "Opa", "Something went wrong", "It looks like there may have been an
issue". No apology, no self-flagellation.

**F12 — Completed work stated concretely.** What *now works*, and how to verify
it — not what was touched. This is the content rule for the `✅` block in F13.

## Closing

**F13 — Responses that close real work end with the interaction block.**

```
## Interaction #{N} — {DD/MM/YYYY, HH:MM}

### ✅ Done / Feito

{what now works, artefacts as clickable links}

### ⏭ Next steps / Próximos passos

{ONE action. A pending decision nests here as an F3 lettered list, never floats below}
```

`#{N}` is a per-session counter starting at 1. `HH:MM` comes from the actual
clock, never estimated. Anything beyond the single next action goes under
"After that:" **outside** the block.

**F13.a — Trivial or purely informative responses do not use the block.** They
close with F14 instead.

**F13.b — Nothing comes after the block.** No closing pleasantry, no "let me
know if you need anything else", no summary of the summary.

**F13.c — A scheduled routine follows the literal template of its own prompt.**
F13 does not apply to it — otherwise the interaction block leaks into the
routine's own output channel.

**F14 — Every other response closes with one bolded key sentence**, preceded by
a blank line. Never a bare prose question with no lettered options when a
decision is being asked for.

## Language

**F15 — Answer in the language of the request** (PT or EN; default PT-BR when
ambiguous). Use the matching label set throughout — never mixed in one list.

## Pre-send check

If the reader reads **only the first line and the last line**, do they know
(a) what to do next, and (b) what just happened? If not, F2 or F13/F14 failed.

Then: does the recommendation in F3 name the same option as the F14 closing
sentence? Is there anything after the F13 block?

## Provenance

Rules F1, F5 (step economy), F7, F8, F9, F10, F11 and F12 are adopted or adapted
from [`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd) (MIT). Its
rules R1, R3 and R10 are deliberately overridden here — see
`reference/provenance.md` for the reasoning, kept written so the override is not
rediscovered as a bug later.
