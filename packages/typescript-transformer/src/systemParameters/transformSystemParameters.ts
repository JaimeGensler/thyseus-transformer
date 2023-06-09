import ts from 'typescript';
import { Statements, Imports, Config } from '../utils';

type ValidSystemNode = ts.FunctionDeclaration | ts.VariableDeclaration;

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

function isSystem(node: ts.Node): node is ValidSystemNode {
	const isValidFunctionDefinition =
		ts.isFunctionDeclaration(node) ||
		(ts.isVariableDeclaration(node) &&
			node.initializer &&
			(ts.isArrowFunction(node.initializer) ||
				ts.isFunctionExpression(node.initializer)));
	if (!isValidFunctionDefinition) {
		return false;
	}
	const signatureDeclaration = getSignatureDeclaration(node);
	return (
		!!node.name &&
		!signatureDeclaration.typeParameters &&
		signatureDeclaration.parameters.length > 0 &&
		signatureDeclaration.parameters.every(isSystemParameter)
	);
}
function getSignatureDeclaration(
	node: ts.FunctionDeclaration | ts.VariableDeclaration,
): ts.SignatureDeclaration {
	return ts.isFunctionDeclaration(node)
		? node
		: (node.initializer as ts.SignatureDeclaration);
}
function isSystemParameter(node: ts.ParameterDeclaration): boolean {
	const systemParameters = Config.use('systemParameters');
	return !!node.type && getTypeNameFromNode(node.type) in systemParameters;
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

function getTypeNameFromNode(node: ts.TypeNode): string {
	return ts.isTypeReferenceNode(node)
		? node.typeName.getText()
		: node.getText();
}
