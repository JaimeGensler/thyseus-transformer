import ts from 'typescript';
import {
	TypeDescription,
	createOffset,
	type SerializationProps,
} from './TypeDescription';

export class StringTypeDescription extends TypeDescription {
	static is(node: ts.TypeNode): StringTypeDescription | null {
		if (node.getText() === 'string') {
			return new this();
		}
		return null;
	}

	constructor() {
		super(12, 4);
	}

	serialize({ offset, name }: SerializationProps) {
		const selfOffset = createOffset(offset, 0);
		const propertyAccess = ts.factory.createPropertyAccessExpression(
			ts.factory.createThis(),
			ts.factory.createIdentifier(name),
		);
		return ts.factory.createExpressionStatement(
			ts.factory.createCallExpression(
				ts.factory.createIdentifier('serializeString'),
				undefined,
				[selfOffset, propertyAccess],
			),
		);
	}
	deserialize({ name, offset }: SerializationProps) {
		const propertyAccess = ts.factory.createPropertyAccessExpression(
			ts.factory.createThis(),
			ts.factory.createIdentifier(name),
		);
		const deserialized = ts.factory.createCallExpression(
			ts.factory.createIdentifier('deserializeString'),
			undefined,
			[createOffset(offset, 0)],
		);
		return ts.factory.createExpressionStatement(
			ts.factory.createBinaryExpression(
				propertyAccess,
				ts.SyntaxKind.EqualsToken,
				deserialized,
			),
		);
	}
}
