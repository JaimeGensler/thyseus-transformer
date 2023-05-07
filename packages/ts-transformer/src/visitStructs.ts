import ts from 'typescript';

export function visitStructs(node: ts.Node) {
	if (!isStruct(node)) {
		return node;
	}

	const members = node.members;
	for (const member of members) {
		if (isStructAccessor(member)) {
			const propertyName = ts.getNameOfDeclaration(member)!.getText();
			const constant = ts.factory.createReturnStatement(
				ts.factory.createPropertyAccessExpression(
					ts.factory.createPropertyAccessExpression(
						ts.factory.createIdentifier('memory'),
						ts.factory.createIdentifier('views'),
					),
					ts.factory.createIdentifier('u8'),
				),
			);
			const newGetter = ts.factory.createGetAccessorDeclaration(
				undefined,
				ts.factory.createIdentifier(propertyName),
				[],
				undefined,
				ts.factory.createBlock([constant], true),
			);

			if (!isStruct(node)) {
				throw new Error();
			}
			node = ts.factory.updateClassDeclaration(
				node,
				node.modifiers,
				node.name,
				node.typeParameters,
				node.heritageClauses,
				[...node.members.filter(m => m !== member), newGetter],
			);
		}
	}
	return node;
}
function isStruct(node: ts.Node): node is ts.ClassDeclaration {
	return (
		ts.isClassDeclaration(node) &&
		!!ts
			.getDecorators(node)
			?.some(dec => dec.expression.getText() === 'struct')
	);
}
function isStructAccessor(
	node: ts.ClassElement,
): node is ts.AutoAccessorPropertyDeclaration {
	return (
		ts.isAutoAccessorPropertyDeclaration(node) &&
		!!ts.getDecorators(node)?.some(dec => {
			const text = dec.expression.getText();
			return recognizedAccessors.some(rec => `struct.${rec}` === text);
		})
	);
}
const recognizedAccessors = [
	'u8',
	'u16',
	'u32',
	'u64',
	'i8',
	'i16',
	'i32',
	'i64',
	'f32',
	'f64',
];
