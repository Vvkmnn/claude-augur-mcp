<img align="right" src="claude-augur.svg" alt="claude-augur-mcp" width="220">

# claude-augur-mcp

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for **plan reasoning summaries** in [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Surfaces decisions, tradeoffs, and assumptions as scannable abstracts so you can correct Claude's reasoning at a glance.

<br clear="right">

![claude-augur-mcp](demo/demo.gif)

[![npm version](https://img.shields.io/npm/v/claude-augur-mcp.svg)](https://www.npmjs.com/package/claude-augur-mcp) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/) [![Claude](https://img.shields.io/badge/Claude-D97757?logo=claude&logoColor=fff)](#) [![GitHub stars](https://img.shields.io/github/stars/Vvkmnn/claude-augur-mcp?style=social)](https://github.com/Vvkmnn/claude-augur-mcp)

---

Claude's reasoning about plans is invisible. When Claude writes a plan, its decisions, assumptions, and tradeoffs are buried in the document. You have to read the entire thing to find them. If Claude assumed the wrong approach or made a bad tradeoff, you won't know until implementation is underway and something breaks.

Augur reads the plan structure and returns a template that Claude fills with its actual reasoning, inline in the response rather than hidden in a collapsed tool result. You see decisions, assumptions, and tradeoffs at a glance and can correct them before a single line of code is written.

## install

**Requirements:**

[![Claude Code](https://img.shields.io/badge/Claude_Code-555?logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxMCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KICA8IS0tIENsYXdkOiBDbGF1ZGUgQ29kZSBtYXNjb3QgLS0+CiAgPCEtLSBEZWNvZGVkIGZyb206IOKWkOKWm+KWiOKWiOKWiOKWnOKWjCAvIOKWneKWnOKWiOKWiOKWiOKWiOKWiOKWm+KWmCAvIOKWmOKWmCDilp3ilp0gLS0+CiAgPCEtLSBTdWItcGl4ZWxzIGFyZSAxIHdpZGUgeCAyIHRhbGwgdG8gbWF0Y2ggdGVybWluYWwgY2hhciBjZWxsIGFzcGVjdCByYXRpbyAtLT4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIzIiAgeT0iMCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIzIiAgeT0iMiIgd2lkdGg9IjIiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSI2IiAgeT0iMiIgd2lkdGg9IjYiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIxMyIgeT0iMiIgd2lkdGg9IjIiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIxIiAgeT0iNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIzIiAgeT0iNiIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSI0IiAgeT0iOCIgd2lkdGg9IjEiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSI2IiAgeT0iOCIgd2lkdGg9IjEiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIxMSIgeT0iOCIgd2lkdGg9IjEiICBoZWlnaHQ9IjIiLz4KICA8cmVjdCBmaWxsPSIjZDk3NzU3IiB4PSIxMyIgeT0iOCIgd2lkdGg9IjEiICBoZWlnaHQ9IjIiLz4KPC9zdmc+Cg==)](https://claude.ai/code)

**From shell:**

```bash
claude mcp add claude-augur-mcp -- npx claude-augur-mcp
```

**From inside Claude** (restart required):

```
Add this to our global mcp config: npx claude-augur-mcp

Install this mcp: https://github.com/Vvkmnn/claude-augur-mcp
```

**From any manually configurable `mcp.json`**: (Cursor, Windsurf, etc.)

```json
{
  "mcpServers": {
    "claude-augur-mcp": {
      "command": "npx",
      "args": ["claude-augur-mcp"],
      "env": {}
    }
  }
}
```

There is **no `npm install` required**: no external databases, no indexing, only Node.js built-ins for filesystem access.

However, if `npx` resolves the wrong package, you can force resolution with:

```bash
npm install -g claude-augur-mcp
```

## features

1 tool. Plan structure extraction. Template seeding. Inline rendering.

#### augur_explain

Read a plan file and return a structured template for Claude to fill with its reasoning. Claude renders the abstract **inline in its response**, not hidden in a collapsed tool result.

**Call after writing or editing a plan file:**

```
augur_explain plan_path="/Users/you/.claude/plans/your-plan.md"
```

**MCP returns two content blocks:**

Block 1: one-line summary, visible even when the tool result is collapsed.

```
your-plan.md · 10/18 done
```

Block 2: template with pre-rendered header, progress, and `[FILL]` markers.

```
┌ 📐 my-project · your-plan.md ────────────────────────────────────
│ Build a REST API with authentication, rate limiting,
│ and WebSocket support for real-time notifications.
│
├ Progress ───────────────────────────────────────────────────────
│ Done (10/18): Auth scaffold, Rate limiter + 1 more
│ Next: WebSocket layer + 1 more
│
├ Decisions ──────────────────────────────────────────────────────
│ [FILL: 2-4 decisions, format: "✓ choice — reason"]
│ [child decisions use: "  └ choice — reason"]
│
├ Assumptions ────────────────────────────────────────────────────
│ [FILL: 1-2 assumptions, format: "? statement"]
│
├ Tradeoffs ──────────────────────────────────────────────────────
│ [FILL: 1-2 lines, "+" for pro, "−" for con]
│
├ Reasoning ──────────────────────────────────────────────────────
│ [FILL: 2-3 lines explaining WHY]
└──────────────────────────────────────────────────────────────────
```

**Claude fills the template inline:**

```
┌ 📐 my-project · your-plan.md ────────────────────────────────────
│ Build a REST API with authentication, rate limiting,
│ and WebSocket support for real-time notifications.
│
├ Progress ───────────────────────────────────────────────────────
│ Done (10/18): Auth scaffold, Rate limiter + 1 more
│ Next: WebSocket layer + 1 more
│
├ Decisions ──────────────────────────────────────────────────────
│ ✓ Express over Fastify — team familiarity, middleware ecosystem
│   └ Passport.js for auth — proven, supports OAuth + JWT
│ ✓ Redis for rate limiting — atomic counters, TTL built-in
│ ✓ ws over Socket.io — lighter, no fallback polling needed
│
├ Assumptions ────────────────────────────────────────────────────
│ ? Single Redis instance sufficient for current scale
│ ? WebSocket clients handle reconnection gracefully
│
├ Tradeoffs ──────────────────────────────────────────────────────
│ + Redis rate limiting: sub-ms response, horizontal scaling
│ − Extra infrastructure dependency to operate
│
├ Reasoning ──────────────────────────────────────────────────────
│ Auth must be production-grade from day one — Passport.js
│ handles OAuth/JWT without custom crypto. Redis rate limiting
│ chosen over in-memory because the API will be multi-process.
│ ws chosen over Socket.io to avoid 200KB bundle overhead.
└──────────────────────────────────────────────────────────────────
```

**What gets extracted from the plan file:**

| Field | Source | Example |
| --- | --- | --- |
| Project name | H1 title before `:` | `my-project` |
| Purpose | First `**Primary goal**:` line, or first prose paragraph | Full text, word-wrapped |
| Sections | H2 headings (excluding `Detail:` sections) | `Context, Architecture, ...` |
| Progress | `### Step N:` headings with `- [x]` / `- [ ]` counts | `Done (10/18): Auth, Rate limiter` |
| Done steps | Steps where all items are `[x]` | Capped at 2 names + `N more` |
| Next steps | Steps with pending items | First name + `N more` |

## methodology

How [claude-augur-mcp](https://github.com/Vvkmnn/claude-augur-mcp) [reads](https://github.com/Vvkmnn/claude-augur-mcp/tree/main/src) plans:

```
                    📐 claude-augur-mcp
                    ━━━━━━━━━━━━━━━━━━━

              Claude writes a plan
                augur_explain
                    │
                    ▼
              ┌─────────────────┐
              │  read plan file │  from disk (read-only)
              │  (session.ts)   │
              └────────┬────────┘
                       │
                       ├── title → project name (before ":")
                       ├── purpose → **Primary goal**: or first prose
                       ├── sections → H2 headings
                       └── progress → ### Step N: with [x]/[ ] counts
                       │
              ┌────────▼────────┐
              │ render template │  left-gutter format
              │ (render.ts)     │  [FILL] markers for Claude
              └────────┬────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
     block 1                   block 2
     summary                   template
     (visible collapsed)       (Claude renders inline)
          │                         │
          ▼                         ▼
     plan.md · 10/18 done      ┌ 📐 project · plan.md ──
                               │ purpose...
                               ├ Progress ────────────
                               │ Done (10/18): Auth + 1
                               ├ Decisions ───────────
                               │ [FILL]
                               ├ Assumptions ─────────
                               │ [FILL]
                               └──────────────────────


     TEMPLATE SEEDING:

     Regex extraction of Claude's thinking blocks produces garbage:
     free-form prose has no structured patterns to match.

     Augur takes a different approach: extract plan structure (the
     deterministic part), seed a template, let Claude fill reasoning
     (the part only Claude knows). Structure from MCP, content from
     Claude. Consistent format, accurate reasoning.

     MCP pre-renders              Claude fills
     ──────────────               ────────────
     header + purpose             decisions
     progress counts              assumptions
     section labels               tradeoffs
     formatting rules             reasoning
```

**Two-block return**: MCP tool results get collapsed in Claude Code UI. Block 1 is a one-line summary visible even when collapsed. Block 2 is the full template that Claude renders inline in its response, visible to the user without expanding.

**Read-only**: `augur_explain` only reads the plan file. No disk writes, no state, no side effects. Works in plan mode.

**Architecture:**

```
claude-augur-mcp/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts       # MCP server, 1 tool
│   ├── types.ts       # PlanStructure interface
│   ├── session.ts     # Plan file parser + step progress extractor
│   └── render.ts      # Template generator with left-gutter format
└── demo/
    ├── demo.cast      # asciinema recording
    └── demo.gif       # animated demo
```

**Design principles:**

- **Template seeding over regex extraction**: regex on thinking blocks produced garbage; template seeding lets Claude fill its own reasoning accurately
- **Inline over collapsed**: tool results get collapsed in Claude Code UI; inline rendering keeps the abstract visible
- **Read-only**: no disk writes, no state, works in plan mode
- **Single tool**: `augur_explain` does one thing well; no CRUD, no storage, no insight management
- **Left-gutter format**: `┌│├└` vertical bar with no right border; can't misalign, renders cleanly in any terminal width
- **Never truncate**: purpose and header always render in full; word-wrapped, never cut

**Design influences:**

- [Architecture Decision Records](https://adr.github.io/): structured format for capturing decisions with context and consequences
- [Y-Statement ADR variant](https://medium.com/olzzio/y-statements-10eb07b5a177): concise decision format: "In context X, facing Y, we decided Z, accepting C"
- Roman [Augurs](https://en.wikipedia.org/wiki/Augur): priests who interpreted signs and patterns to reveal meaning hidden from ordinary observation

## development

```bash
git clone https://github.com/Vvkmnn/claude-augur-mcp && cd claude-augur-mcp
npm install && npm run build
```

**Scripts:**

| Command | Description |
| --- | --- |
| `npm run build` | TypeScript compilation (`tsc && chmod +x dist/index.js`) |
| `npm run dev` | Watch mode (`tsc --watch`) |
| `npm start` | Run MCP server (`node dist/index.js`) |
| `npm run clean` | Remove build artifacts (`rm -rf dist`) |
| `npm run typecheck` | TypeScript validation without emit |
| `npm test` | Type-check |

Contributing:

- Fork the repository and create feature branches
- Follow TypeScript strict mode and [MCP protocol](https://modelcontextprotocol.io/specification) standards

Learn from examples:

- [Official MCP servers](https://github.com/modelcontextprotocol/servers) for reference implementations
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) for best practices
- [Creating Node.js modules](https://docs.npmjs.com/creating-node-js-modules) for npm package development

## license

[MIT](LICENSE)

<hr>

<a href="https://en.wikipedia.org/wiki/Tomb_of_the_Augurs"><img src="logo/tomb-of-the-augurs.jpg" alt="Tomb of the Augurs" width="100%"></a>

<p align="center">

_**[Tomb of the Augurs](https://en.wikipedia.org/wiki/Tomb_of_the_Augurs)**, fresco (Tarquinia, ~530 BCE). Claudius, emperor, scholar, and member of the Augural College, wrote [Tyrrenika](https://en.wikipedia.org/wiki/Tyrrenika), a lost 20-volume history of Etruscan civilization and their methods of divination. The augurs' role was not to predict the future, but to interpret the signs and reveal whether a proposed course of action had merit._

</p>
