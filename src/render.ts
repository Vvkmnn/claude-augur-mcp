/**
 * Template generator for plan abstracts.
 *
 * Generates a left-gutter format with section headers and [FILL] markers.
 * MCP pre-renders header, purpose, and progress.
 * Claude fills decisions, assumptions, tradeoffs, reasoning inline.
 */

import type { PlanStructure } from './types.js';

const W = 66;
const CONTENT_W = W - 2; // width after "│ " prefix

/** Word-wrap text to multiple lines — never truncates, always includes all words */
function wrap(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (test.length > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Section header: ├ Name ─────────── (exact W width) */
function sec(name: string): string {
  const trail = '\u2500'.repeat(Math.max(3, W - name.length - 3));
  return `\u251c ${name} ${trail}`;
}

export function renderTemplate(structure: PlanStructure, planPath: string): string {
  const { project, purpose, doneLine, nextLine, sections } = structure;
  const file = planPath.split('/').pop() || planPath;
  // Header: ┌ 📐 project · file trail (never truncated)
  const label = `${project} \u00b7 ${file}`;
  const trail = '\u2500'.repeat(Math.max(3, W - label.length - 5));
  const purposeLines = wrap(purpose, CONTENT_W).map(l => `\u2502 ${l}`).join('\n');
  const sectionList = sections.slice(0, 6).join(', ');

  return `Include this abstract in your response (not in a code block). Header and progress are pre-rendered \u2014 fill the remaining sections.

\u250c \ud83d\udcd0 ${label} ${trail}
${purposeLines}
\u2502
${sec('Progress')}
\u2502 ${doneLine}
\u2502 ${nextLine}
\u2502
${sec('Decisions')}
\u2502 [FILL: 2-4 decisions, format: "\u2713 choice \u2014 reason"]
\u2502 [child decisions use: "  \u2514 choice \u2014 reason"]
\u2502
${sec('Assumptions')}
\u2502 [FILL: 1-2 assumptions, format: "? statement"]
\u2502
${sec('Tradeoffs')}
\u2502 [FILL: 1-2 lines, "+" for pro, "\u2212" for con]
\u2502
${sec('Reasoning')}
\u2502 [FILL: 2-3 lines explaining WHY]
\u2514${'\u2500'.repeat(W)}

Rules:
- Every content line starts with "\u2502 "
- ~60 chars max per line after "\u2502 "
- Terse: verb phrases, no articles, no filler
- Plan sections: ${sectionList}`;
}

export function renderSummary(structure: PlanStructure, planPath: string): string {
  const { doneCount, itemCount } = structure;
  const file = planPath.split('/').pop() || planPath;
  return `\ud83d\udcd0 ${file} \u00b7 ${doneCount}/${itemCount} done`;
}
