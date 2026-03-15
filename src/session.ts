/**
 * Plan structure extractor.
 *
 * Reads plan files and extracts metadata for template generation.
 * Computes progress lines (Done/Next) from step headings + checkboxes.
 */

import type { PlanStructure } from './types.js';

/** Truncate text at a word boundary, not mid-word */
function truncAtWord(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const cut = text.substring(0, maxLen);
  const sp = cut.lastIndexOf(' ');
  return sp > maxLen * 0.4 ? cut.substring(0, sp) : cut;
}

interface StepTracker {
  name: string;
  items: number;
  done: number;
}

/** Extract a short name from a step heading like "### Step 2: Pivot to template approach (from live test)" */
function extractStepName(heading: string): string {
  let name = heading.replace(/^###\s+/, '');
  name = name.replace(/^Step\s+\d+:\s*/i, '');
  name = name.replace(/\*\*/g, '');
  // Cut at first delimiter for brevity
  for (const sep of [' — ', ' - ', ' (', ' + ']) {
    const idx = name.indexOf(sep);
    if (idx > 0) { name = name.substring(0, idx); break; }
  }
  // Trim trailing punctuation/spaces after word-boundary truncation
  return truncAtWord(name.trim(), 18).replace(/[\s+\-]+$/, '');
}

/**
 * Extract structured metadata from a plan file.
 * Reads title, purpose, section headings, checkbox counts, and step progress.
 */
export function extractPlanStructure(planContent: string): PlanStructure {
  const lines = planContent.split('\n');

  let title = 'Untitled Plan';
  let purpose = '';
  const sections: string[] = [];
  let itemCount = 0;
  let doneCount = 0;
  let foundPurpose = false;

  const steps: StepTracker[] = [];
  let currentStep: StepTracker | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ') && title === 'Untitled Plan') {
      title = trimmed.replace(/^#\s+/, '');
      continue;
    }

    if (trimmed.startsWith('## ')) {
      const section = trimmed.replace(/^##\s+/, '');
      if (!section.startsWith('Detail:')) {
        sections.push(truncAtWord(section, 30));
      }
    }

    if (trimmed.match(/^###\s+Step\s+\d/i)) {
      if (currentStep) steps.push(currentStep);
      currentStep = { name: extractStepName(trimmed), items: 0, done: 0 };
    }

    if (trimmed.startsWith('- [')) {
      itemCount++;
      if (currentStep) currentStep.items++;
      if (trimmed.startsWith('- [x]')) {
        doneCount++;
        if (currentStep) currentStep.done++;
      }
    }

    if (!foundPurpose && trimmed.length > 15) {
      const goalMatch = trimmed.match(/\*\*(?:Primary goal|How it works)\*\*:\s*(.+)/);
      if (goalMatch) {
        purpose = goalMatch[1];
        foundPurpose = true;
      } else if (
        !purpose &&
        !trimmed.startsWith('#') &&
        !trimmed.startsWith('**Progress') &&
        !trimmed.startsWith('-') &&
        !trimmed.startsWith('|') &&
        !trimmed.startsWith('```') &&
        !trimmed.startsWith('---')
      ) {
        purpose = trimmed;
      }
    }
  }

  if (currentStep) steps.push(currentStep);

  // Build progress lines
  const doneSteps = steps.filter(s => s.items > 0 && s.done === s.items).map(s => s.name);
  const pendingSteps = steps.filter(s => s.items === 0 || s.done < s.items).map(s => s.name);

  const doneNames = doneSteps.slice(0, 2).join(', ');
  const doneExtra = doneSteps.length > 2 ? ` + ${doneSteps.length - 2} more` : '';
  const doneLine = `Done (${doneCount}/${itemCount}): ${doneNames || 'none yet'}${doneExtra}`;

  let nextLine: string;
  if (pendingSteps.length === 0) {
    nextLine = 'Next: all done!';
  } else if (pendingSteps.length === 1) {
    nextLine = `Next: ${pendingSteps[0]}`;
  } else {
    nextLine = `Next: ${pendingSteps[0]} + ${pendingSteps.length - 1} more`;
  }

  // Extract project name from title (before ":" if present)
  const colonIdx = title.indexOf(':');
  const project = colonIdx > 0 ? title.substring(0, colonIdx).trim() : title;

  return {
    title,
    project,
    purpose: purpose || 'No description',
    sections,
    itemCount,
    doneCount,
    doneLine,
    nextLine,
  };
}
