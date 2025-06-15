export function generateDiffPrompt(
	diff: string,
	fromRef: string,
	toRef: string,
): string {
	return `Analyze the following Git diff and provide a comprehensive summary of changes:

Comparison: ${fromRef} → ${toRef}

Key points to cover:
- Major features added or modified
- Significant bug fixes
- Architectural changes
- Dependency updates
- Configuration changes
- Potential breaking changes

Diff:
${diff}

Format your response as:
1. Overview of changes
2. Detailed breakdown by category
3. Potential impact assessment

Use clear, concise language suitable for technical documentation.`;
}
