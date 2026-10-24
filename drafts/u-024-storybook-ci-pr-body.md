## U-024: the `storybook` CI job

Issue: https://github.com/defaultdave/ramble/issues/31. This finishes U-024 (#177 landed the components and Storybook). It was split out because `.github/` is a protected path.

Adds one job to `.github/workflows/ci.yml`, in the same shape as the other jobs. It builds Storybook (`pnpm storybook:build`), installs Chromium, and runs `pnpm storybook:test`. That runs every story in Light and Dark under axe at error level, so an accessibility violation fails the job. The job runs on this PR, so its result is visible before merge.

`scope-manifest` fails by design (protected path), so this needs a bypass merge (squash is fine):

```bash
gh pr merge unit/U-024-storybook-ci-job --squash --admin
```

Then add `storybook` to the required checks on both rulesets (integration_id 15368, like the other CI jobs).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
