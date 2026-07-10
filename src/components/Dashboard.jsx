import { useMemo, useState } from "react";
import { retentionFromSkill, buildForecastTimeline, buildHistoricalLearningPath } from "../utils/decay.js";
import ForecastChart from "./ForecastChart.jsx";
import LearningPathChart from "./LearningPathChart.jsx";
import PriorityHeatmap from "./PriorityHeatmap.jsx";

const HISTORY_HORIZON = 90;

export default function Dashboard({
  skills,
  heatmapSkills,
  selectedSkillId,
  setSelectedSkillId,
  tick,
}) {
  const [showLearningPath, setShowLearningPath] = useState(false);

  const selectedSkill = useMemo(() => {
    if (skills.length === 0) return null;
    return skills.find((s) => s.id === selectedSkillId) ?? skills[0];
  }, [skills, selectedSkillId]);

  const forecastData = useMemo(() => {
    if (!selectedSkill) return [];
    return buildForecastTimeline(selectedSkill, 30);
  }, [selectedSkill, tick]);

  const pathData = useMemo(() => {
    if (!selectedSkill) return [];
    return buildHistoricalLearningPath(selectedSkill, HISTORY_HORIZON);
  }, [selectedSkill, tick]);

  const lowCount = heatmapSkills.filter((s) => s.currentRetention <= 40).length;
  const nextPractice = heatmapSkills[0];

  if (skills.length === 0) {
    return (
      <div className="app-panel">
        <p className="app-description">
          Add a skill using <strong>Log skills</strong> to see retention charts and the priority map.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="app-stat-grid">
        <div className="about-fact">
          <div className="app-stat-label">Tracked skills</div>
          <div className="app-stat-value">{skills.length}</div>
          <div className="app-stat-note">Skills being monitored.</div>
        </div>
        <div className="about-fact">
          <div className="app-stat-label">Low retention</div>
          <div className={lowCount > 0 ? "app-stat-value--accent" : "app-stat-value"}>{lowCount}</div>
          <div className="app-stat-note">Skills having 40% or lower memory retention.</div>
        </div>
        <div className="about-fact">
          <div className="app-stat-label">Recommended Skill Review</div>
          <div className="app-stat-value-serif">{nextPractice?.name ?? "—"}</div>
          <div className="app-stat-note">
            {nextPractice ? `${nextPractice.currentRetention}% memory retention remaining.` : ""}
          </div>
        </div>
      </div>

      <PriorityHeatmap heatmapSkills={heatmapSkills} />

      <div className="skill-forecast-divider">
        <div className="app-forecast-head">
          <span className="app-section-title">Skill Retention Forecast</span>
          <select
            className="app-select"
            value={selectedSkillId}
            onChange={(e) => setSelectedSkillId(Number(e.target.value))}
          >
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <span className="app-section-sub">
            {selectedSkill ? `${retentionFromSkill(selectedSkill)}% now` : ""}
          </span>
        </div>
        <ForecastChart data={forecastData} />
      </div>

      <div className="app-learning-path-toolbar">
        <button
          type="button"
          className="app-button app-button--secondary"
          onClick={() => setShowLearningPath((v) => !v)}
        >
          {showLearningPath ? "Hide learning path" : "Show learning path"}
        </button>
        <span className="app-text-muted">
          Your skill retention spikes over the last {HISTORY_HORIZON} days.
        </span>
      </div>

      {showLearningPath && (
        <div className="app-learning-path-block">
          <div className="app-section-head">
            <span className="app-section-title">Learning path</span>
            <span className="app-section-sub">logged practices</span>
          </div>
          <LearningPathChart data={pathData} horizonDays={HISTORY_HORIZON} />
        </div>
      )}
    </>
  );
}
