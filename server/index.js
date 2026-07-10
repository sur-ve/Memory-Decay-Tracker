import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const DATA_DIR = path.join(__dirname, "data");
const XLSX_PATH = path.join(DATA_DIR, "skills.xlsx");
const SHEET = "skills";

function nowMs() {
  return Date.now();
}

function defaultSeedRows() {
  const t = nowMs();
  return [
    {
      id: 1,
      name: "React Hooks",
      strength: 0.3,
      practicedAt: t - 10 * 86400000,
      practiceHistory: JSON.stringify([t - 10 * 86400000]),
    },
    {
      id: 2,
      name: "SQL Joins",
      strength: 0.15,
      practicedAt: t - 20 * 86400000,
      practiceHistory: JSON.stringify([t - 20 * 86400000]),
    },
    {
      id: 3,
      name: "CSS Grid",
      strength: 0.5,
      practicedAt: t - 5 * 86400000,
      practiceHistory: JSON.stringify([t - 5 * 86400000]),
    },
  ];
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(XLSX_PATH)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(defaultSeedRows());
    XLSX.utils.book_append_sheet(wb, ws, SHEET);
    XLSX.writeFile(wb, XLSX_PATH);
  }
}

function rowToSkill(row) {
  let practiceHistory;
  try {
    practiceHistory =
      typeof row.practiceHistory === "string"
        ? JSON.parse(row.practiceHistory)
        : row.practiceHistory;
  } catch {
    practiceHistory = [Number(row.practicedAt)];
  }
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    strength: Number(row.strength),
    practicedAt: Number(row.practicedAt),
    practiceHistory: Array.isArray(practiceHistory) ? practiceHistory : [Number(row.practicedAt)],
  };
}

function readSkillsFromDisk() {
  ensureDataFile();
  const wb = XLSX.readFile(XLSX_PATH);
  const sheet = wb.Sheets[SHEET];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json(sheet);
  return rows.map(rowToSkill);
}

function writeSkillsToDisk(skills) {
  ensureDataFile();
  const rows = skills.map((s) => ({
    id: s.id,
    name: s.name,
    strength: s.strength,
    practicedAt: s.practicedAt,
    practiceHistory: JSON.stringify(s.practiceHistory ?? [s.practicedAt]),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET);
  XLSX.writeFile(wb, XLSX_PATH);
}

function nextId(skills) {
  if (skills.length === 0) return 100;
  return Math.max(...skills.map((s) => s.id)) + 1;
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/skills", (_req, res) => {
  try {
    const skills = readSkillsFromDisk();
    res.json({ skills, nextId: nextId(skills) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to read skills" });
  }
});

app.post("/api/skills", (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const strength = Number(req.body?.strength);
    if (!name) return res.status(400).json({ error: "name required" });
    if (!Number.isFinite(strength) || strength < 0.05 || strength > 1) {
      return res.status(400).json({ error: "strength must be between 0.05 and 1" });
    }
    const skills = readSkillsFromDisk();
    const ts = nowMs();
    const skill = {
      id: nextId(skills),
      name,
      strength,
      practicedAt: ts,
      practiceHistory: [ts],
    };
    skills.push(skill);
    writeSkillsToDisk(skills);
    res.status(201).json({ skill, nextId: nextId(skills) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save skill" });
  }
});

app.patch("/api/skills/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const skills = readSkillsFromDisk();
    const idx = skills.findIndex((s) => s.id === id);
    if (idx === -1) return res.status(404).json({ error: "not found" });
    const cur = skills[idx];
    const patch = req.body ?? {};
    const merged = {
      ...cur,
      ...patch,
      id: cur.id,
    };
    if (typeof merged.name === "string") merged.name = merged.name.trim();
    if (merged.practiceHistory && !Array.isArray(merged.practiceHistory)) {
      return res.status(400).json({ error: "practiceHistory must be an array" });
    }
    skills[idx] = merged;
    writeSkillsToDisk(skills);
    res.json({ skill: merged });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update skill" });
  }
});

app.delete("/api/skills/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    let skills = readSkillsFromDisk();
    const before = skills.length;
    skills = skills.filter((s) => s.id !== id);
    if (skills.length === before) return res.status(404).json({ error: "not found" });
    writeSkillsToDisk(skills);
    res.json({ ok: true, nextId: nextId(skills) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

app.listen(PORT, () => {
  ensureDataFile();
  console.log(`Skill API listening on http://localhost:${PORT}`);
  console.log(`Excel file: ${XLSX_PATH}`);
});
