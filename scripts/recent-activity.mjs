import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const dayMilliseconds = 86_400_000;

export function rollingTotals(days, now = new Date()) {
	const today = new Date(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
	const counts = new Map();
	for (const { date, contributionCount } of days) {
		if (
			counts.has(date) ||
			!Number.isSafeInteger(contributionCount) ||
			contributionCount < 0
		) {
			throw new Error("Invalid contribution calendar");
		}
		counts.set(date, contributionCount);
	}
	return [7, 30].map((length) => {
		const start = new Date(today.getTime() - (length - 1) * dayMilliseconds);
		let total = 0;
		for (let offset = 0; offset < length; offset++) {
			const date = new Date(start.getTime() + offset * dayMilliseconds)
				.toISOString()
				.slice(0, 10);
			if (!counts.has(date))
				throw new Error(`Missing contributions for ${date}`);
			total += counts.get(date);
		}
		return { length, start, end: today, total };
	});
}

export function renderRecentCard(period, dark = false) {
	const title = period.length === 7 ? "Last Week" : "Last Month";
	const format = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		timeZone: "UTC",
	});
	const range = `${format.format(period.start)} - ${format.format(period.end)}`;
	const accent = dark ? "#70d9bd" : "#187466";
	const text = dark ? "#c9d1d9" : "#434d58";
	const background = dark ? "#0d1117" : "#fffefe";
	const border = dark ? "#30363d" : "#e4e2e2";
	return `<svg xmlns="http://www.w3.org/2000/svg" width="350" height="112" viewBox="0 0 350 112" role="img" aria-labelledby="title desc">
  <title id="title">${title}: ${period.total.toLocaleString("en-US")} contributions</title>
  <desc id="desc">${period.length} rolling UTC dates including today, ${range}. Today's count is partial.</desc>
	<rect x="0.5" y="0.5" width="349" height="111" rx="4.5" fill="${background}" stroke="${border}"/>
  <g font-family="'Segoe UI', Ubuntu, sans-serif" fill="${text}">
    <text x="20" y="29" font-size="16" font-weight="600" fill="${accent}">${title}</text>
	<text x="330" y="29" text-anchor="end" font-size="13">${period.length} days</text>
    <text x="20" y="73" font-size="32" font-weight="700">${period.total.toLocaleString("en-US")}</text>
	<text x="330" y="72" text-anchor="end" font-size="14">contributions</text>
    <text x="20" y="97" font-size="12">${range} (UTC)</text>
  </g>
</svg>
`;
}

async function main() {
	const now = new Date();
	const from = new Date(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
	from.setUTCDate(from.getUTCDate() - 29);
	const query = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
  }
}`;
	const response = JSON.parse(
		execFileSync("gh", ["api", "graphql", "--input", "-"], {
			input: JSON.stringify({
				query,
				variables: {
					login: process.env.PROFILE_USERNAME || "danterazo",
					from: from.toISOString(),
					to: now.toISOString(),
				},
			}),
			encoding: "utf8",
			timeout: 60_000,
		}),
	);
	if (response.errors) throw new Error("GitHub contribution query failed");
	const days =
		response.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
			(week) => week.contributionDays,
		);
	for (const period of rollingTotals(days, now)) {
		const name = period.length === 7 ? "week" : "month";
		for (const theme of ["light", "dark"]) {
			await writeFile(
				`profile/${name}-${theme}.svg`,
				renderRecentCard(period, theme === "dark"),
			);
		}
		console.log(`${period.length} days: ${period.total} contributions`);
	}
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	await main();
}
