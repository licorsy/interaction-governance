#!/usr/bin/env python3
"""Stop hook: catch the one recurring format miss — a reply that ends in a
bare prose question with no lettered options (F3) and no bolded closing
sentence (F14) of the interaction standard. Deliberately narrow: only fires on
that exact, previously-observed pattern to avoid false-positive loops on
ordinary replies.

Ported byte-for-byte from the founder's ~/.claude/hooks/check-closing-format.py
(2026-08-16); only the two rule citations in the docstring and in the block
reason were renumbered to F3/F14. Widening the detector is deliberately NOT
done here — a broader matcher risks a block/retry loop, so any expansion goes
through measured precision first, the same shadow-mode ladder docs-governance
uses.
"""
import json
import os
import re
import sys


def last_assistant_text(transcript_path: str) -> str | None:
    try:
        with open(transcript_path, "r") as f:
            lines = f.readlines()
    except OSError:
        return None

    for line in reversed(lines):
        line = line.strip()
        if not line:
            continue
        try:
            entry = json.loads(line)
        except json.JSONDecodeError:
            continue
        if entry.get("type") != "assistant":
            continue
        message = entry.get("message") or {}
        content = message.get("content")
        if not isinstance(content, list):
            continue
        texts = [
            block.get("text", "")
            for block in content
            if isinstance(block, dict) and block.get("type") == "text"
        ]
        if texts:
            return "\n".join(texts).strip()
    return None


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0

    if payload.get("stop_hook_active"):
        return 0

    transcript_path = payload.get("transcript_path")
    if not transcript_path or not os.path.exists(transcript_path):
        return 0

    text = last_assistant_text(transcript_path)
    if not text:
        return 0

    if not text.rstrip().endswith("?"):
        return 0

    has_lettered_options = re.search(r"(?m)^\s*-?\s*[A-D]\)\s", text) is not None

    paragraphs = [p for p in re.split(r"\n\s*\n", text) if p.strip()]
    last_paragraph = paragraphs[-1] if paragraphs else text
    has_bold_close = "**" in last_paragraph

    if has_lettered_options or has_bold_close:
        return 0

    print(
        json.dumps(
            {
                "decision": "block",
                "reason": (
                    "This reply ends with a bare prose question — no lettered "
                    "options (F3) and no bolded closing sentence (F14) of the "
                    "interaction standard (licorsy/interaction-governance). "
                    "Reformat the closing before finishing: use a lettered "
                    "A/B/C list for the decision, or bold the key closing "
                    "sentence if it's a status update, not a menu of choices."
                ),
            }
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
