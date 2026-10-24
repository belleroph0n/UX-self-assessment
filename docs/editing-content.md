# Editing the question set

Everything the assessment asks and how it's scored lives in the `content/` folder. You can change it in GitHub's website without installing anything. Each change goes through a pull request, the checks run automatically, and the site updates once it's merged.

## The files

| File | What it holds |
|---|---|
| `criteria.yaml` | Every criterion: question, evidence, weight, critical flag, recommendation, source, supporting link |
| `categories.yaml` | The 10 categories and how many of the 100 points each is worth |
| `scoring.yaml` | Answer points, the critical-failure cap, and the rating bands and colours |
| `materiality.yaml` | The 10 materiality factors, their 1-5 descriptions and weights, the floor rule, and the rating levels |
| `tiers.yaml` | The proposed service tiers and which materiality rating suggests which tier |
| `profile.yaml` | The service profile questions that decide which criteria apply |
| `sources.yaml` | The register of standards, laws and guidance |
| `meta.yaml` | The question set version and release date |

## Making a change in GitHub's website

1. Open the repository on GitHub and go to the `content` folder.
2. Select the file, then the pencil icon ("Edit this file").
3. Make the change. Keep the indentation exactly as it is: YAML uses spaces to show structure.
4. Open `meta.yaml` too and increase `content_version` (for example `1.51` to `1.52`).
5. Add an entry at the top of `CHANGELOG.md` saying what changed and why.
6. Select **Commit changes**, choose **Create a new branch and start a pull request**, and give it a clear name.
7. On the pull request page, wait for the checks. A green tick means the content is valid, the scoring tests pass, the site is accessible and the links work. A red cross shows what's wrong: open **Details** to read the message.
8. When the checks pass and you're happy, select **Merge pull request**. The live site updates a few minutes later.

## Common changes

### Reword a question or recommendation

Find the criterion by its `id` in `criteria.yaml` and edit the `question` or `recommendation` text. Keep the meaning stable. If the meaning changes significantly, consider adding a new criterion with a new ID instead, so old assessments still make sense.

### Add a criterion

Copy an existing criterion block (from `- id:` down to just before the next `- id:`) and paste it at the end of its category. Then:

- give it the next unused ID in that category, for example `ACC-18`
- fill in every field (see the field guide below)
- `weight: 3` adds it to the simple assessment as well as the detailed one

### Remove a criterion

Delete its block. Don't reuse the ID later for a different question.

### Change a supporting link

Edit `link.label` (6 words or fewer) and `link.url` on the criterion. Use `url: ""` when there's no external guidance, with a label such as "Use your organisation's style guide". Add the source to `sources.yaml` if it's new.

### Change category weightings

Edit `points` in `categories.yaml`. The points must total 100. The scoring tests compare results with the original workbook, so they'll fail; update the expected values in `tests/fixtures` (ask for help with this).

### Change rating bands or the critical cap

Edit `scoring.yaml`. List ratings from the highest `min` to the lowest; the last must have `min: 0`. The report's colours and colour key update automatically.

## Field guide for criteria

| Field | What to put |
|---|---|
| `id` | Category code, hyphen, two digits, for example `SEC-07`. Must be unique. |
| `category` | The category code, matching the ID prefix |
| `subcategory` | A short grouping, for example `Privacy` |
| `question` | A yes/no question the assessor can answer about their service |
| `evidence` | What the assessor should be able to show |
| `weight` | 1, 2 or 3. 3 = most important; weight-3 criteria form the simple assessment |
| `critical` | `true` if a "No" means users can't use the service or there's a clear breach. A critical "No" caps the score. |
| `recommendation` | What to do if the answer is Partly or No. Start with a verb. |
| `source` / `source_version` | Where the criterion comes from |
| `nz_status` | `mandatory`, `recommended` or `good-practice` |
| `applies_to` | `all`, or one of the service profile values (`public-facing`, `transactional`, `authenticated`, `uses-media`, `uses-cms`, `uses-ai`) |
| `link.label` / `link.url` | Supporting guidance shown with the recommendation |
| `review_note` | Optional: notes for future reviewers, not shown in the app |

## If a check fails

The message says which file and which criterion, for example `SEC-12: link label has 8 words; keep it to 6 or fewer.` Fix it in the same branch (edit the file again, and commit to the same branch) and the checks run again.
