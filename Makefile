.PHONY: fix format check

fix: format

format:
	node scripts/format-readme.mjs

check:
	node scripts/format-readme.mjs --check