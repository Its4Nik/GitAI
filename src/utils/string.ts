export function stripMarkdownFences(text: string): string {
	return text.replace(/^```[^\n]*\n?|\n```$/g, "");
}

export function truncateString(str: string, maxLength: number): string {
	if (str.length <= maxLength) return str;
	return `${str.substring(0, maxLength - 3)}...`;
}
