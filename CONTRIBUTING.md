# Contributing

Thanks for helping improve the UX health check.

- **Found a problem or have a suggestion?** Open an issue describing what you expected and what happened. For a question that's wrong or out of date, include the criterion ID (for example `SEC-07`) and the source that supports the change.
- **Changing the question set?** Follow [docs/editing-content.md](docs/editing-content.md). Bump `content_version` in `content/meta.yaml` and add a `CHANGELOG.md` entry.
- **Changing code?** Run `npm run check` and the browser tests before opening a pull request. Keep the app free of tracking, external calls and new runtime dependencies unless there's a strong reason.
- **Accessibility first.** Every page must meet WCAG 2.2 AA. The automated checks must pass, and changes to how pages work should be tested with a keyboard and a screen reader.

All pull requests are reviewed before merging.
