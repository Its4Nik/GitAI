import { existsSync } from "node:fs";
import { join } from "node:path";
import { file } from "bun";

const LOG_PATH = join(process.cwd(), "gitai-debug.json");

interface LogEntry {
	timestamp: string;
	command: string;
	provider: string;
	model: string;
	promptLength: number;
	responseLength: number;
	duration: number;
	request: {
		model: string;
		prompt: string;
	};
	response: {
		text?: string;
		error?: string;
	};
}

export class DebugLogger {
	private static instance: DebugLogger;
	private logEntries: LogEntry[] = [];
	private enabled = false;

	private constructor() {
		this.enabled =
			process.env.AI_COMMIT_DEBUG === "1" ||
			existsSync(join(process.cwd(), "DEBUG"));
	}

	static getInstance(): DebugLogger {
		if (!DebugLogger.instance) {
			DebugLogger.instance = new DebugLogger();
		}
		return DebugLogger.instance;
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	log(entry: Omit<LogEntry, "timestamp">) {
		if (!this.enabled) return;

		const logEntry: LogEntry = {
			timestamp: new Date().toISOString(),
			...entry,
		};

		this.logEntries.push(logEntry);
		console.error(
			`[DEBUG] ${logEntry.timestamp} | ${entry.command} | ${entry.provider}:${entry.model} | ${entry.duration}ms`,
		);

		// Flush to disk every 10 entries
		if (this.logEntries.length >= 10) {
			this.flush();
		}
	}

	async flush() {
		if (!this.enabled || this.logEntries.length === 0) {
			return;
		}

		try {
			const logFile = file(LOG_PATH);
			let existing = [];

			if (existsSync(LOG_PATH)) {
				existing = JSON.parse(await logFile.text());
			}

			const newContent = JSON.stringify(
				[...existing, ...this.logEntries],
				null,
				2,
			);
			await Bun.write(LOG_PATH, newContent);
			this.logEntries = [];
		} catch (error) {
			console.error("Failed to write debug log:", error);
		}
	}

	async summarize() {
		if (!this.enabled) return;
		await this.flush();

		if (!existsSync(LOG_PATH)) {
			console.log("No debug logs found");
			return;
		}

		const logFile = file(LOG_PATH);
		const entries: LogEntry[] = JSON.parse(await logFile.text());

		if (entries.length === 0) {
			console.log("No debug entries found");
			return;
		}

		const summary = {
			totalRequests: entries.length,
			commands: {} as Record<string, number>,
			providers: {} as Record<string, number>,
			models: {} as Record<string, number>,
			avgDuration: 0,
			totalPromptChars: 0,
			totalResponseChars: 0,
		};

		let totalDuration = 0;

		for (const entry of entries) {
			totalDuration += entry.duration;
			summary.totalPromptChars += entry.promptLength;
			summary.totalResponseChars += entry.responseLength;

			summary.commands[entry.command] =
				(summary.commands[entry.command] || 0) + 1;
			summary.providers[entry.provider] =
				(summary.providers[entry.provider] || 0) + 1;
			summary.models[entry.model] = (summary.models[entry.model] || 0) + 1;
		}

		summary.avgDuration = Math.round(totalDuration / entries.length);

		console.log("\nAPI Request Summary:");
		console.log("====================");
		console.log(`Total Requests: ${summary.totalRequests}`);
		console.log(`Total Prompt Chars: ${summary.totalPromptChars}`);
		console.log(`Total Response Chars: ${summary.totalResponseChars}`);
		console.log(`Average Duration: ${summary.avgDuration}ms`);

		console.log("\nBy Command:");
		for (const [cmd, count] of Object.entries(summary.commands)) {
			console.log(`- ${cmd}: ${count}`);
		}

		console.log("\nBy Provider:");
		for (const [provider, count] of Object.entries(summary.providers)) {
			console.log(`- ${provider}: ${count}`);
		}

		console.log("\nBy Model:");
		for (const [model, count] of Object.entries(summary.models)) {
			console.log(`- ${model}: ${count}`);
		}
	}
}

process.on("exit", () => DebugLogger.getInstance().flush());
process.on("SIGINT", () => process.exit());
process.on("SIGTERM", () => process.exit());
