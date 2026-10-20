import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function formatJson(contents) {
	const document = JSON.parse(contents);
	const keys = new Set();

	function prepareValue(value) {
		if (value === null || typeof value !== "object") return value;
		if (Array.isArray(value)) return value.map(prepareValue);

		const object = Object.create(null);
		for (const key of Object.keys(value)) {
			keys.add(key);
			object[key] = prepareValue(value[key]);
		}
		return object;
	}

	const prepared = prepareValue(document);
	return `${JSON.stringify(prepared, [...keys].sort(), "\t")}\n`;
}

async function main() {
	const check = process.argv.includes("--check");
	const paths = execFileSync(
		"git",
		[
			"ls-files",
			"--cached",
			"--others",
			"--exclude-standard",
			"-z",
			"--",
			"*.json",
		],
		{ encoding: "utf8" },
	);

	for (const filepath of new Set(paths.split("\0").filter(Boolean))) {
		if (
			["package-lock.json", "npm-shrinkwrap.json"].includes(basename(filepath))
		) {
			continue;
		}

		try {
			const original = await readFile(filepath, "utf8");
			const formatted = formatJson(original);
			if (formatted === original) continue;

			if (check) {
				console.error(`${filepath} needs formatting. Run make fix.`);
				process.exitCode = 1;
			} else {
				await writeFile(filepath, formatted);
				console.log(`${filepath} formatted.`);
			}
		} catch (error) {
			console.error(`${filepath}: ${error.message}`);
			process.exitCode = 1;
		}
	}
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
	await main();
}
