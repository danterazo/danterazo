.PHONY: fix format check

fix: format

format:
	node scripts/format-readme.mjs
	./node_modules/.bin/prettier --write '**/*.json'

check:
	node scripts/format-readme.mjs --check
	./node_modules/.bin/prettier --check '**/*.json'
