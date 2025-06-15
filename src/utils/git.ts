import { spawnSync } from "node:child_process";
import { getIgnoreFilter } from "../config";

export interface GitCommit {
	hash: string;
	subject: string;
	body: string;
	author: string;
	date: string;
}

export async function getStagedDiff(): Promise<string> {
	// Get list of staged files
	const filesResult = spawnSync("git", ["diff", "--staged", "--name-only"], {
		encoding: "utf-8",
	});

	if (filesResult.status !== 0) {
		throw new Error("Failed to get staged files");
	}

	// Apply ignore filters
	const ignoreFilter = getIgnoreFilter();
	const stagedFiles = filesResult.stdout
		.split("\n")
		.filter((file) => file.trim())
		.filter((file) => !ignoreFilter.ignores(file));

	if (stagedFiles.length === 0) {
		throw new Error("No staged files after applying ignore filters");
	}

	const diffResult = spawnSync(
		"git",
		["diff", "--staged", "--", ...stagedFiles],
		{
			encoding: "utf-8",
		},
	);

	if (diffResult.status !== 0) {
		console.debug(diffResult);
		console.debug(stagedFiles);
		throw new Error("Failed to get staged diff");
	}

	return diffResult.stdout;
}

export function commitChanges(message: string): void {
	const result = spawnSync("git", ["commit", "-m", message], {
		stdio: "inherit",
	});
	if (result.status !== 0) {
		throw new Error("Commit failed");
	}
}

export function getRecentCommits(limit = 10): GitCommit[] {
	const format = "%H%n%s%n%aN%n%ad%n%b";
	const result = spawnSync(
		"git",
		["log", `--pretty=format: + ${format}`, `-n${limit}`],
		{ encoding: "utf-8" },
	);

	if (result.status !== 0) {
		throw new Error("Failed to get commit history");
	}

	const lines = result.stdout.trim().split("\n");
	const commits: GitCommit[] = [];

	for (let i = 0; i < lines.length; i += 5) {
		commits.push({
			hash: lines[i] || "",
			subject: lines[i + 1] || "",
			author: lines[i + 2] || "",
			date: lines[i + 3] || "",
			body: (lines[i + 4] || "").trim(),
		});
	}

	return commits;
}

export function getLatestTag(): string | null {
	const result = spawnSync("git", ["describe", "--abbrev=0", "--tags"], {
		encoding: "utf-8",
		stdio: ["ignore", "pipe", "ignore"],
	});

	if (result.status !== 0) {
		return null;
	}

	return result.stdout.trim();
}

export async function getDiffBetweenRefs(
	ref1: string,
	ref2: string,
): Promise<string> {
	const result = spawnSync("git", ["diff", `${ref1}..${ref2}`], {
		encoding: "utf-8",
		maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large diffs
	});

	if (result.status !== 0) {
		throw new Error(`Failed to get diff between ${ref1} and ${ref2}`);
	}

	return result.stdout;
}
