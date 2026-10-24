import { describe, it, expect } from "vitest";
import content from "../src/generated/content.json";
import { parseImport } from "../src/store";
import type { Content } from "../src/types";

const C = content as unknown as Content;

describe("importing an assessment file", () => {
  it("rejects files that aren't assessments", () => {
    expect(parseImport("not json", C).error).toBeTruthy();
    expect(parseImport(JSON.stringify({ hello: 1 }), C).error).toBeTruthy();
  });

  it("keeps known answers and drops anything unrecognised", () => {
    const file = {
      format: "ux-health-check-assessment", content_version: "1.40", type: "simple",
      service: { name: "<b>Portal</b>", date: "2026-10-24" },
      answers: { "ACC-01": "yes", "ACC-02": "maybe", "OLD-99": "no" },
      materiality: { "MAT-01": 5, "MAT-02": 9 },
      agreed_tier: "diamond",
    };
    const r = parseImport(JSON.stringify(file), C);
    expect(r.error).toBeUndefined();
    const a = r.assessment!;
    expect(a.service.name).toBe("<b>Portal</b>"); // stored as text, never rendered as HTML
    expect(a.answers).toEqual({ "ACC-01": "yes" });
    expect(a.materiality).toEqual({ "MAT-01": 5 });
    expect(a.agreed_tier).toBe("");
    expect(r.warnings.length).toBe(2); // unknown question + older question set
  });
});
