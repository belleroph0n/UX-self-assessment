// Scoring rules for the UX health score and the materiality rating.
// These reproduce the v1.51 criteria workbook; tests/scoring.test.ts checks them against it.
// This module has no browser code, so it can be tested and reused on its own.

import type {
  Answer, Assessment, AssessmentType, Category, Content, Criterion, MaterialityLevel, Rating, ScoreColour, Tier,
} from "./types";

/** The criteria in an assessment of the given type, in content order. */
export function criteriaFor(content: Content, type: AssessmentType): Criterion[] {
  return type === "simple"
    ? content.criteria.filter((c) => c.weight === content.scoring.simple_set_weight)
    : content.criteria.slice();
}

/** True when a criterion applies, given the service profile answers. */
export function applies(c: Criterion, profile: Assessment["profile"]): boolean {
  return c.applies_to === "all" || profile[c.applies_to] === true;
}

/** The answer used for scoring: criteria that don't apply count as N/A. */
export function effectiveAnswer(c: Criterion, a: Assessment): Answer | undefined {
  if (!applies(c, a.profile)) return "na";
  return a.answers[c.id];
}

function points(content: Content, ans: Answer | undefined): number | null {
  if (ans === "yes") return content.scoring.answer_points.yes;
  if (ans === "partial") return content.scoring.answer_points.partial;
  if (ans === "no") return content.scoring.answer_points.no;
  return null; // N/A or unanswered: excluded
}

export interface CategoryResult {
  category: Category;
  asked: number;
  answered: number;
  earned: number;
  available: number;
  percent: number | null;
  score: number | null;
}

export interface RecommendationItem {
  criterion: Criterion;
  answer: Answer;
  pointsLost: number;
  criticalFailure: boolean;
}

export interface UxResult {
  raw: number | null;
  final: number | null;
  criticalFailures: Criterion[];
  rating: Rating | null;
  colour: ScoreColour | null;
  answered: number;
  na: number;
  unanswered: number;
  total: number;
  categories: CategoryResult[];
  recommendations: RecommendationItem[]; // all Partial/No, ranked
  key: RecommendationItem[]; // top N
}

export function ratingFor(content: Content, score: number): Rating {
  // ratings are listed highest first; the last has min 0
  return content.scoring.ratings.find((r) => score >= r.min) ?? content.scoring.ratings[content.scoring.ratings.length - 1];
}

export function scoreUx(content: Content, a: Assessment): UxResult {
  const list = criteriaFor(content, a.type);
  const categories: CategoryResult[] = content.categories
    .map((category) => {
      const items = list.filter((c) => c.category === category.id);
      let earned = 0, available = 0, answered = 0;
      for (const c of items) {
        const ans = effectiveAnswer(c, a);
        if (ans) answered++;
        const p = points(content, ans);
        if (p !== null) { earned += c.weight * p; available += c.weight; }
      }
      const percent = available > 0 ? earned / available : null;
      return { category, asked: items.length, answered, earned, available, percent,
               score: percent === null ? null : percent * category.points };
    })
    .filter((r) => r.asked > 0);

  const scored = categories.filter((r) => r.score !== null);
  const pointsInPlay = scored.reduce((s, r) => s + r.category.points, 0);
  const raw = pointsInPlay > 0 ? (scored.reduce((s, r) => s + (r.score as number), 0) / pointsInPlay) * 100 : null;

  const criticalFailures = list.filter((c) => c.critical && effectiveAnswer(c, a) === "no");
  const final = raw === null ? null : criticalFailures.length > 0 ? Math.min(raw, content.scoring.critical_cap) : raw;
  const rating = final === null ? null : ratingFor(content, final);
  const colour: ScoreColour | null = final === null ? null : criticalFailures.length > 0 ? "red" : rating!.colour;

  const byCat = new Map(categories.map((r) => [r.category.id, r]));
  const recommendations: RecommendationItem[] = [];
  list.forEach((c) => {
    const ans = effectiveAnswer(c, a);
    if (ans !== "partial" && ans !== "no") return;
    const cat = byCat.get(c.category)!;
    const p = points(content, ans) as number;
    recommendations.push({
      criterion: c, answer: ans,
      pointsLost: ((1 - p) * c.weight / cat.available) * cat.category.points,
      criticalFailure: c.critical && ans === "no",
    });
  });
  // critical criteria answered No first, then most points lost; ties keep criterion order (sort is stable)
  recommendations.sort((x, y) => Number(y.criticalFailure) - Number(x.criticalFailure) || y.pointsLost - x.pointsLost);

  let answered = 0, na = 0, unanswered = 0;
  for (const c of list) {
    const ans = effectiveAnswer(c, a);
    if (!ans) unanswered++;
    else if (ans === "na") na++;
    else answered++;
  }

  return {
    raw, final, criticalFailures, rating, colour, answered, na, unanswered, total: list.length,
    categories, recommendations, key: recommendations.slice(0, content.scoring.key_recommendations),
  };
}

export interface MaterialityResult {
  answered: number;
  total: number;
  average: number | null;
  floorHits: number;
  rating: number | null;
  level: MaterialityLevel | null;
  suggestedTier: Tier | null;
  agreedTier: Tier | null;
  tier: Tier | null; // agreed if set, else suggested
}

/** Excel-style ROUND for positive numbers (halves round up). */
const round = (n: number) => Math.floor(n + 0.5 + 1e-9);

export function scoreMateriality(content: Content, a: Assessment): MaterialityResult {
  const m = content.materiality;
  let sum = 0, weights = 0, answered = 0, floorHits = 0;
  for (const f of m.factors) {
    const v = a.materiality[f.id];
    if (!v) continue;
    answered++; sum += v * f.weight; weights += f.weight;
    if (f.floor_trigger && v === 5) floorHits++;
  }
  const average = weights > 0 ? sum / weights : null;
  let rating = average === null ? null : round(average);
  if (rating !== null && floorHits > 0) rating = Math.max(rating, m.floor_minimum);
  const level = rating === null ? null : m.levels.find((l) => l.rating === rating) ?? null;
  const tierById = (id: string) => content.tiers.tiers.find((t) => t.id === id) ?? null;
  const suggestedTier = rating === null ? null : tierById(content.tiers.rating_to_tier[String(rating)]);
  const agreedTier = a.agreed_tier ? tierById(a.agreed_tier) : null;
  return { answered, total: m.factors.length, average, floorHits, rating, level, suggestedTier, agreedTier,
           tier: agreedTier ?? suggestedTier };
}

/** Whether the UX result meets the target rating for a tier (and has no critical criteria answered No). */
export function meetsTierTarget(content: Content, ux: UxResult, tier: Tier | null): boolean | null {
  if (!tier || ux.final === null) return null;
  const target = content.scoring.ratings.find((r) => r.id === tier.target_rating);
  if (!target) return null;
  return ux.criticalFailures.length === 0 && ux.final >= target.min;
}

export function newAssessment(content: Content, type: AssessmentType = "simple"): Assessment {
  return {
    format: "ux-health-check-assessment", format_version: 1, content_version: content.meta.content_version,
    type, service: { name: "", organisation: "", assessor: "", date: new Date().toISOString().slice(0, 10), url: "" },
    profile: {}, answers: {}, notes: {}, materiality: {}, agreed_tier: "", agreed_tier_reason: "",
    updated: new Date().toISOString(),
  };
}
