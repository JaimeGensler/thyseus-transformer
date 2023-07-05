import ts from 'typescript';
import {
	TypeDescription,
	createOffset,
	type SerializationProps,
} from './TypeDescription';
import { numerics, type Numeric } from './numerics';

export class TupleTypeDescription extends TypeDescription {
	static is(node: ts.TypeNode): TupleTypeDescription | null {
		if (!ts.isTupleTypeNode(node)) {
			return null;
		}

		let elementType = node.elements[0].getText();
		for (const element of node.elements) {
			const elementText = element.getText();
			if (
				elementText !== elementType ||
				!(elementText in numerics || elementText == 'number')
			) {
				return null;
			}
		}

		return new this(
			node.elements.length,
			(elementType === 'number' ? 'f64' : elementType) as any,
		);
	}

	type: Numeric;
	elementSize: number;
	length: number;
	constructor(length: number, type: Numeric) {
		const alignment = 1 << numerics[type];
		super(alignment * length, alignment);
		this.elementSize = alignment;
		this.type = type;
		this.length = length;
	}
	serialize({ offset, name }: SerializationProps) {
		return ts.factory.createExpressionStatement(
			ts.factory.createCallExpression(
				ts.factory.createPropertyAccessExpression(
					ts.factory.createPropertyAccessExpression(
						ts.factory.createIdentifier('Memory'),
						ts.factory.createIdentifier(this.type),
					),
					ts.factory.createIdentifier('set'),
				),
				undefined,
				[
					ts.factory.createPropertyAccessExpression(
						ts.factory.createThis(),
						ts.factory.createIdentifier(name),
					),
					createOffset(offset, numerics[this.type]),
				],
			),
		);
	}
	deserialize({ offset, name }: SerializationProps) {
		return Array.from({ length: this.length }, (_, i) =>
			ts.factory.createExpressionStatement(
				ts.factory.createBinaryExpression(
					ts.factory.createElementAccessExpression(
						ts.factory.createPropertyAccessExpression(
							ts.factory.createThis(),
							name,
						),
						ts.factory.createNumericLiteral(i),
					),
					ts.SyntaxKind.EqualsToken,
					ts.factory.createElementAccessExpression(
						ts.factory.createPropertyAccessExpression(
							ts.factory.createIdentifier('Memory'),
							ts.factory.createIdentifier(this.type),
						),
						createOffset(
							offset + i * this.elementSize,
							numerics[this.type],
						),
					),
				),
			),
		);
	}
}
