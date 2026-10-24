// Shapes of the content files (see /content and /schema) and of a saved assessment.

export type Answer = "yes" | "partial" | "no" | "na";
export type AppliesTo = "all" | "public-facing" | "transactional" | "authenticated" | "uses-media" | "uses-cms" | "uses-ai";
export type ScoreColour = "green" | "yellow" | "amber" | "red";
export type MaterialityColour = "green" | "yellow-green" | "yellow" | "orange" | "red";

export interface Category { id: string; name: string; points: number; description: string; }

export interface Criterion {
  id: string; category: string; subcategory: string; question: string; evidence: string;
  weight: 1 | 2 | 3; critical: boolean; recommendation: string; source: string; source_version?: string;
  nz_status: "mandatory" | "recommended" | "good-practice"; applies_to: AppliesTo; review_note?: string;
  link: { label: string; url: string };
}

export interface Rating { id: string; label: string; min: number; colour: ScoreColour; }

export interface Scoring {
  answer_points: { yes: number; partial: number; no: number };
  critical_cap: number;
  ratings: Rating[];
  key_recommendations: number;
  simple_set_weight: number;
}

export interface MaterialityLevel { rating: number; label: string; meaning: string; colour: MaterialityColour; }
export interface MaterialityFactor {
  id: string; factor: string; question: string; anchors: string[]; weight: number; floor_trigger: boolean;
}
export interface MaterialityContent { floor_minimum: number; levels: MaterialityLevel[]; factors: MaterialityFactor[]; }

export interface Tier { id: string; name: string; target_rating: string; [field: string]: string; }
export interface TiersContent {
  status?: string; rating_to_tier: Record<string, string>; field_labels?: Record<string, string>; tiers: Tier[];
}

export interface Source {
  name: string; publisher: string; status?: string; nz_status?: string; url: string;
  link_check?: string; licence?: string; used_in?: string;
}

export interface ProfileQuestion { id: AppliesTo; question: string; hint?: string; }

export interface Content {
  meta: { title: string; content_version: string; released: string; audience?: string; licence?: string };
  categories: Category[];
  criteria: Criterion[];
  scoring: Scoring;
  materiality: MaterialityContent;
  tiers: TiersContent;
  sources: Source[];
  profile: ProfileQuestion[];
}

export type AssessmentType = "simple" | "detailed";

/** A saved assessment. This is what is exported to, and imported from, a file. */
export interface Assessment {
  format: "ux-health-check-assessment";
  format_version: 1;
  content_version: string;
  type: AssessmentType;
  service: { name: string; organisation: string; assessor: string; date: string; url: string };
  profile: Partial<Record<AppliesTo, boolean>>;
  answers: Record<string, Answer>;
  notes: Record<string, string>;
  materiality: Record<string, number>;
  agreed_tier: string;
  agreed_tier_reason: string;
  updated: string;
}
