# UX health check

A UX self-assessment designed for a light-touch review of public-facing websites and applications developed for NZ Government. It checks the health of a service's user experience. Answer questions about the service to get:

- a **UX health score** out of 100 with a rating (Healthy, Good with gaps, Needs attention, At risk)
- the **key recommendations** that would make the most difference, each with a link to supporting guidance
- results by category
- a separate **materiality rating** (1 Immaterial to 5 Critical) and a suggested **service tier**

The questions cover accessibility (including for blind and low vision users), usability and design, content and tone of voice, brand, security and privacy, reliability and service levels, support, legal obligations, content management and governance, and measurement. They're based on NZ Government standards and legislation and international good practice. See [the sources](content/sources.yaml).

## How it works

- **Runs entirely in the browser.** There's no server, database or login. Answers are saved in the person's browser, and can be downloaded as a file to keep or share. Nothing is sent anywhere.
- **The question set is plain text.** Criteria, scoring rules, materiality factors, service tiers and sources live in YAML files in [`content/`](content). Change them in a pull request; no CMS is needed.
- **Every change is checked automatically.** The content is validated, the scoring is tested against the original criteria workbook, every page is tested with the axe accessibility engine, and supporting links are checked.
- **Hosting is just files.** The build produces a folder of static files that can be hosted on GitHub Pages, AWS (S3 and CloudFront) or any web server.

## Quick start

You need [Node.js](https://nodejs.org) 22 or later.

```bash
npm install
npm run dev        # run locally at http://localhost:5173
npm run check      # check content, types and scoring tests
npm run build      # build the site into dist/
```

Browser and accessibility tests (needs Chromium; installs it the first time):

```bash
npx playwright install chromium
npm run build && npx playwright test
```

## Project layout

```
content/          The question set and scoring rules (YAML) - edit these to change the assessment
schema/           Rules the content must follow
src/scoring.ts    Scoring for the UX health score and materiality (no browser code)
src/views.ts      The pages
src/store.ts      Saving, downloading and opening assessment files
tests/            Scoring tests (matched to the workbook) and browser/accessibility tests
tools/            Content build and the one-off workbook export
reference/        The original criteria workbook (v1.51), for history only
docs/             How to edit content, publish, and deploy to AWS
```

## Guides

- [Editing the question set](docs/editing-content.md)
- [Publishing to GitHub and turning on the site](docs/publishing-to-github.md)
- [Deploying to AWS](docs/deploying-to-aws.md)
- [How the app is built](docs/architecture.md)
- [Content changelog](CHANGELOG.md)

## Licences

- Source code: MIT licence (see [LICENSE](LICENSE)).
- Question set and other content in `content/`: Creative Commons Attribution 4.0 International (see [LICENSE-CONTENT.md](LICENSE-CONTENT.md)).
- Atkinson Hyperlegible Next typeface: SIL Open Font Licence 1.1.

