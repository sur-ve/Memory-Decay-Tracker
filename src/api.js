async function parseError(res) {
  try {
    const j = await res.json();
    return j.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function getSkills() {
  const r = await fetch("/api/skills");
  if (!r.ok) throw new Error(await parseError(r));
  return r.json();
}

export async function createSkill(body) {
  const r = await fetch("/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await parseError(r));
  return r.json();
}

export async function patchSkill(id, patch) {
  const r = await fetch(`/api/skills/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(await parseError(r));
  return r.json();
}

export async function deleteSkill(id) {
  const r = await fetch(`/api/skills/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error(await parseError(r));
  return r.json();
}
