---
name: claude-augur
description: Use after writing or editing plan files to surface reasoning as a scannable inline abstract. Extracts decisions, tradeoffs, and assumptions so the user can correct Claude's reasoning at a glance.
---

# Claude Augur

Surface plan reasoning as scannable inline abstracts. Decisions, tradeoffs, assumptions — visible at a glance.

## When to Use

- After writing or editing a plan file
- When the user asks to explain or summarize a plan
- When the user asks "why did you choose this approach?"
- After plan mode exits with a new or updated plan

## Quick Reference

| Tool | Purpose |
|------|---------|
| `augur_explain` | Extract plan structure and return a template for inline rendering |

## Workflow

1. Write or edit a plan file
2. `augur_explain(plan_path: "/path/to/plan.md")`
3. MCP returns a one-line summary + template with `[FILL]` markers
4. Render the filled template **inline in your response** (not in a code block)

## Template Format

MCP pre-renders the header, purpose, and progress. You fill:

- **Decisions** — `✓ choice — reason` with `  └ child — reason` for sub-decisions
- **Assumptions** — `? statement`
- **Tradeoffs** — `+` for pro, `−` for con
- **Reasoning** — 2-3 lines explaining WHY

## Rules

- Every content line starts with `│ `
- ~60 chars max per line after `│ `
- Terse: verb phrases, no articles, no filler
- Render inline, never in a code block
- Never truncate the purpose or header

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Rendering in a code block | Include the template directly in your response text |
| Skipping after plan edits | Always call after writing/editing plan files |
| Verbose fill content | Keep each line under ~60 chars, terse verb phrases |
| Truncating purpose | Purpose wraps fully, never truncated |
