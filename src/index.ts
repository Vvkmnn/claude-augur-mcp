#!/usr/bin/env node
/**
 * MCP server for claude-augur-mcp.
 *
 * Single tool: augur_explain — extract plan structure,
 * return template for Claude to fill inline.
 */

import { createRequire } from 'module';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'node:fs';

import { extractPlanStructure } from './session.js';
import { renderTemplate, renderSummary } from './render.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

const SERVER_INSTRUCTIONS = `\ud83d\udcd0 Augur \u2014 Plan Reasoning

Surface Claude's reasoning chain as scannable summaries:
\u2022 augur_explain(plan_path) \u2014 Extract decisions, tradeoffs, assumptions and render as ASCII summary

After writing/editing plan files, call augur_explain to generate a reasoning abstract.
Insights use \u2605 Insight boxes. Save notable discoveries with augur_save.`;

const server = new McpServer(
  { name: 'claude-augur-mcp', version },
  { instructions: SERVER_INSTRUCTIONS },
);

server.tool(
  'augur_explain',
  'Extract plan structure and return a template for inline rendering. Call after writing/editing plan files. Render the filled template INLINE in your response (not in a code block).',
  {
    plan_path: z.string().describe('Absolute path to the plan file'),
  },
  async ({ plan_path }) => {
    let planContent: string;
    try {
      planContent = readFileSync(plan_path, 'utf-8');
    } catch {
      return { content: [{ type: 'text' as const, text: `Error: Cannot read plan file at ${plan_path}` }] };
    }

    const structure = extractPlanStructure(planContent);
    const summary = renderSummary(structure, plan_path);
    const template = renderTemplate(structure, plan_path);

    return {
      content: [
        { type: 'text' as const, text: summary },
        { type: 'text' as const, text: template },
      ],
    };
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
