import ts from 'typescript';
import {
	TypeDescription,
	createOffset,
	type SerializationProps,
} from './TypeDescription';
import { numerics } from './numerics';

function extractGeneric(typeNode: ts.TypeNode): string {
	if (ts.isArrayTypeNode(typeNode)) {
		return typeNode.elementType.getText();
	}
	if (
		ts.isTypeReferenceNode(typeNode) &&
		typeNode.typeArguments &&
		typeNode.typeArguments.length === 1
	) {
		return typeNode.typeArguments[0].getText();
	}
	return '';
}
export class ArrayTypeDescription extends TypeDescription {
	static is(node: ts.TypeNode): ArrayTypeDescription | null {
		if (
			ts.isArrayTypeNode(node) ||
			(ts.isTypeReferenceNode(node) &&
				ts.isIdentifier(node.typeName) &&
				node.typeName.text === 'Array' &&
				node.typeArguments !== undefined &&
				node.typeArguments.length === 1)
		) {
			const genericType = extractGeneric(node);
			if (genericType in numerics || genericType) {
				return new this(genericType === 'number' ? 'f64' : genericType);
			}
		}
		return null;
	}
	#type: string;

	constructor(type: string) {
		super(12, 4);
		this.#type = type;
	}

	serialize({ offset, name }: SerializationProps) {
		const selfOffset = createOffset(offset, 0);
		const propertyAccess = ts.factory.createPropertyAccessExpression(
			ts.factory.createThis(),
			ts.factory.createIdentifier(name),
		);
		return ts.factory.createExpressionStatement(
			ts.factory.createCallExpression(
				ts.factory.createIdentifier('serializeArray'),
				undefined,
				[
					selfOffset,
					propertyAccess,
					ts.factory.createStringLiteral(this.#type),
				],
			),
		);
	}
	deserialize({ name, offset }: SerializationProps) {
		const propertyAccess = ts.factory.createPropertyAccessExpression(
			ts.factory.createThis(),
			ts.factory.createIdentifier(name),
		);
		return ts.factory.createExpressionStatement(
			ts.factory.createCallExpression(
				ts.factory.createIdentifier('deserializeArray'),
				undefined,
				[
					createOffset(offset, 0),
					propertyAccess,
					ts.factory.createStringLiteral(this.#type),
				],
			),
		);
	}
}
