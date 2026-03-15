/**
 * Shared types for claude-teacher-mcp.
 *
 * Single domain: plan structure extraction for template seeding.
 */

export interface PlanStructure {
  title: string;
  project: string;
  purpose: string;
  sections: string[];
  itemCount: number;
  doneCount: number;
  doneLine: string;
  nextLine: string;
}
