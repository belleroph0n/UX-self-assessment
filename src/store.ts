// Saving, loading, exporting and importing assessments.
// Everything stays in the person's browser; nothing is sent anywhere.

import type { Answer, Assessment, Content } from "./types";
import { newAssessment } from "./scoring";

const KEY = "ux-health-check:assessment";

export function loadSaved(): Assessment | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Assessment;
  } catch {
    return null;
  }
}

export function save(a: Assessment): boolean {
  a.updated = new Date().toISOString();
  try {
    localStorage.setItem(KEY, JSON.stringify(a));
    return true;
  } catch {
    return false; // storage unavailable (private browsing, blocked); export still works
  }
}

export function clearSaved(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function exportFile(a: Assessment): void {
  const name = (a.service.name || "assessment").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const blob = new Blob([JSON.stringify(a, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ux-health-check-${name}-${a.service.date || "undated"}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface ImportResult { assessment?: Assessment; error?: string; warnings: string[]; }

const ANSWERS: Answer[] = ["yes", "partial", "no", "na"];
const str = (v: unknown, max = 500) => (typeof v === "string" ? v.slice(0, max) : "");

/** Reads an exported file, keeping only fields and values the app recognises. */
export function parseImport(text: string, content: Content): ImportResult {
  const warnings: string[] = [];
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    return { error: "This file isn't a UX health check assessment. Choose a .json file downloaded from this tool.", warnings };
  }
  if (!data || data.format !== "ux-health-check-assessment") {
    return { error: "This file isn't a UX health check assessment. Choose a .json file downloaded from this tool.", warnings };
  }
  const a = newAssessment(content, data.type === "detailed" ? "detailed" : "simple");
  const s = data.service ?? {};
  a.service = { name: str(s.name, 200), organisation: str(s.organisation, 200), assessor: str(s.assessor, 200),
                date: /^\d{4}-\d{2}-\d{2}$/.test(s.date) ? s.date : a.service.date, url: str(s.url, 500) };
  for (const p of content.profile) {
    if (typeof data.profile?.[p.id] === "boolean") a.profile[p.id] = data.profile[p.id];
  }
  const ids = new Set(content.criteria.map((c) => c.id));
  let unknown = 0;
  for (const [id, v] of Object.entries(data.answers ?? {})) {
    if (!ids.has(id)) { unknown++; continue; }
    if (ANSWERS.includes(v as Answer)) a.answers[id] = v as Answer;
  }
  for (const [id, v] of Object.entries(data.notes ?? {})) {
    if (ids.has(id) && typeof v === "string") a.notes[id] = v.slice(0, 2000);
  }
  const factors = new Set(content.materiality.factors.map((f) => f.id));
  for (const [id, v] of Object.entries(data.materiality ?? {})) {
    if (factors.has(id) && Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 5) a.materiality[id] = v as number;
  }
  if (content.tiers.tiers.some((t) => t.id === data.agreed_tier)) a.agreed_tier = data.agreed_tier;
  a.agreed_tier_reason = str(data.agreed_tier_reason, 1000);
  if (unknown) warnings.push(`${unknown} answer(s) in the file are for questions that are no longer in the question set, so they were left out.`);
  if (data.content_version && data.content_version !== content.meta.content_version) {
    warnings.push(`This assessment was completed with question set v${data.content_version}. The current question set is v${content.meta.content_version}, so some questions or scoring may differ.`);
  }
  return { assessment: a, warnings };
}
