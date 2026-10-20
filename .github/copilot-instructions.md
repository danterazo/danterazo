# README Statistics

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
