export const nowMs = () => Date.now();

export const MS_PER_DAY = 86400000;

export function daysElapsed(ts, now = Date.now()) {
  return (now - ts) / MS_PER_DAY;
}

export function retention(tDays, strength) {
  return Math.exp(-tDays / (strength * 30 + 1));
}

export function retentionFromSkill(skill, now = Date.now()) {
  return Math.round(retention(daysElapsed(skill.practicedAt, now), skill.strength) * 100);
}

/** Future projection if you never practice again (days 0…horizon from today). */
export function buildForecastTimeline(skill, days = 30, now = Date.now()) {
  const elapsed = daysElapsed(skill.practicedAt, now);
  return Array.from({ length: days + 1 }, (_, day) => ({
    day,
    retention: parseFloat((retention(elapsed + day, skill.strength) * 100).toFixed(1)),
  }));
}

function lastPracticeAtOrBefore(practices, t) {
  let last = null;
  for (const p of practices) {
    if (p <= t) last = p;
    else break;
  }
  return last;
}


export function buildHistoricalLearningPath(skill, horizonDays = 90, now = Date.now()) {
  const S = skill.strength;
  const practices = [
    ...(skill.practiceHistory?.length ? skill.practiceHistory : [skill.practicedAt]),
  ].sort((a, b) => a - b);
  const windowStart = now - horizonDays * MS_PER_DAY;

  function valueAt(t) {
    const last = lastPracticeAtOrBefore(practices, t);
    if (last == null) return null;
    return retention((t - last) / MS_PER_DAY, S) * 100;
  }

  const points = [];
  const steps = horizonDays * 4;
  for (let s = 0; s <= steps; s++) {
    const t = windowStart + (s / 4) * MS_PER_DAY;
    if (t > now) break;
    const x = s / 4;
    const v = valueAt(t);
    if (v != null) points.push({ day: Number(x.toFixed(3)), path: parseFloat(v.toFixed(1)) });
  }

  for (const p of practices) {
    if (p <= windowStart || p > now) continue;
    const x = (p - windowStart) / MS_PER_DAY;
    const vBefore = valueAt(p - 1);
    if (vBefore != null) points.push({ day: x - 0.002, path: parseFloat(vBefore.toFixed(1)) });
    points.push({ day: x, path: 100 });
  }

  points.sort((a, b) => a.day - b.day);
  return points;
}

export function heatColor(r) {
  if (r <= 20) return { bg: "#5c1a1a", text: "#ff7070", border: "#992828" };
  if (r <= 40) return { bg: "#5c2c12", text: "#ffaa5a", border: "#994a1e" };
  if (r <= 60) return { bg: "#4a4a12", text: "#f0f06a", border: "#7a7a1e" };
  if (r <= 80) return { bg: "#1a4d28", text: "#6ff09a", border: "#2a8042" };
  return      { bg: "#1a4a5c", text: "#7de8ff", border: "#2a7a99" };
}

export function fmt(ts) {
  const d = daysElapsed(ts);
  if (d < 1 / 24) return "just now";
  if (d < 1) return `${Math.floor(d * 24)}h ago`;
  if (d < 2) return "1 day ago";
  return `${Math.floor(d)} days ago`;
}
