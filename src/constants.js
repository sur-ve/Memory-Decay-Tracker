import { nowMs } from "./utils/decay.js";

export const PALETTE = [
  "#3f51b5",
  "#f97316",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#0ea5e9",
  "#eab308",
  "#14b8a6",
  "#fb7185",
  "#6366f1",
];

export const STRENGTH_LABELS = ["Glanced", "Read", "Practiced", "Built", "Mastered"];

const t = nowMs();
export const DEFAULT_SKILLS = [
  {
    id: 1,
    name: "React Hooks",
    strength: 0.3,
    practicedAt: t - 10 * 86400000,
    practiceHistory: [t - 10 * 86400000],
  },
  {
    id: 2,
    name: "SQL Joins",
    strength: 0.15,
    practicedAt: t - 20 * 86400000,
    practiceHistory: [t - 20 * 86400000],
  },
  {
    id: 3,
    name: "CSS Grid",
    strength: 0.5,
    practicedAt: t - 5 * 86400000,
    practiceHistory: [t - 5 * 86400000],
  },
];

export function normalizeSkill(skill) {
  if (skill.practiceHistory?.length) return skill;
  return { ...skill, practiceHistory: [skill.practicedAt] };
}
