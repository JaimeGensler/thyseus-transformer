import ts from 'typescript';
import {
	TypeDescription,
	createOffset,
	type SerializationProps,
} from './TypeDescription';
import { numerics, type Numeric } from './numerics';

export class NumericTypeDescription extends TypeDescription {
	static is(node: ts.TypeNode): NumericTypeDescription | null {
		const text = node.getText();
		if (text in numerics || text === 'number') {
			return new this((text === 'number' ? 'f64' : text) as Numeric);
		}
		return null;
	}

	type: Numeric;

	constructor(type: Numeric) {
		const size = 1 << numerics[type];
		super(size, size);
		this.type = type;
	}

	serialize({ offset, name }: any) {
		return ts.factory.createExpressionStatement(
			ts.factory.createBinaryExpression(
				this.memoryLocation(offset),
				ts.SyntaxKind.EqualsToken,
				this.thisProperty(name),
			),
		);
	}
	deserialize({ offset, name }: any) {
		return ts.factory.createExpressionStatement(
			ts.factory.createBinaryExpression(
				this.thisProperty(name),
				ts.SyntaxKind.EqualsToken,
				this.memoryLocation(offset),
			),
		);
	}

	memoryLocation(offset: number) {
		return ts.factory.createElementAccessExpression(
			ts.factory.createPropertyAccessExpression(
				ts.factory.createIdentifier('Memory'),
				ts.factory.createIdentifier(this.type),
			),
			createOffset(offset, numerics[this.type]),
		);
	}
	thisProperty(name: string) {
		return ts.factory.createPropertyAccessExpression(
			ts.factory.createThis(),
			ts.factory.createIdentifier(name),
		);
	}
}
export class BooleanTypeDescription extends NumericTypeDescription {
	static is(node: ts.TypeNode): BooleanTypeDescription | null {
		const text = node.getText();
		if (text === 'boolean') {
			return new this('u8');
		}
		return null;
	}

	serialize({ offset, name }: SerializationProps) {
		return ts.factory.createExpressionStatement(
			ts.factory.createBinaryExpression(
				this.memoryLocation(offset),
				ts.SyntaxKind.EqualsToken,
				ts.factory.createCallExpression(
					ts.factory.createIdentifier('Number'),
					undefined,
					[this.thisProperty(name)],
				),
			),
		);
	}
	deserialize({ offset, name }: SerializationProps) {
		return ts.factory.createExpressionStatement(
			ts.factory.createBinaryExpression(
				this.thisProperty(name),
				ts.SyntaxKind.EqualsToken,
				ts.factory.createCallExpression(
					ts.factory.createIdentifier('Boolean'),
					undefined,
					[this.memoryLocation(offset)],
				),
			),
		);
	}
}
