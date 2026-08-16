# Eval rubric — interaction standard

Method follows `ayghri/i-have-adhd`'s evals (weighted dimensions, blocking
findings, baseline comparison); dimensions rewritten for this standard.

## Dimensions (1–5 each)

| Dimension | Weight | What 5 looks like |
|---|---|---|
| Correctness | 30% | Facts and technical content intact; nothing lost to formatting |
| Closing contract | 25% | F13/F14 exact: block only when real work closed, ONE next action, nothing after the block, recommendation matches the bolded close |
| Actionability | 20% | First line is the answer/action (F2); steps numbered and bounded (F5); time in concrete units (F10) |
| Concision | 15% | No preamble (F1), no tangents (F8), lists within cap (F7), no prose recap |
| Language discipline | 10% | Right language, matching label set, never mixed (F15); factual error tone (F11) |

Weighted score = Σ(score × weight).

## Blocking findings — automatic fail regardless of score

- A bare prose question closing a decision ask (the exact defect the Stop hook catches).
- The F3 recommendation naming a DIFFERENT option than the bolded close.
- Content after the F13 block.
- The interaction block emitted by a scheduled-routine-shaped case (F13.c violation).

## Conditions

Run each case under two conditions: **baseline** (standard explicitly disabled
for the session) and **candidate** (standard active). Candidate must beat
baseline on the weighted score with correctness within 0.1 — the standard must
never buy format with substance.

## Cost note

Running evals consumes subscription quota. Writing them is free; running them is
a decision. Run with 1 trial on a subset first.
