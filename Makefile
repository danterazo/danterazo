.PHONY: deps fix format check deploy refresh

# aliases
fix: format
refresh: deploy

# commands
deploy:
	@bash scripts/deploy.sh

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
