import ts from 'typescript';
import { transformSystemParameters } from './systemParameters';
import { consumeImports } from './utils/modifyImports';
import { consumeStatements } from './utils/modifyStatements';

export function thyseusTransformer(
	program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
	return (context: ts.TransformationContext) => (file: ts.SourceFile) => {
		let ignoreNextNode = false;

		function visit(node: ts.Node): ts.Node | ts.NodeArray<any> {
			if (isComment(node) && node.getText().includes('@thyseus-ignore')) {
				ignoreNextNode = true;
				return node;
			} else if (ignoreNextNode) {
				ignoreNextNode = false;
				return node;
			}

			const result = ts.visitEachChild(
				transformSystemParameters(node, program.getTypeChecker()),
				visit,
				context,
			);
			return ts.isStatement(result) ? consumeStatements(result) : result;
		}

		return consumeImports(ts.visitNode(file, visit)! as ts.SourceFile);
	};
}

const isComment = (node: ts.Node): boolean =>
	node.kind === ts.SyntaxKind.SingleLineCommentTrivia ||
	node.kind === ts.SyntaxKind.MultiLineCommentTrivia;
