import ts from 'typescript';
import { transformSystemParameters } from './systemParameters';
import {
	Imports,
	Statements,
	shouldIgnoreNode,
	Config,
	type TransformerConfig,
} from './utils';

export function thyseusTransformer(
	program: ts.Program,
	config: TransformerConfig | undefined,
): ts.TransformerFactory<ts.SourceFile> {
	Config.set(config);

	return (context: ts.TransformationContext) => (file: ts.SourceFile) => {
		function visit(node: ts.Node): ts.Node | ts.NodeArray<any> {
			if (shouldIgnoreNode(node)) {
				return node;
			}

			Statements.setContext(node);
			const result = ts.visitEachChild(
				transformSystemParameters(node),
				visit,
				context,
			);
			return Statements.consume(result);
		}

		return Imports.consume(ts.visitNode(file, visit)! as ts.SourceFile);
	};
}
