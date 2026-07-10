import { heatColor } from "../utils/decay.js";

const HEADINGS = ["Skill", "Now", "+3d", "+7d", "+14d", "+30d", "+60d"];

function HeatPill({ value }) {
  const c = heatColor(value);
  return (
    <span
      className="app-heat-pill"
      style={{
        background: c.bg,
        color: c.text,
        borderColor: c.border ?? c.bg,
      }}
    >
      {value}%
    </span>
  );
}

export default function PriorityHeatmap({ heatmapSkills }) {
  return (
    <div className="app-table-wrap">
      <div className="app-section-head">
        <span className="app-section-title">Priority table</span>
        <span className="app-section-sub">sorted based on memory decay</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="app-table">
          <thead>
            <tr>
              {HEADINGS.map((h) => (
                <th key={h} className={`app-th${h === "Skill" ? "" : " app-th--center"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapSkills.map((skill) => (
              <tr key={skill.id}>
                <td className="app-td">
                  <div className="app-heatmap-name">
                    {skill.currentRetention <= 20 && <span className="app-review-badge">review</span>}
                    {skill.name}
                  </div>
                </td>
                <td className="app-td app-td--center">
                  <HeatPill value={skill.currentRetention} />
                </td>
                {[skill.r3, skill.r7, skill.r14, skill.r30, skill.r60].map((value, i) => (
                  <td key={i} className="app-td app-td--center">
                    <HeatPill value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
