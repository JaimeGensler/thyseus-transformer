import ts from 'typescript';
import { Statements, Imports, Config } from '../utils';
import { isSystem } from './gatekeep';
import { getSignatureDeclaration } from './getSignatureDeclaration';
import { getTypeNameFromNode } from './getTypeNameFromNode';

export function transformSystemParameters(node: ts.Node): ts.Node {
	if (!isSystem(node)) {
		return node;
	}

	Statements.add(
		ts.factory.createExpressionStatement(
			ts.factory.createAssignment(
				ts.factory.createPropertyAccessExpression(
					node.name as any,
					'parameters',
				),
				ts.factory.createArrayLiteralExpression(
					getSignatureDeclaration(node).parameters.map(parameter =>
						createDescriptorFromTypeNode(parameter.type!),
					),
				),
			),
		),
	);

	return node;
}

function createDescriptorFromTypeNode(
	node: ts.TypeNode,
): ts.NewExpression | ts.Identifier | ts.ArrayLiteralExpression {
	const systemParameters = Config.use('systemParameters');
	if (ts.isTypeReferenceNode(node)) {
		const typeName = getTypeNameFromNode(node);
		const descriptor = systemParameters[typeName];
		if (descriptor) {
			Imports.addNamed(descriptor.importPath, descriptor.descriptorName);
			return ts.factory.createNewExpression(
				ts.factory.createIdentifier(descriptor.descriptorName),
				undefined,
				node.typeArguments?.map(createDescriptorFromTypeNode) ?? [],
			);
		} else {
			return ts.factory.createIdentifier(typeName);
		}
	} else if (ts.isTupleTypeNode(node)) {
		return ts.factory.createArrayLiteralExpression(
			node.elements.map(createDescriptorFromTypeNode),
		);
	} else {
		return ts.factory.createIdentifier(node.getText());
	}
}
