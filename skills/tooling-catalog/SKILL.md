---
name: tooling-catalog
description: Taxonomy and operating procedure for agent tooling — what a skill, plugin, subagent, command, MCP server, hook and output style each are, where each one lives, what triggers it, which wins when two overlap, and how to install, verify, update or remove each. Invoke when asking "what do I have for X?", "why isn't this skill showing up?", "where does this live?", or before installing anything new.
---

# Tooling catalog

What this is: the **taxonomy and procedure**, portable to any machine. The
inventory of what is actually installed on a given machine belongs in that
machine's own records — a public catalog of a personal inventory publishes the
inventory.

## The seven kinds, and how to tell them apart

| Kind | Lives in | Triggered by | Sees the conversation? |
|---|---|---|---|
| **Skill** | `~/.claude/skills/<n>/SKILL.md` (user) · `.claude/skills/` (project) · plugin | model-invoked from its `description`, or `/name` | yes — loads into the current context |
| **Plugin** | `~/.claude/plugins/` via a marketplace | n/a — a container for the six below | — |
| **Subagent** | `~/.claude/agents/*.md` · `.claude/agents/` · plugin | dispatched by the main agent | no — fresh context, returns a result |
| **Command** | `commands/` in a plugin, or `.claude/commands/` | `/name` typed by the user | yes |
| **MCP server** | configured in `~/.claude.json` or project config | tool call | tool results only |
| **Hook** | `settings.json`, or `hooks/hooks.json` in a plugin | an event (SessionStart, Stop, PreToolUse…) | only its event payload |
| **Output style** | `~/.claude/output-styles/` | selected, persists | rewrites the system prompt |

The distinction that matters most in practice: a **skill** costs context every
time it loads and can be invoked by the model on its own judgement; a
**subagent** costs a separate context that never touches yours; a **hook** is
deterministic code that runs whether or not the model cooperates. Prefer the
lowest one on that list that solves the problem — deterministic beats
model-invoked, the same ladder `docs-governance` applies to document checks.

## Traps, each one measured rather than assumed

1. **Plugin installation is per machine, not per repository.** Plugins live in
   `~/.claude/plugins/`. Updating one from inside repository A updates it for
   repository B too. There is no per-repo pin.
2. **A newly installed skill does not appear in an already-open session.** The
   skill listing is built at session start. Update, then open a new session.
3. **A plugin's `plugin.json` needs `author` as an object, not a string.** A
   string fails validation with `author: Invalid input: expected object,
   received string` and the plugin silently does not install.
4. **`marketplace add <owner>/<repo>` uses the repository name, not the org
   name.** The installed identifier is `plugin@marketplace`, where the
   marketplace is named by its `marketplace.json`, which conventionally matches
   the repo. `plugin@org` is a common and confusing mistake.
5. **A marketplace does not resolve before the first push.** Adding a
   marketplace that points at an empty repository fails. Push the manifests
   first.
6. **A hook that fails silently is worse than no hook.** If consumers deleted
   their local copy of what the hook provides, a silent `exit 0` removes the
   behaviour with no signal. Fail loudly, then exit 0.
7. **On WSL, `node` may resolve to the Windows `node.exe`.** A symlink in
   `~/.local/bin` can shadow a native Linux node. CommonJS `require` then fails
   on `\\wsl.localhost\...` paths. Check with `readlink -f "$(which node)"`
   before blaming the script.

## Procedure

**Install** — `claude plugin marketplace add <owner>/<repo>` then
`claude plugin install <plugin>@<marketplace>`. Verify with
`claude plugin list` **in a new session**.

**Verify what is really there** — read the disk, not the documentation:
`~/.claude/plugins/installed_plugins.json`, the `name:` of each
`~/.claude/skills/*/SKILL.md`, `ls ~/.claude/agents/`, `claude mcp list`, and
the `hooks` block of `~/.claude/settings.json`. `scripts/inventory.sh` in this
repository prints all five.

**Update** — `claude plugin update <plugin>@<marketplace>`. The installer keeps
a `_backup-<name>-<version>-<date>` directory beside the cache; check it before
assuming something was lost.

**Remove** — uninstall, then remove the entry from `enabledPlugins` and, if
nothing else uses it, from `extraKnownMarketplaces`.

## Before adding anything new

Three questions, in order — the buy-vs-build ladder: does something already
installed do this? is it free, or already paid for? does it work without new
infrastructure? Only build custom when all three point at "no".

And record the answer somewhere durable. A tool nobody wrote down is a tool
nobody remembers they have — which is how the same capability gets installed
twice under two names.
