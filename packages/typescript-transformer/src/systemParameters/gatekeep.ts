import ts from 'typescript';
import { Config } from '../utils';
import { getSignatureDeclaration } from './getSignatureDeclaration';
import { getTypeNameFromNode } from './getTypeNameFromNode';

type ValidSystemNode = ts.FunctionDeclaration | ts.VariableDeclaration;

export function isSystem(node: ts.Node): node is ValidSystemNode {
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

function isSystemParameter(node: ts.ParameterDeclaration): boolean {
	const systemParameters = Config.use('systemParameters');
	return !!node.type && getTypeNameFromNode(node.type) in systemParameters;
}
