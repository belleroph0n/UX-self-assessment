# How the app is built

## Design decisions

| Decision | Choice | Reason |
|---|---|---|
| Hosting model | Static site, no backend | Public tool; assessments are saved as files, so no server or database is needed. Lowest cost and security risk; portable to any host. |
| Language | TypeScript, no front-end framework | Few dependencies to keep up to date; easy to read for a single maintainer. |
| Build tool | Vite | Fast, standard, outputs plain static files. |
| Content | YAML files in the repository | Editable in GitHub's website with no CMS; full history and review through pull requests. |
| Saving | Browser local storage, plus download/upload of a JSON file | Nothing leaves the person's device. |
| Typeface | Atkinson Hyperlegible Next, self-hosted | Designed for low-vision readers; no calls to third-party font services. |
| Tests | Vitest (scoring), Playwright with axe-core (pages and accessibility), lychee (links) | Each protects a different promise: correct scores, accessible pages, working guidance. |

## How content becomes the app

```
content/*.yaml --(tools/build-content.mjs: validate against schema + rules)--> src/generated/content.json --(Vite)--> dist/
```

`npm run content` runs automatically before `dev`, `build` and `test`. If the content breaks a rule, the build stops with a plain-English message.

## Scoring

`src/scoring.ts` holds all scoring rules and has no browser code. It reproduces the v1.51 criteria workbook exactly; `tests/scoring.test.ts` compares its results with values recalculated from the workbook (`tests/fixtures/workbook-v1.51.json`).

- **UX health score:** for each category, earned = sum of weight x answer points (Yes 1, Partly 0.5, No 0); available = sum of weights of answered questions (N/A excluded). Category score = earned / available x category points. Overall = sum of category scores / points of categories with answers x 100. Any critical "No" caps the score at 60 and shows red.
- **Key recommendations:** every Partly or No, ranked with critical failures first, then by points lost.
- **Materiality:** weighted average of the factor ratings, rounded; at least 4 if user dependence, organisation dependence or consequence of failure is rated 5. Never combined with the UX score.
- **Service tier:** suggested from the materiality rating; can be overridden with a reason.

The one deliberate difference from the workbook: when two recommendations lose the same points, the app keeps them in criterion order (the workbook favoured later rows).

## Accessibility

- Semantic HTML: every question is a fieldset with a legend; native radio buttons; labelled inputs; tables with headers.
- Focus moves to the page heading when the page changes, and the page title updates.
- Colour is never used alone: every coloured result also has its rating in text.
- Large touch targets (at least 44px high), visible focus outline, works at 400% zoom, respects reduced motion.
- Automated axe checks on every page in CI, on desktop and mobile sizes. Manual screen reader testing is still needed before formal release.

## Assessment file format

Downloaded files are JSON with `format: "ux-health-check-assessment"` and `format_version: 1`. They record the question set version used. When a file is opened, only recognised fields and values are kept; answers to questions no longer in the question set are dropped with a warning.
