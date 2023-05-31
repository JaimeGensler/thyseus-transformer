import ts from 'typescript';

const statementsToAdd = new Map<number, ts.Statement[]>();
let currentContext = 0;

export const Statements = {
	setContext(node: ts.Node) {
		if (ts.isStatement(node)) {
			currentContext++;
		}
	},
	add(newStatement: ts.Statement): void {
		if (!statementsToAdd.has(currentContext)) {
			statementsToAdd.set(currentContext, []);
		}
		statementsToAdd.get(currentContext)!.push(newStatement);
	},
	consume(node: ts.Node): ts.Node | ts.NodeArray<ts.Statement> {
		if (!ts.isStatement(node)) {
			return node;
		}

		const newStatements = statementsToAdd.get(currentContext) ?? [];
		statementsToAdd.delete(currentContext);
		currentContext--;

		return newStatements.length === 0
			? node
			: ts.factory.createNodeArray([node, ...newStatements]);
	},
};
