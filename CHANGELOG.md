# Content changelog

History of the criteria library, carried over from the Version tab of the original workbook.
Each release records what changed and why.

## v1.52 - 27 Oct 2026

### Status

Released with app v1.0.0

### Prepared by

Drafted with Claude (Anthropic AI assistant) for the product owner

### Approved by

Product owner (belleroph0n)

### Summary

Tone changes so the tool reads as a supportive guide for product and delivery teams. Gaps are framed as improvement opportunities, while the colour, the critical criteria and the order of recommendations still show what matters most. No changes to questions, weights or scoring.

### Changes in this version

- Answer option "No" now reads "Not yet" (stored value unchanged, so earlier assessment files still open)
- Rating labels: Healthy to Strong; Good, with gaps to Good; Needs attention to Developing; At risk to Priority focus. Score bands and colours unchanged.
- "Critical failure(s)" now "critical criteria", for example "Capped at 60 until this critical criterion is in place"
- Service tier targets reworded, for example "Good (70+), with all critical criteria in place"
- Report: new "What's working well" section; "Key recommendations" now "Where to focus first" with an introductory line; "All recommendations" now "All improvement opportunities"; answers shown as "Not yet in place" or "Partly in place"; neutral note for unanswered questions; tier target shown as "Met" or "Working towards"; reworded closing paragraph
- Critical criteria hint on question pages reworded

### Rationale

People who complete the assessment already want to improve their application's user experience. Language that reads as criticism or oversight can discourage adoption. The changes keep the relative importance of recommendations clear while keeping the experience positive.

## v1.51 - 24 Oct 2026

### Status

Released for review and piloting

### Prepared by

Drafted with Claude (Anthropic AI assistant) for the product owner

### Approved by

To be confirmed by the product owner

### Summary

Formatting fix to the materiality colour key on the report.

### Changes in this version

- Report section 2 colour key (cell F13) now reads colour first, then rating, capitalised to match the UX health score key: Green 1 | Yellow-green 2 | Yellow 3 | Orange 4 | Red 5.

### How the framework was developed

Change made at the product owner's direction.

### Evidence base

No new sources.

### Structure and categories - rationale

Unchanged.

### Weighting and scoring - rationale

Unchanged.

### Critical criteria - rationale

Unchanged.

### Simple set - rationale

Unchanged: 19 questions.

### Link verification

No new links.

### Licensing and reuse

Unchanged.

### Known limitations and assumptions

All earlier limitations still apply.

### Next review triggers

All earlier review triggers still apply.

## v1.50 - 24 Oct 2026

### Status

Released for review and piloting

### Prepared by

Drafted with Claude (Anthropic AI assistant) for the product owner

### Approved by

To be confirmed by the product owner

### Summary

Adds an amber shade so each of the four ratings has its own colour on the report.

### Changes in this version

- Report section 1: green 85+ (Healthy), yellow 70 to below 85 (Good, with gaps), amber 50 to below 70 (Needs attention), red below 50 (At risk) or any critical failure. All bands read the thresholds on Scoring (simple); the colour key is generated from them.

### How the framework was developed

Change made at the product owner's direction.

### Evidence base

No new sources.

### Structure and categories - rationale

Unchanged.

### Weighting and scoring - rationale

One colour per rating band; a critical failure still overrides to red.

### Critical criteria - rationale

Unchanged.

### Simple set - rationale

Unchanged: 19 questions.

### Link verification

No new links.

### Licensing and reuse

Unchanged.

### Known limitations and assumptions

- The v1.40 limitation about yellow spanning two ratings is resolved.
- All other earlier limitations still apply.

### Next review triggers

- All earlier review triggers still apply.

## v1.40 - 24 Oct 2026

### Status

Released for review and piloting

### Prepared by

Drafted with Claude (Anthropic AI assistant) for the product owner

### Approved by

To be confirmed by the product owner

### Summary

Aligns the report's score colours with the rating bands, shows any critical failure in red, and reverses the materiality colours so red means critical.

### Changes in this version

- Report section 1: score and rating colours now follow the rating thresholds on Scoring (simple) - green at the Healthy threshold (85+), yellow from the Needs attention threshold up to Healthy (50 to below 85, covering Needs attention and Good, with gaps), red below 50 (At risk). Any critical criterion answered 'No' shows red regardless of score. The colour key is generated from the thresholds.
- Report section 2: materiality colours reversed - 1 green, 2 yellow-green, 3 yellow, 4 orange, 5 red.

### How the framework was developed

Changes made at the product owner's direction, resolving the two issues raised in v1.30.

### Evidence base

No new sources.

### Structure and categories - rationale

Colour rules read the thresholds from Scoring (simple), so changing a threshold there updates the colours and the key automatically.

### Weighting and scoring - rationale

- Three colours cover four ratings: green = Healthy; yellow = Good, with gaps and Needs attention; red = At risk or any critical failure.
- A score capped by a critical failure (60 or below) now shows red, consistent with the critical-failure rule.

### Critical criteria - rationale

Unchanged. Critical failures now also drive the red colour on the report.

### Simple set - rationale

Unchanged: 19 questions.

### Link verification

No new links.

### Licensing and reuse

Unchanged.

### Known limitations and assumptions

- Yellow spans two ratings; if a finer distinction is wanted, an amber shade could separate Needs attention from Good, with gaps.
- All earlier limitations still apply, except the v1.30 colour-band and materiality-colour points, which are resolved.

### Next review triggers

- All earlier review triggers still apply.

## v1.30 - 24 Oct 2026

### Status

Released for review and piloting

### Prepared by

Drafted with Claude (Anthropic AI assistant) for the product owner

### Approved by

To be confirmed by the product owner

### Summary

Improves the report layout: colour-coded score and materiality, a supporting link for every recommendation, and questions answered per category.

### Changes in this version

- Report section 1: score and rating cells shaded light red (0-50), light yellow (above 50 and below 80) or light green (80-100), driven by the score.
- Report section 2: materiality rating and label cells shaded by rating - 1 light red, 2 light orange (red-yellow), 3 light yellow, 4 light yellow-green, 5 light green.
- Report section 3: new Supporting link column. Every criterion now has a short link label (six words or fewer) and a link, held in new columns W-X of the Criteria tab and shown in Criteria (simple). Where no external guidance applies (e.g. organisation brand or tone of voice guidelines), the label tells the assessor to use their own organisation's guidance and no link is shown.
- Report section 4: new Questions column showing questions answered / asked per category (N/A counts as answered).

### How the framework was developed

- Colour bands and the materiality colour order were specified by the product owner.
- Supporting links: each criterion was matched to the most specific relevant page already verified for the Sources tab, or to a new deep link checked on 24 Oct 2026 (GOV.UK Service Standard points 1, 2, 3, 4, 6, 10, 13 and 14; GOV.UK pages on inclusive services and mobile; WCAG 2.2 quick reference; DSDS principles and principle 4; AU Digital Performance Standard criteria 1 and 2; NN/g heuristic evaluation and help and documentation articles; W3C ATAG overview).

### Evidence base

All supporting links are on pages checked live on 24 Oct 2026. Two candidate pages were rejected because they returned no readable content (DSDS principle 1 and the 'About the Web Accessibility Standard' page) and an NN/g article was rejected because it redirected in a loop; broader pages were used instead.

### Structure and categories - rationale

Supporting links are stored on the master Criteria tab so the app can show them for any recommendation, not just the top five.

### Weighting and scoring - rationale

- The report colour bands (red 0-50, yellow 51-79, green 80-100) are presentation bands and differ from the rating bands (At risk below 50, Needs attention 50-69, Good with gaps 70-84, Healthy 85+). For example a score of 82 shows green but is rated 'Good, with gaps'. Consider aligning the two.
- A capped score of 60 (critical failure) displays yellow.

### Critical criteria - rationale

Unchanged.

### Simple set - rationale

Unchanged: 19 questions. Each now carries a supporting link.

### Link verification

New deep links checked 24 Oct 2026 as listed under 'How the framework was developed'.

### Licensing and reuse

Links point to guidance; no content is reproduced.

### Known limitations and assumptions

- Materiality colours run from red (1, immaterial) to green (5, critical) as specified. Readers may associate green with 'good' or 'low risk'; add a legend in the app.
- Nine criteria rely on organisation-specific guidance and have no external link.
- All earlier limitations still apply.

### Next review triggers

- Decide whether to align report colour bands with rating bands.
- Replace 'use your organisation's guidance' labels with links to MCERT's brand, tone of voice and style guides when available.
- Re-check all supporting links at each version.

## v1.20 - 24 Oct 2026

### Status

Released for review and piloting

### Prepared by

Drafted with Claude (Anthropic AI assistant) for the product owner

### Approved by

To be confirmed by the product owner

### Summary

Adds proposed service tier definitions (Platinum, Gold, Silver, Bronze) linked to the materiality rating, and shows the suggested tier and its target UX health rating on the report. MCERT has no agreed tier definitions yet; these are proposals to confirm.

### Changes in this version

- New Service tiers tab: four tiers with availability targets, support hours, Priority 1 and 2 response and restore times, RTO and RPO, monitoring, maintenance notice, health check frequency, target UX health rating, remediation timeframes for findings, and reporting.
- Materiality tab: suggested service tier derived from the materiality rating (5 Platinum, 4 Gold, 3 Silver, 1-2 Bronze), plus an 'Agreed service tier' cell for overrides.
- Report (simple): shows the service tier (agreed, else suggested) and the tier's target UX health rating in the materiality section.
- MAT-02 renamed 'Organisation dependence' and tier names removed from its answer descriptions, so the tier is derived from materiality rather than feeding into it (avoids circular logic). The outage-impact wording is unchanged.

### How the framework was developed

- The product owner confirmed the materiality floor rule, the Planning Act and Natural Environment Act sources and LEG-09, and advised that MCERT has no tier definitions yet.
- Tier definitions were drafted to line up with the materiality scale and with targets commonly used in government and industry service tiering. Each tier links the two measures in the report: materiality sets the tier, and the tier sets the minimum UX health rating expected.
- Formulas tested, including overriding the suggested tier.

### Evidence base

Tier targets are proposals based on common service management and site reliability practice (ITIL incident priorities, availability and recovery objectives) and the AU Digital Performance Standard's focus on availability monitoring. They are not taken from a single published NZ standard.

### Structure and categories - rationale

Tiers sit on their own tab so they can be adopted (or replaced with MCERT's own definitions later) without changing the criteria or scoring.

### Weighting and scoring - rationale

- Rating to tier: 5 Platinum, 4 Gold, 3 Silver, 1-2 Bronze (editable on the Service tiers tab). Ratings 1 and 2 share Bronze because the support difference between them is too small to justify a separate tier.
- Target UX health rating rises with tier (Bronze: no critical failures; Silver: Needs attention or better; Gold: Good, with gaps or better; Platinum: Healthy), so higher-materiality services are held to a higher standard.
- Health check frequency and remediation timeframes shorten as the tier rises.

### Critical criteria - rationale

Unchanged. Every tier requires no critical criteria answered 'No'.

### Simple set - rationale

Unchanged: 19 questions. The suggested tier is reported with materiality, not added to the UX score.

### Link verification

No new external links in this version.

### Licensing and reuse

Unchanged from v1.00. Tier definitions are original wording.

### Known limitations and assumptions

- Tier targets are proposals and need confirming with the CDO, operations, suppliers and governance before they're used in contracts or SLAs. Cost of meeting Platinum and Gold targets (for example 24/7 support) hasn't been assessed.
- Until tiers are agreed, the suggested tier should be treated as indicative.
- All earlier limitations still apply.

### Next review triggers

- MCERT agrees tier definitions: replace or update the Service tiers tab.
- Supplier contracts reviewed against tier targets.
- All earlier review triggers still apply.

## v1.10 - 24 Oct 2026

### Status

Released for review and piloting

### Prepared by

Drafted with Claude (Anthropic AI assistant) for the product owner

### Approved by

To be confirmed by the product owner

### Summary

Extends v1.00 so the simple set covers all 10 categories and adds a separate materiality assessment. The detailed set now has 96 criteria and the simple set 19. Materiality is rated 1 (Immaterial) to 5 (Critical) from 10 factor questions and shown on the report separately from the UX health score.

### Changes in this version

- SEC-07 (privacy statement) raised from weight 2 to 3, so it joins the simple set.
- New LEG-09 (weight 3): catch-all legislative compliance criterion covering service-specific legislation (e.g. the Planning Act and Natural Environment Act, in force 30 Sep 2026) and the provisions on equal access, legal basis, public records and information access. LEG-02 to LEG-05 remain as the detailed checks.
- New CMG-07 Content management, CMG-08 Governance, MSR-06 Measurement and MSR-07 Continuous improvement (all weight 3), each with a note in the master list that weight 3 reflects their importance to app health and hygiene.
- Criteria (simple) now holds 19 questions across all 10 categories (previously 13 across 7). Scoring (simple) now uses the same category points as the detailed set.
- New Materiality tab: 10 factor questions with 1-5 anchors, weights, a floor rule, and the rating scale with suggested support posture.
- New Report (simple) tab: preview of the output report showing the UX health score, the materiality rating as a separate section, key recommendations and category results.
- Sources: Planning Act and Natural Environment Act added (links checked 24 Oct 2026).

### How the framework was developed

- Weight changes and new criteria were made at the product owner's direction. New criteria follow the same pattern as existing ones (single question, evidence prompt, recommendation, source, NZ status) and reuse sources already in the library.
- The materiality question set was created from the factors the product owner specified (user dependence, organisation dependence and service tier, relative importance, scope and scale of user base, frequency of access) plus four further factors that commonly drive service criticality: consequence of failure, time sensitivity, users at risk of exclusion, and sensitivity of information.
- Each factor has a defined anchor for every point on the 1-5 scale so different assessors rate consistently. The organisation dependence anchors use the product owner's examples (Gold: several hours outage may bring complaints from a small group of high-touch users; Platinum: may attract media attention).
- Scoring for both new tabs was tested with sample answers, including the floor rule, and all formulas recalculate without errors.

### Evidence base

- New sources: Planning Act and Natural Environment Act (Royal assent and in force 30 Sep 2026, confirmed through a law firm overview and a news report; official legislation.govt.nz pages not yet located).
- New criteria draw on sources already listed: GOV.UK Service Standard points 6, 8 and 10; AU Digital Performance Standard; AU Digital Service Standard criterion 10; Digital Service Design Standard; OMB M-23-22; W3C ATAG 2.0; and the legislation listed for LEG-02 to LEG-05.
- The materiality factors are original to this library and reflect common service-tiering and business impact practice; they are not taken from a single published standard.

### Structure and categories - rationale

Materiality is a separate dimension rather than an eleventh category. It measures how much the application matters, not how well it performs, so combining it into the 100-point score would blur both messages - a critical application with good UX and a minor application with poor UX could end up with similar numbers. Keeping it separate lets the report answer two questions: how healthy is the experience, and how much does that matter.

### Weighting and scoring - rationale

- Simple set: category points now match the detailed set because all 10 categories are represented.
- Materiality factor weights: 3 for user dependence, organisation dependence and consequence of failure (they most directly decide how much harm a failure causes); 2 for relative importance, scope, scale and users at risk of exclusion; 1 for frequency, time sensitivity and information sensitivity (these refine the picture and partly overlap with security criteria).
- Rating: the weighted average of answered factors, rounded to the nearest whole number (1-5). Unanswered factors are excluded.
- Floor rule: if user dependence, organisation dependence or consequence of failure is rated 5, the overall materiality can't be lower than 4 (High). Without this, a single decisive factor (e.g. a platinum-tier app used by a small team) could be averaged down to Moderate.

### Critical criteria - rationale

Unchanged from v1.00 - seven critical criteria. SEC-07 remains critical and is now in the simple set, so the simple set has seven critical criteria. LEG-09 and the four new hygiene criteria are weight 3 but not critical: a 'No' reduces the score substantially but doesn't on its own mean users can't use the service. Consider making LEG-09 critical once agencies have a legislation register in place.

### Simple set - rationale

The simple set is all weight-3 criteria: 19 questions covering all 10 categories, including privacy (SEC-07), legislative compliance (LEG-09), content management, governance, measurement and continuous improvement. Materiality is part of the simple assessment and is answered alongside it, but scored separately.

### Link verification

New sources checked on 24 Oct 2026: the Buddle Findlay overview and the Inside Government news report on the Planning Act and Natural Environment Act were both retrieved and confirmed. All other links unchanged from v1.00.

### Licensing and reuse

Unchanged from v1.00. New questions, anchors and recommendations are original wording.

### Known limitations and assumptions

- Materiality anchors, weights and the floor rule are expert judgements; validate them in piloting, especially the user-number bands for scale (fewer than 10 to 10,000 or more) and the service tier descriptions, which should match the organisation's own application tiering if one exists.
- Materiality is self-assessed; agencies may want the service owner and a governance group to confirm the rating.
- Planning Act and Natural Environment Act: implementation is phased and transitional provisions apply; LEG-09 asks agencies to confirm which provisions apply to their service.
- All v1.00 limitations still apply.

### Next review triggers

- Replace the Planning Act and Natural Environment Act overview links with the official legislation.govt.nz pages when available.
- Align the organisation dependence anchors (Platinum, Gold, Silver) with the agency's own application tiering if different.
- Review materiality weights and floor rule after piloting.
- All v1.00 review triggers still apply.

## v1.00 - 24 Oct 2026

### Status

Released for review and piloting

### Prepared by

Drafted with Claude (Anthropic AI assistant) for the product owner

### Approved by

To be confirmed by the product owner

### Summary

First released version of the UX Health Check criteria library for NZ Government agencies. It provides a detailed set of 91 self-assessment criteria across 10 categories, a simple set of 13 high-importance criteria intended as the basis of the app, scoring models for both that produce a score out of 100 with key recommendations, and a source register with links checked against live pages.

### Changes in this version

Supersedes working draft v0.1 (24 Oct 2026, not released).
- Sources: every link checked against live pages on 24 Oct 2026; links written from memory replaced with confirmed URLs (notably legislation.govt.nz, digital.govt.nz and digital.gov.au addresses); 'Link check' column added; new entries added so every source named in the criteria has an entry (e.g. Archives NZ IRM Standard, OPC PIA guidance, Identification Standards, RealMe, NZGOAL, Accessibility Charter, cloud risk guidance, Ombudsman, procurement framework, Public Service AI Framework, Plain Language Act Repeal Bill).
- Status updates found during checking: WCAG-EM 2.0 published 23 Jul 2026; WCAG 3.0 Working Draft updated 10 Sep 2026; EN 301 549 V4.1.1 adopted 24 Aug 2026; NZISM v3.9 released; Plain Language Act Repeal Bill introduced (first reading 1 Apr 2025, not enacted); CWAC licence corrected to GPL-3.0; DORA now uses five metrics; ITIL Version 5 available.
- Section references made precise where confirmed: Web Usability Standard 1.4 s2.2 (Government identity), s2.3 (Contact information, NZ Relay at s2.3.3), s2.4 (Copyright), s2.5 (Privacy); Web Accessibility Standard 1.2 s4 (assessment and reporting).
- OWASP ASVS: referenced by chapter ID only (V3, V6, V7, V12, V14, V15, V16, and V1-V17 for SEC-02); no ASVS text reproduced; review note added to each affected row.
- New tabs: Criteria (simple), Scoring (simple), Version.

### How the framework was developed

1. Landscape scan: searched for published, freely available UX and digital service assessment frameworks internationally. No existing free tool was found that combines UX, accessibility, brand, security, observability, support and legal obligations into one scored self-assessment, so the library was built by combining established published criteria.
2. NZ baseline first: current mandatory NZ standards and legislation were identified and their status confirmed (Web Accessibility Standard 1.2, Web Usability Standard 1.4, draft DAS, DSDS refresh, Privacy Act 2020, Public Records Act 2005, Plain Language Act 2022, NZISM/PSR).
3. International good practice added where NZ has no equivalent: GOV.UK Service Standard (user research, reliability, governance), Australia's Digital Service and Digital Performance Standards (monitoring, availability, satisfaction), US OMB M-23-22 (branding, content, search, analytics), OWASP ASVS (application security), W3C maturity, evaluation and authoring guidance, and recognised usability methods (Nielsen heuristics, ISO 9241-11, SUS).
4. Criteria written: each requirement was turned into a single self-assessment question answerable Yes / Partial / No / N/A, with an evidence prompt, an action-oriented recommendation, source and version, NZ status and applicability. Wording is original. The three example recommendations supplied at the outset (adaptive layout, proactive monitoring, brand guidelines) were included as UXD-01, OPS-02 and BRD-01.
5. Scoring designed and tested: weights, category points and critical flags assigned; scoring built as live spreadsheet formulas and tested with sample answers, including a test that a critical 'No' caps the score and ranks first in the recommendations.
6. Verification: all formulas recalculated with zero errors; every source link checked against the live page.

### Evidence base

52 sources are listed on the Sources tab. Core sources by area:
- Accessibility: WCAG 2.2, Web Accessibility Standard 1.2, draft DAS, EN 301 549 V4.1.1, WCAG-EM 2.0, W3C Accessibility Maturity Model, CWAC.
- Usability and design: GOV.UK Service Standard, AU Digital Service Standard 2.0, OMB M-23-22, Nielsen heuristics, ISO 9241-11, Core Web Vitals.
- Content and brand: Plain Language Act 2022, Web Usability Standard 1.4, organisation guidelines, Māori Language Act 2016, Accessibility Charter.
- Security and privacy: NZISM, PSR, OWASP ASVS 5.0.0, Privacy Act 2020, OPC PIA guidance, Identification Standards, GCDO cloud risk guidance.
- Operations and support: AU Digital Performance Standard, GOV.UK point 14, SRE practice, DORA, ITIL, Ombudsman guidance.
- Legal: Public Records Act 2005 and Archives IRM Standard, OIA 1982, Human Rights Act 1993, NZ Bill of Rights Act 1990, Public Service Act 2020 s14, Algorithm Charter, Public Service AI Framework, NZGOAL.

### Structure and categories - rationale

Ten categories were chosen to cover the full user experience, not only the interface: Accessibility; Usability and design; Content and tone of voice; Brand and visual consistency; Security and privacy; Reliability, observability and service levels; Support and contact channels; Legal and regulatory; Content management and governance; Measurement and continuous improvement. They map to the areas requested at the outset (accessibility for blind and low vision users, brand and tone, security and observability, legal and regulatory access requirements, support channels, outage SLAs and remediation, content management) plus governance and measurement, which international standards treat as necessary to maintain a good experience over time.
Each criterion has a stable ID (category prefix + number) so the app and reports can reference it across versions. 'Applies to' lets the app skip questions that don't fit a service (e.g. authenticated, media, AI).

### Weighting and scoring - rationale

- Category points (out of 100) reflect breadth of user impact and the weight of NZ mandatory obligations: Accessibility 20 (mandatory standard, largest user impact, explicit focus on blind and low vision users); Usability and design 15; Security and privacy 14; Reliability, observability and service levels 13; Content 8; Support 8; Brand 6; Legal 6; Content management 5; Measurement 5. Legal is weighted modestly because many legal obligations are also tested in other categories (accessibility, privacy, contact information).
- Criterion weights (1-3) set relative importance within a category: 3 where failure blocks users or breaches a core obligation; 2 for significant quality or compliance practices; 1 for supporting practices.
- Answers: Yes 1, Partial 0.5, No 0; N/A excluded and points redistributed so services are not penalised for criteria that don't apply.
- Points lost ranks recommendations so the report's key recommendations show the changes that would most improve the score.
- Rating bands: Healthy 85+, Good with gaps 70-84, Needs attention 50-69, At risk below 50. All are proposed defaults to validate in piloting.

### Critical criteria - rationale

Seven criteria are critical in the detailed set: ACC-01 WCAG 2.2 AA assessment, ACC-05 keyboard access, UXD-01 responsive design, SEC-01 security certification and accreditation, SEC-07 privacy statement, OPS-04 incident management, SUP-01 contact page with non-digital channels.
Rationale: a 'No' on any of these means some users cannot use the service at all, or the agency is in clear breach of a mandatory NZ obligation. A weighted average could otherwise hide such a failure behind good scores elsewhere, so any critical 'No' caps the overall score at 60 ('Needs attention') and that recommendation is always listed first. 'Partial' does not trigger the cap, to recognise work in progress.

### Simple set - rationale

The simple set contains the 13 criteria with weight 3, as requested, and is intended as the basis for the app. It shows only the question, category, critical flag, recommendation, source, NZ status and applicability, without evidence prompts or weights, to keep the self-assessment quick.
Scoring: the same method as the detailed set, so results are comparable in shape. Every question carries equal weight within its category. Category points are the detailed category points for the seven categories represented, rescaled to total 100 (Accessibility 24, Usability and design 18, Security and privacy 17, Reliability 15, Content 10, Support 9, Brand 7). Six of the 13 questions are critical.
Text is pulled from the Criteria tab by ID so the two sets don't drift apart.

### Link verification

All links on the Sources tab were checked on 24 Oct 2026. 49 pages were retrieved and confirmed to be the named source ('Fetched - live'). 3 were confirmed through current search results because the site blocks automated retrieval or served no readable body ('Search-indexed'): AU Digital Service Standard, NZ Identification Standards, and the draft DAS large print summary. Links are not a guarantee of future availability; re-check before publishing in the app and at each version.

### Licensing and reuse

- All questions, evidence prompts and recommendations are original wording.
- OWASP ASVS (CC BY-SA 4.0): referenced by chapter ID only so share-alike obligations are not triggered. If the app needs requirement-level detail, cite IDs (v5.0.0-x.y.z) and link to ASVS rather than copying text.
- NN/g heuristics: names and concepts only. ISO and ITIL: reference only (proprietary).
- Openly reusable with attribution: GOV.UK (OGL v3.0), Australian DTA (CC BY 4.0), W3C (W3C Document License), web.dev (CC BY 4.0), US OMB (public domain).
- NZ Government content: check each site's copyright page; NZ legislation is Crown copyright and may be reproduced free of charge.

### Known limitations and assumptions

- Weights, category points, critical flags, cap (60) and rating bands are expert judgements, not empirically derived; validate by piloting on 2-3 services.
- The simple set doesn't cover Legal and regulatory, Content management and governance, or Measurement and continuous improvement, and excludes the critical privacy statement criterion (SEC-07, weight 2). Consider adding SEC-07 and one legal criterion if the app should flag mandatory obligations.
- Self-assessment relies on honest answers; the app may need evidence prompts or reviewer sign-off for critical and mandatory criteria.
- 'Mandatory (NZ)' depends on whether an organisation is mandated by each standard or covered by each Act.
- Not legal advice; agencies should confirm obligations with their legal and privacy advisors.
- Simple set membership is maintained manually if weights change.

### Next review triggers

- Digital Accessibility Standard finalised (expected early 2027): update ACC criteria and sources, possibly re-baseline on EN 301 549.
- Updated Digital Service Design Standard published, and Web Usability Standard requirements moved into it: update BRD-02, SUP-01, SEC-07, LEG-01 sources and NZ status.
- Plain Language Act Repeal Bill enacted: change CON-01 NZ status to Good practice.
- New NZISM version, ASVS release, or WCAG 3.0 reaching Candidate Recommendation.
- Results of the pilot assessments (weights, cap, rating bands).
- At least every 12 months: re-check all links.
