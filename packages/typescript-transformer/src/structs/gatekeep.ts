import ts from 'typescript';

export function isStruct(node: ts.Node): node is ts.ClassDeclaration {
	return (
		ts.isClassDeclaration(node) &&
		!!ts
			.getDecorators(node)
			?.some(dec => dec.expression.getText() === 'struct')
	);
}

const SKIPPED_MODIFIERS = [
	ts.SyntaxKind.AbstractKeyword,
	ts.SyntaxKind.DeclareKeyword,
	ts.SyntaxKind.StaticKeyword,
	ts.SyntaxKind.ReadonlyKeyword,
];
export function isTransformableMember(
	node: ts.ClassElement,
): node is ts.PropertyDeclaration {
	return (
		ts.isPropertyDeclaration(node) &&
		!node.modifiers?.some(modifier =>
			SKIPPED_MODIFIERS.includes(modifier.kind),
		)
	);
}
