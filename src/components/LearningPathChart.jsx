import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const tickProps = { fontSize: 12, fill: "var(--app-chart-tick)" };

export default function LearningPathChart({ data, horizonDays }) {
  return (
    <div className="app-chart-wrap">
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data} margin={{ top: 16, right: 22, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--app-chart-grid)" />
          <XAxis
            dataKey="day"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={tickProps}
            tickFormatter={(v) => {
              const daysAgo = Math.round(horizonDays - v);
              if (daysAgo <= 0) return "Now";
              return `${daysAgo}d ago`;
            }}
            label={{
              value: "Time (recent → today)",
              position: "insideBottom",
              offset: -10,
              fontSize: 12,
              fill: "var(--app-chart-tick)",
            }}
          />
          <YAxis
            domain={[0, 100]}
            tick={tickProps}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Retention"]}
            labelFormatter={(day) => {
              const daysAgo = Math.round(horizonDays - Number(day));
              return daysAgo <= 0 ? "Today" : `≈ ${daysAgo} days ago`;
            }}
          />
          <Line
            type="linear"
            dataKey="path"
            name="Your learning path"
            stroke="var(--app-chart-path)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
