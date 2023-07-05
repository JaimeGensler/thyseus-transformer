import ts from 'typescript';

export function insertSerializationCalls(node: ts.Node): ts.Node {
	if (ts.isForOfStatement(node)) {
		const queryType = getQueryType(node);

		if (queryType) {
			const deserializeCall = ts.factory.createExpressionStatement(
				ts.factory.createCallExpression(
					ts.factory.createIdentifier('deserialize'),
					undefined,
					[],
				),
			);

			const serializeCall = ts.factory.createExpressionStatement(
				ts.factory.createCallExpression(
					ts.factory.createIdentifier('serialize'),
					undefined,
					[],
				),
			);

			const updatedStatements = [
				deserializeCall,
				node.statement,
				serializeCall,
			];

			return ts.factory.updateForOfStatement(
				node,
				node.awaitModifier,
				node.initializer,
				node.expression,
				ts.factory.createBlock(updatedStatements),
			);
		}
	}

	return node;
}

function getQueryType(node: ts.ForOfStatement): ts.TypeNode | undefined {
	if (
		ts.isTypedBindingElement(node.initializer) &&
		ts.isIdentifier(node.initializer.name)
	) {
		const symbol = checker.getSymbolAtLocation(node.initializer.name);
		if (symbol) {
			const type = checker.getTypeOfSymbolAtLocation(
				symbol,
				symbol.valueDeclaration,
			);
			const queryType = getTypeArgument(type, 'Query');
			return queryType?.typeArguments?.[0];
		}
	}

	return undefined;
}

function getTypeArgument(
	type: ts.Type,
	typeName: string,
): ts.TypeReferenceNode | undefined {
	const typeNode = checker.typeToTypeNode(type);
	if (
		ts.isTypeReferenceNode(typeNode) &&
		typeNode.typeName.getText() === typeName
	) {
		return typeNode;
	}

	return undefined;
}
