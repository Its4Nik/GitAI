import { spawnSync } from "node:child_process";

export function getStagedDiff(): string {
	const result = spawnSync("git", ["diff", "--staged"], { encoding: "utf-8" });
	if (result.status !== 0) {
		throw new Error("Failed to get staged changes");
	}
	return result.stdout;
}

export function commitChanges(message: string): void {
	const result = spawnSync("git", ["commit", "-m", message], {
		stdio: "inherit",
	});
	if (result.status !== 0) {
		throw new Error("Commit failed");
	}
}

export function getRecentCommits(limit = 10): string[] {
	const result = spawnSync("git", ["log", "--pretty=format:%s", `-n${limit}`], {
		encoding: "utf-8",
	});

	if (result.status !== 0) {
		throw new Error("Failed to get commit history");
	}

	return result.stdout.trim().split("\n").filter(Boolean);
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
