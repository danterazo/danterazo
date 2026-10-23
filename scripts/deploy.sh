#!/usr/bin/env bash

# dispatch the workflow and capture the exact run id.
run_id=$(gh api --method POST repos/danterazo/danterazo/actions/workflows/profile-stats.yml/dispatches \
	-f ref=main -F return_run_details=true --jq '.workflow_run_id') || exit "$?"

# do not watch or redispatch if github returned an unexpected response.
case "$run_id" in
	''|*[!0-9]*)
		printf 'Dispatch returned no run ID; check GitHub Actions before retrying.\n' >&2
		exit 1
		;;
esac

# print the run link and a command to reattach after stopping the watcher.
printf 'Deployment: https://github.com/danterazo/danterazo/actions/runs/%s\n' "$run_id"
printf 'Ctrl+C stops watching without cancelling the GitHub job.\n'
printf 'Resume: gh run watch %s --repo danterazo/danterazo --exit-status\n' "$run_id"

# watch remotely running jobs; failure exits this script, not the parent terminal.
gh run watch "$run_id" --repo danterazo/danterazo --exit-status
