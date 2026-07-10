import { PALETTE, STRENGTH_LABELS } from "../constants.js";
import { daysElapsed, fmt, retentionFromSkill, nowMs, MS_PER_DAY } from "../utils/decay.js";

export default function SkillLog({
  skills,
  form,
  setForm,
  editingId,
  setEditingId,
  practicedId,
  addSkill,
  removeSkill,
  updateSkill,
  practiceSkill,
}) {
  return (
    <div className="app-panel">
      <div className="app-skill-stack">
        <div>
          <h2 className="app-section-title">Add a new skill</h2>
          <div className="app-form-grid">
            <div>
              <label className="app-label" htmlFor="skill-name-input">
                Skill:
              </label>
              <input
                id="skill-name-input"
                className="app-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Example: React Hooks"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addSkill();
                }}
              />
            </div>
            <div>
              <label className="app-label" htmlFor="skill-strength-input">
                Mastery level
              </label>
              <input
                id="skill-strength-input"
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={form.strength}
                onChange={(e) => setForm({ ...form, strength: parseFloat(e.target.value) })}
                className="app-input app-input--range"
              />
              <div className="app-strength-hint">
                {STRENGTH_LABELS[Math.min(4, Math.floor(form.strength * 5))]} ({Math.round(form.strength * 100)}%)
              </div>
            </div>
          </div>
          <div className="app-form-actions">
            <button type="button" className="app-button app-button--primary" onClick={addSkill}>
              Save skill
            </button>
            <button
              type="button"
              className="app-button app-button--secondary"
              onClick={() => setForm({ name: "", strength: 0.3 })}
            >
              Reset
            </button>
          </div>
        </div>

        <div>
          <h2 className="app-section-title">Existing skills</h2>
          <div className="app-skill-list">
            {skills.map((skill, index) => {
              const retentionPercent = retentionFromSkill(skill);
              const danger = retentionPercent <= 20;
              const isEditing = editingId === skill.id;
              const practiceCount = skill.practiceHistory?.length ?? 1;
              return (
                <div key={skill.id} className="app-skill-card">
                  <div className="app-skill-card__row">
                    <div className="app-skill-card__meta">
                      <span
                        className="app-skill-dot"
                        style={{ background: PALETTE[index % PALETTE.length] }}
                      />
                      <div>
                        <div className="app-skill-name">{skill.name}</div>
                        <div className="app-skill-time">{fmt(skill.practicedAt)}</div>
                        <div className="app-skill-practice-count">
                          {practiceCount === 1 ? "1 logged practice" : `${practiceCount} logged practices`}
                        </div>
                      </div>
                    </div>
                    <div className="app-skill-actions">
                      <span className={`app-chip${danger ? " app-chip--danger" : " app-chip--ok"}`}>
                        {retentionPercent}%
                      </span>
                      <button
                        type="button"
                        onClick={() => practiceSkill(skill.id)}
                        className="app-button app-button--secondary"
                      >
                        {practicedId === skill.id ? "Refreshed" : "Practice"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(isEditing ? null : skill.id)}
                        className="app-button app-button--secondary"
                      >
                        {isEditing ? "Done" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.id)}
                        className="app-button app-button--secondary"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="app-edit-grid">
                      <div>
                        <label className="app-label" htmlFor={`strength-${skill.id}`}>
                          Strength
                        </label>
                        <input
                          id={`strength-${skill.id}`}
                          type="range"
                          min={0.05}
                          max={1}
                          step={0.05}
                          value={skill.strength}
                          onChange={(e) => updateSkill(skill.id, { strength: parseFloat(e.target.value) })}
                          className="app-range-full"
                        />
                      </div>
                      <div>
                        <label className="app-label" htmlFor={`last-${skill.id}`}>
                          Last practiced (days ago)
                        </label>
                        <input
                          id={`last-${skill.id}`}
                          type="range"
                          min={0}
                          max={60}
                          step={1}
                          value={Math.round(daysElapsed(skill.practicedAt))}
                          onChange={(e) => {
                            const days = parseInt(e.target.value, 10);
                            const newAt = nowMs() - days * MS_PER_DAY;
                            updateSkill(skill.id, {
                              practicedAt: newAt,
                              practiceHistory:
                                skill.practiceHistory?.length > 1
                                  ? [...skill.practiceHistory.slice(0, -1), newAt]
                                  : [newAt],
                            });
                          }}
                          className="app-range-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
