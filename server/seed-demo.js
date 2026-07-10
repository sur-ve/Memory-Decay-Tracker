const API = "http://localhost:3001";
const DAY = 86400000;
const now = Date.now();

const DEMO_SKILLS = [
  { name: "TypeScript Generics", strength: 0.85, daysAgo: 1  },
  { name: "React Hooks",         strength: 0.65, daysAgo: 5  },
  { name: "Node.js Streams",     strength: 0.5,  daysAgo: 6  },
  { name: "CSS Flexbox",         strength: 0.4,  daysAgo: 8  },
  { name: "SQL Joins",           strength: 0.3,  daysAgo: 12 },
  { name: "Git Rebase",          strength: 0.35, daysAgo: 14 },
  { name: "Docker Compose",      strength: 0.2,  daysAgo: 18 },
];

async function seed() {
  console.log("Seeding demo skills...\n");

  for (const s of DEMO_SKILLS) {
    const practicedAt = now - s.daysAgo * DAY;

    const createRes = await fetch(`${API}/api/skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: s.name, strength: s.strength }),
    });

    if (!createRes.ok) {
      console.error(`Failed to create "${s.name}":`, await createRes.text());
      continue;
    }

    const { skill } = await createRes.json();

    // 2. Patch the timestamp back in time
    const patchRes = await fetch(`${API}/api/skills/${skill.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        practicedAt,
        practiceHistory: [practicedAt],
      }),
    });

    if (!patchRes.ok) {
      console.error(`Failed to backdate "${s.name}":`, await patchRes.text());
      continue;
    }

    const retention = Math.round(
      Math.exp(-s.daysAgo / (s.strength * 30 + 1)) * 100
    );

    console.log(`✓  ${s.name.padEnd(22)} ${retention}% retention`);
  }

  console.log("\nDone. Refresh your app to see the heatmap.");
}

seed().catch((e) => {
  console.error("Seed failed:", e.message);
  console.error("Is your server running on port 3001?");
  process.exit(1);
});