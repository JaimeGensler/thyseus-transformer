import ts from 'typescript';

const statementsToAdd: ts.Statement[] = [];

export function addStatement(node: ts.Statement): void {
	statementsToAdd.push(node);
}

export function consumeStatements(
	statement: ts.Statement,
): ts.NodeArray<ts.Statement> {
	const statements = [statement, ...statementsToAdd];
	statementsToAdd.length = 0;
	return ts.factory.createNodeArray(statements);
}
