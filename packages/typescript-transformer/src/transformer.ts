import ts from 'typescript';
import { transformSystemParameters } from './systemParameters';
import { consumeImports } from './utils/modifyImports';
import {
	consumeStatements,
	setStatementContext,
} from './utils/modifyStatements';
import { shouldIgnoreNode } from './shouldIgnoreNode';

export function thyseusTransformer(
	program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
	return (context: ts.TransformationContext) => (file: ts.SourceFile) => {
		function visit(node: ts.Node): ts.Node | ts.NodeArray<any> {
			if (shouldIgnoreNode(node)) {
				return node;
			}
			setStatementContext(node);

			const result = ts.visitEachChild(
				transformSystemParameters(node),
				visit,
				context,
			);

			return consumeStatements(result);
		}

		return consumeImports(ts.visitNode(file, visit)! as ts.SourceFile);
	};
}
