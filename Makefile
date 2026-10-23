.PHONY: deps fix format check deploy refresh

# aliases
fix: format
refresh: deploy

# commands
deploy:
	@run_id=$$(gh api --method POST repos/danterazo/danterazo/actions/workflows/profile-stats.yml/dispatches \
		-f ref=main -F return_run_details=true --jq '.workflow_run_id') || exit $$?; \
	case "$$run_id" in ''|*[!0-9]*) echo "Dispatch returned no run ID; check GitHub Actions before retrying." >&2; exit 1;; esac; \
	printf 'Deployment: https://github.com/danterazo/danterazo/actions/runs/%s\n' "$$run_id"; \
	printf 'Ctrl+C stops watching without cancelling the GitHub job.\n'; \
	printf 'Resume: gh run watch %s --repo danterazo/danterazo --exit-status\n' "$$run_id"; \
	gh run watch "$$run_id" --repo danterazo/danterazo --exit-status

deps:
	npm ci --include=dev

format:
	node scripts/format-readme.mjs
	node scripts/format-json.mjs
	node_modules/.bin/prettier --write "**/*.{mjs,yml,yaml}"

check:
	node scripts/format-readme.mjs --check
	node scripts/format-json.mjs --check
	node_modules/.bin/prettier --check "**/*.{mjs,yml,yaml}"
