import { readFile, writeFile } from "node:fs/promises";
import * as prettier from "prettier";
import remarkParse from "remark-parse";
import { unified } from "unified";

const filepath = "README.md";
const original = await readFile(filepath, "utf8");
const options = await prettier.resolveConfig(filepath);
const tree = unified().use(remarkParse).parse(original);
let formatted = original;

for (const node of tree.children.toReversed()) {
	if (node.type !== "html") continue;

	const html = await prettier.format(node.value, {
		...options,
		parser: "html",
	});
	formatted =
		formatted.slice(0, node.position.start.offset) +
		html.trimEnd() +
		formatted.slice(node.position.end.offset);
}

formatted = await prettier.format(formatted, { ...options, filepath });

if (process.argv.includes("--check")) {
	if (formatted !== original) {
		console.error(`${filepath} needs formatting. Run make fix.`);
		process.exitCode = 1;
	} else {
		console.log(`${filepath} is formatted.`);
	}
} else {
	if (formatted !== original) await writeFile(filepath, formatted);
	console.log(`${filepath} formatted.`);
}
