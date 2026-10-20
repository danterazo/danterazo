# README Statistics

- Before any assistant-made commit in this repository, run `git pull --ff-only`
  on the current branch to incorporate its configured upstream. Then inspect
  the worktree and staged diff again, stage only task-related files, make the
  commit, and push to the configured upstream.
- If the pull cannot fast-forward, has no configured upstream, or would
  overwrite local work, stop and preserve all changes. Inspect and reconcile
  deliberately before committing; do not reset, force-push, or silently create
  a merge commit. If the push is rejected because upstream advanced, pull and
  recheck before retrying.
- Keep rolling activity first, all-time statistics second, and the language
  breakdown last. Label time windows accurately; do not present calendar-year or
  lifetime totals as rolling statistics.
- Generate both light and dark SVG cards through
  `.github/workflows/profile-stats.yml`, preserving the matching README paths.
- After changing the README stats display, open the actual GitHub profile or
  repository page in your own browser using Playwright/browser tools. Visually
  inspect the rendered README, not just Markdown or SVG source. Check card order,
  labels, image loading, alignment, clipping, and light/dark rendering at desktop
  and mobile widths.
- Before publication, preview local changes in the GitHub page with browser
  interception or a DOM-only preview and disclose that the preview is unpublished.
  After an approved push and card refresh, reload GitHub and verify the published
  result. Do not claim a local preview proves the published page has updated.
