# Provenance — what came from where, and what was overridden

This file exists so the overrides below are not rediscovered as bugs later.
Upstream: [`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd), MIT.

## Adopted as-is

Nothing in the prior local standard covered these, so they enter unchanged:

| Standard | Upstream | What it adds |
|---|---|---|
| F1 | R10 (first half) | Named, forbidden openers |
| F9 | R5 | "Step X of Y" every turn |
| F10 | R6 | Time in concrete units |
| F11 | R8 | Matter-of-fact error tone |

## Adapted

| Standard | Upstream | Change, and why |
|---|---|---|
| F2 | R1 | "The answer **or** the action". A decision arrives as an A/B/C menu, and there the answer *is* the recommendation — R1's literal "an action the reader can do" would misfire. |
| F5 | R2 + local A3/A4 | Merged. R2 contributed what the local rule lacked: step economy — a short finished path beats a complete abandoned one. |
| F7 | R9 | Cap of 5 kept, **with an exception**: enumerated data the reader asked for is not a list to cap. Upstream opens this door itself in its exception 5 ("the options are the answer"). |
| F12 | R7 | Becomes the *content* rule for the `✅ Done` block — "what now works and how to verify", replacing "what was touched". |

## Overridden, with the reasoning

### R1 "lead with the action" vs. F14 "crucial sentence last" — not a real conflict

Upstream's own pre-send check asks: *"if the reader reads only the first line and
the last line, do they know (a) what to do next, and (b) what just happened?"*
That is a deliberately **redundant** design across first and last line. F2 owns
the first, F13/F14 own the last. Neither yields; both are adopted.

### R3 "end with ONE concrete next action" — kept, renamed, not relocated

The `⏭ Next steps` heading stays plural. It is already pasted into six documents
and three claude.ai Projects, and renaming it costs four re-pastes for nothing.
What changes is the **content**: one action inside the block, everything else
under "After that:" outside it. R3 is satisfied where it matters.

### R10 "no recap" — overridden for the F13 block, kept for everything else

Three reasons, in order of weight:

1. **The block is not a conversational recap; it is input to a durable
   document.** In the consuming repository it is transcribed by an explicit
   trigger into a session log. Banning it would break a record-keeping pipeline,
   not trim politeness.
2. **Upstream's own R7 requires completed work to be visible.** A blanket recap
   ban contradicts R7; the block is how R7 is satisfied in a scannable form.
3. **What R10 actually forbids is the *prose* recap** — "I've now done X, Y and
   Z, which means…". F13 forbids that too. Two headings and a list is not the
   thing R10 was written against.

R10's other half survives intact as **F13.b: nothing comes after the block.**

### Opt-in trigger — overridden to always-on

Upstream ships as a mode (`/i-have-adhd`, off until invoked, and its
`SessionStart` hook requires an opt-in flag file). Here it is the norm, so the
ported hook drops the flag check entirely. Per-session opt-out remains possible
in conversation, and is needed to run an uncontaminated baseline condition when
evaluating the standard.

## Not upstream at all

**F13.c — a scheduled routine follows the literal template of its own prompt.**
Found while designing the port: the `SessionStart` hook injects into *every*
session, including scheduled ones. Routines that post to a fixed message
template would otherwise emit the interaction block over their own format. This
override has no upstream equivalent because upstream has no scheduled-run
surface.
