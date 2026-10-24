# Publishing to GitHub and turning on the site

## Before you publish

The repository is intended to be public. Before making it public, confirm:

- **Ownership and licences.** Who holds copyright (for example, Crown copyright held by the agency), and that the code (MIT) and content (CC BY 4.0) licences are approved. NZGOAL and its software extension (NZGOAL-SE) cover releasing government code and content.
- **Security sign-off.** That publishing the code publicly is approved. The app holds no secrets, keys or personal information.
- **Third-party material.** The content references sources by name and links to them. No text from OWASP ASVS or NN/g is reproduced.
- **Contact details.** The accessibility statement points people to GitHub issues. Add a contact email if your organisation prefers.

You can start with a private repository and make it public once these are confirmed.

## 1. Create the repository

1. Sign in to [GitHub](https://github.com) and select **New repository**.
2. Name it, for example `ux-health-check`. Choose **Private** for now. Don't add a README or licence (they're already included).
3. Upload the files: either drag the unzipped project folder contents onto the "uploading an existing file" link, or use Git:

```bash
cd ux-health-check
git init
git add .
git commit -m "First version of the UX health check"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/ux-health-check.git
git push -u origin main
```

## 2. Set up review rules

1. Check `.github/CODEOWNERS` lists the people who must approve content and scoring changes (currently @belleroph0n).
2. Go to **Settings > Branches > Add branch protection rule** (or **Rules > Rulesets**) for `main`:
   - require a pull request before merging
   - require the **Content, tests and accessibility** and **Supporting links still work** checks to pass

## 3. Turn on GitHub Pages

1. Go to **Settings > Pages**.
2. Under **Source**, choose **GitHub Actions**.
3. Go to **Actions > Publish to GitHub Pages > Run workflow**.

The site address appears in **Settings > Pages** a few minutes later, usually `https://YOUR-ACCOUNT.github.io/ux-health-check/`.

GitHub Pages needs a public repository on GitHub's free plan. On a private repository it needs a paid plan, so either make the repository public first or host on AWS (see [deploying to AWS](deploying-to-aws.md)).

## 4. Peer review

Invite reviewers as collaborators (**Settings > Collaborators**) or, once public, anyone can comment through issues and pull requests. The pull request template asks contributors to bump the content version and update the changelog.
