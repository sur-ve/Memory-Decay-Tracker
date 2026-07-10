import { useState, useMemo, useEffect, useCallback } from "react";
import { normalizeSkill } from "./constants.js";
import { nowMs, daysElapsed, retention } from "./utils/decay.js";
import * as api from "./api.js";
import "./App.css";
import Header from "./components/Header.jsx";
import AboutMath from "./components/AboutMath.jsx";
import Dashboard from "./components/Dashboard.jsx";
import SkillLog from "./components/SkillLog.jsx";

export default function App() {
  const [skills, setSkills] = useState([]);
  const [apiReady, setApiReady] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [form, setForm] = useState({ name: "", strength: 0.3 });
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [practicedId, setPracticedId] = useState(null);
  const [tick, setTick] = useState(0);

  const refreshSkills = useCallback(async () => {
    const data = await api.getSkills();
    setSkills(data.skills.map(normalizeSkill));
    setApiError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refreshSkills();
      } catch (e) {
        if (!cancelled) setApiError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setApiReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshSkills]);

  useEffect(() => {
    const id = setInterval(() => setTick((prev) => prev + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const heatmapSkills = useMemo(
    () =>
      skills
        .map((skill) => {
          const elapsed = daysElapsed(skill.practicedAt);
          return {
            ...skill,
            elapsed,
            currentRetention: Math.round(retention(elapsed, skill.strength) * 100),
            r3: Math.round(retention(elapsed + 3, skill.strength) * 100),
            r7: Math.round(retention(elapsed + 7, skill.strength) * 100),
            r14: Math.round(retention(elapsed + 14, skill.strength) * 100),
            r30: Math.round(retention(elapsed + 30, skill.strength) * 100),
            r60: Math.round(retention(elapsed + 60, skill.strength) * 100),
          };
        })
        .sort((a, b) => a.currentRetention - b.currentRetention),
    [skills, tick],
  );

  useEffect(() => {
    if (skills.length === 0) {
      setSelectedSkillId(null);
      return;
    }
    if (selectedSkillId == null || !skills.some((s) => s.id === selectedSkillId)) {
      setSelectedSkillId(skills[0].id);
    }
  }, [skills, selectedSkillId]);

  async function addSkill() {
    if (!form.name.trim()) return;
    try {
      const { skill } = await api.createSkill({
        name: form.name.trim(),
        strength: form.strength,
      });
      const normalized = normalizeSkill(skill);
      setSkills((prev) => [...prev, normalized]);
      setForm({ name: "", strength: 0.3 });
      setSelectedSkillId(normalized.id);
      setApiError(null);
    } catch (e) {
      setApiError(e?.message ?? String(e));
    }
  }

  async function removeSkill(skillId) {
    try {
      await api.deleteSkill(skillId);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      setApiError(null);
    } catch (e) {
      setApiError(e?.message ?? String(e));
    }
  }

  async function updateSkill(skillId, patch) {
    try {
      const { skill } = await api.patchSkill(skillId, patch);
      const normalized = normalizeSkill(skill);
      setSkills((prev) => prev.map((s) => (s.id === skillId ? normalized : s)));
      setApiError(null);
    } catch (e) {
      setApiError(e?.message ?? String(e));
    }
  }

  async function practiceSkill(skillId) {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) return;
    const ts = nowMs();
    const history = skill.practiceHistory?.length ? [...skill.practiceHistory, ts] : [skill.practicedAt, ts];
    const patch = {
      practicedAt: ts,
      strength: Math.min(1, skill.strength + 0.15),
      practiceHistory: history,
    };
    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? normalizeSkill({ ...s, ...patch }) : s)),
    );
    setPracticedId(skillId);
    setTimeout(() => setPracticedId(null), 1800);
    try {
      await api.patchSkill(skillId, patch);
      setApiError(null);
    } catch (e) {
      setApiError(e?.message ?? String(e));
      try {
        await refreshSkills();
      } catch {
      }
    }
  }

  return (
    <div className="app">
      {apiError && (
        <div className="app-api-banner" role="alert">
          <span>{apiError}</span>
          <button
            type="button"
            className="app-button app-button--secondary"
            onClick={() => {
              refreshSkills().catch((e) => setApiError(e?.message ?? String(e)));
            }}
          >
            Retry sync
          </button>
        </div>
      )}
      <div className="app-container">
        <Header activePage={activePage} onNavigate={setActivePage} />

        {!apiReady ? (
          <div className="app-panel app-panel--loading">
            <p className="app-loading-text">Loading skills…</p>
          </div>
        ) : (
          <>
            {activePage === "about" && <AboutMath />}
            {activePage === "dashboard" && (
              <Dashboard
                skills={skills}
                heatmapSkills={heatmapSkills}
                selectedSkillId={selectedSkillId}
                setSelectedSkillId={setSelectedSkillId}
                tick={tick}
              />
            )}
            {activePage === "log" && (
              <SkillLog
                skills={skills}
                form={form}
                setForm={setForm}
                editingId={editingId}
                setEditingId={setEditingId}
                practicedId={practicedId}
                addSkill={addSkill}
                removeSkill={removeSkill}
                updateSkill={updateSkill}
                practiceSkill={practiceSkill}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
