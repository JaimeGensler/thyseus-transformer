import ts from 'typescript';
import { addStatement } from '../utils/modifyStatements';
import { addNamedImport } from '../utils/modifyImports';
import { defaultSystemParameters } from './defaultSystemParameters';

type ValidSystemNode = ts.FunctionDeclaration | ts.VariableDeclaration;

let typeChecker: ts.TypeChecker;
export function transformSystemParameters(
	node: ts.Node,
	checker: ts.TypeChecker,
): ts.Node {
	typeChecker = checker;
	if (!isSystem(node)) {
		return node;
	}

	addStatement(
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
	if (ts.isTypeReferenceNode(node.type!)) {
		typeChecker.getSymbolAtLocation(node.type!);
	}
	return (
		!!node.type && getTypeNameFromNode(node.type) in defaultSystemParameters
	);
}

function createDescriptorFromTypeNode(
	node: ts.TypeNode,
): ts.CallExpression | ts.Identifier | ts.ArrayLiteralExpression {
	if (ts.isTypeReferenceNode(node)) {
		const typeName = getTypeNameFromNode(node);
		const descriptor = defaultSystemParameters[typeName];
		if (descriptor) {
			addNamedImport(descriptor.importPath, descriptor.descriptorName);
			return ts.factory.createCallExpression(
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
