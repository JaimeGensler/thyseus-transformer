class CompilerError extends Error {}

export function assert(
	condition: unknown,
	errorMessage: string,
	errorType = CompilerError,
): asserts condition {
	if (!condition) {
		throw new errorType(errorMessage);
	}
}
