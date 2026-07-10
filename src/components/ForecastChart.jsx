import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const tickProps = { fontSize: 12, fill: "var(--app-chart-tick)" };

export default function ForecastChart({ data }) {
  return (
    <div className="app-chart-wrap">
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data} margin={{ top: 16, right: 22, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--app-chart-grid)" />
          <XAxis
            dataKey="day"
            tick={tickProps}
            label={{
              value: "Days from today (if you never practice again)",
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
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label) => `Day ${label} from today`}
          />
          <Line
            type="monotone"
            dataKey="retention"
            name="Retention forecast"
            stroke="var(--app-chart-forecast)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
