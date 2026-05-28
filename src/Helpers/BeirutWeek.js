// ── Beirut week-start utilities ─────────────────────────────────────────────
// Mirrors the equivalent helpers in Way-Admin/Way-Backend so all three apps
// agree on what "this week" means. If you change the rule here, change it
// there. Asia/Beirut, Monday 00:00.

const STUDIO_TZ = "Asia/Beirut";

const DAYS_FROM_MONDAY = {
  Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
};

// Returns the Monday of the week (Asia/Beirut) containing `date`, formatted
// YYYY-MM-DD. Defaults to "right now."
export function getBeirutWeekStart(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STUDIO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;
  const weekday = parts.find((p) => p.type === "weekday").value;
  const local = new Date(`${y}-${m}-${d}T00:00:00Z`);
  local.setUTCDate(local.getUTCDate() - DAYS_FROM_MONDAY[weekday]);
  return local.toISOString().slice(0, 10);
}

// Adds `days` (can be negative) to a YYYY-MM-DD string and returns YYYY-MM-DD.
export function addDays(yyyyMmDd, days) {
  const d = new Date(`${yyyyMmDd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Formats YYYY-MM-DD as "May 25 – 31" for the week-navigator header.
export function formatWeekRange(weekStart) {
  const start = new Date(`${weekStart}T00:00:00Z`);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt(start)} – ${fmt(end)}`;
}
