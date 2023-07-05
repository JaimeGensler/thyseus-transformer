import ts from 'typescript';
export function getSignatureDeclaration(
	node: ts.FunctionDeclaration | ts.VariableDeclaration,
): ts.SignatureDeclaration {
	return ts.isFunctionDeclaration(node)
		? node
		: (node.initializer as ts.SignatureDeclaration);
}
