import { describe, it, expect } from "vitest";
import content from "../src/generated/content.json";
import fixture from "./fixtures/workbook-v1.51.json";
import { criteriaFor, meetsTierTarget, newAssessment, scoreMateriality, scoreUx } from "../src/scoring";
import type { Answer, Assessment, AssessmentType, Content } from "../src/types";

const C = content as unknown as Content;
const ALL_PROFILE = { "public-facing": true, transactional: true, authenticated: true, "uses-media": true, "uses-cms": true, "uses-ai": true };

function assessment(type: AssessmentType, answers: Record<string, string>, materiality: Record<string, number> = {}): Assessment {
  const a = newAssessment(C, type);
  a.profile = { ...ALL_PROFILE };
  a.answers = answers as Record<string, Answer>;
  a.materiality = materiality;
  return a;
}

describe("content", () => {
  it("has the expected simple set (all weight-3 criteria)", () => {
    expect(criteriaFor(C, "simple").map((c) => c.id)).toEqual(Object.keys(fixture.simple.answers));
  });
  it("covers all 10 categories in the simple set", () => {
    const cats = new Set(criteriaFor(C, "simple").map((c) => c.category));
    expect(cats.size).toBe(10);
  });
});

describe.each(["simple", "detailed"] as const)("UX health score matches the workbook (%s)", (type) => {
  const fx = fixture[type];
  const r = scoreUx(C, assessment(type, fx.answers));
  it("raw and final score", () => {
    expect(r.raw).toBeCloseTo(fx.expected.raw, 9);
    expect(r.final).toBeCloseTo(fx.expected.final, 9);
  });
  it("rating and critical failures", () => {
    expect(r.rating?.label).toBe(fx.expected.rating);
    expect(r.criticalFailures.length).toBe(fx.expected.critical_failures);
  });
  it("category scores", () => {
    for (const cat of r.categories) {
      expect(cat.score ?? 0).toBeCloseTo((fx.expected.categories as Record<string, number>)[cat.category.name], 9);
    }
  });
  it("points lost per criterion", () => {
    for (const rec of r.recommendations) {
      expect(rec.pointsLost).toBeCloseTo((fx.points_lost as Record<string, number>)[rec.criterion.id], 9);
    }
  });
  it("top 5 key recommendations", () => {
    expect(r.key.map((k) => k.criterion.id)).toEqual(fx.expected.top5);
  });
});

describe("critical failure rule", () => {
  it("caps the score, shows red and ranks the failure first", () => {
    const answers = { ...fixture.simple.answers, "ACC-05": "no" };
    const r = scoreUx(C, assessment("simple", answers));
    expect(r.criticalFailures.map((c) => c.id)).toEqual(["ACC-05"]);
    expect(r.final).toBeLessThanOrEqual(C.scoring.critical_cap);
    expect(r.colour).toBe("red");
    expect(r.key[0].criterion.id).toBe("ACC-05");
  });
  it("is not triggered by Partial", () => {
    const answers = { ...fixture.simple.answers, "ACC-05": "partial" };
    expect(scoreUx(C, assessment("simple", answers)).criticalFailures.length).toBe(0);
  });
});

describe("colour bands follow the ratings", () => {
  const cases: [number, string, string][] = [[100, "Healthy", "green"], [85, "Healthy", "green"], [84.9, "Good, with gaps", "yellow"],
    [70, "Good, with gaps", "yellow"], [69.9, "Needs attention", "amber"], [50, "Needs attention", "amber"], [49.9, "At risk", "red"]];
  it.each(cases)("score %d is %s (%s)", (score, label, colour) => {
    const rating = C.scoring.ratings.find((r) => score >= r.min)!;
    expect(rating.label).toBe(label);
    expect(rating.colour).toBe(colour);
  });
});

describe("N/A and service profile", () => {
  it("excludes a category answered entirely N/A and rescales to 100", () => {
    const allYes = Object.fromEntries(Object.keys(fixture.simple.answers).map((k) => [k, "yes"]));
    const r = scoreUx(C, assessment("simple", { ...allYes, "CON-01": "na" }));
    expect(r.final).toBeCloseTo(100, 9);
    expect(r.na).toBe(1);
  });
  it("treats criteria that don't apply to the service profile as N/A", () => {
    const a = assessment("simple", Object.fromEntries(Object.keys(fixture.simple.answers).map((k) => [k, "yes"])));
    a.profile = {}; // nothing applies beyond 'all'
    const r = scoreUx(C, a);
    const notAll = criteriaFor(C, "simple").filter((c) => c.applies_to !== "all").length;
    expect(r.na).toBe(notAll);
  });
  it("reports no score until something is answered", () => {
    const r = scoreUx(C, assessment("simple", {}));
    expect(r.final).toBeNull();
    expect(r.unanswered).toBe(19);
  });
});

describe("materiality", () => {
  it("matches the workbook sample", () => {
    const m = scoreMateriality(C, assessment("simple", {}, fixture.materiality.answers));
    expect(m.average).toBeCloseTo(fixture.materiality.expected.average, 9);
    expect(m.rating).toBe(fixture.materiality.expected.rating);
    expect(m.level?.label).toBe(fixture.materiality.expected.label);
    expect(m.suggestedTier?.name).toBe(fixture.materiality.expected.tier);
  });
  it("applies the floor rule when a floor-trigger factor is 5", () => {
    const answers = Object.fromEntries(C.materiality.factors.map((f) => [f.id, 1]));
    answers["MAT-02"] = 5;
    const m = scoreMateriality(C, assessment("simple", {}, answers));
    expect(m.average).toBeCloseTo(1.6, 9);
    expect(m.rating).toBe(4);
    expect(m.level?.label).toBe("High");
    expect(m.suggestedTier?.id).toBe("gold");
  });
  it("uses an agreed tier override when set", () => {
    const a = assessment("simple", {}, fixture.materiality.answers);
    a.agreed_tier = "platinum";
    const m = scoreMateriality(C, a);
    expect(m.suggestedTier?.id).toBe("silver");
    expect(m.tier?.id).toBe("platinum");
  });
  it("compares the UX score with the tier target", () => {
    const a = assessment("simple", fixture.simple.answers, fixture.materiality.answers);
    const ux = scoreUx(C, a); // 69.3, Needs attention
    const tiers = Object.fromEntries(C.tiers.tiers.map((t) => [t.id, t]));
    expect(meetsTierTarget(C, ux, tiers.silver)).toBe(true);
    expect(meetsTierTarget(C, ux, tiers.gold)).toBe(false);
  });
});
