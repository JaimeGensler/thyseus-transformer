import ts from 'typescript';
import { thyseusTransformer } from './thyseusTransformer';
import type { TransformerConfig } from './utils';

export function getTransformer(config?: TransformerConfig) {
	const printer = ts.createPrinter();

	return function transform(inputFile: string): string {
		const program = ts.createProgram([''], {});
		const transformer = thyseusTransformer(program, config);
		const sourceFile = ts.createSourceFile(
			'',
			inputFile,
			ts.ScriptTarget.Latest, // Remain unopinionated about output
			true, // Need access to parent nodes from children
			ts.ScriptKind.TS | ts.ScriptKind.TSX,
		);
		const { transformed } = ts.transform(sourceFile, [transformer]);
		return printer.printFile(transformed[0]);
	};
}
