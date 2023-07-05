import ts from 'typescript';

export type SerializationProps = {
	name: string;
	offset: number;
};
export class TypeDescription {
	size: number;
	alignment: number;
	constructor(size: number, alignment: number) {
		this.size = size;
		this.alignment = alignment;
	}

	serialize(props: SerializationProps): ts.Statement | ts.Statement[] {
		return [];
	}
	deserialize(props: SerializationProps): ts.Statement | ts.Statement[] {
		return [];
	}
}

export function createOffset(offset: number, shift: number) {
	const selfOffsetAccess = ts.factory.createPropertyAccessExpression(
		ts.factory.createThis(),
		ts.factory.createIdentifier('__$$b'),
	);
	const fullOffset =
		offset > 0
			? ts.factory.createBinaryExpression(
					selfOffsetAccess,
					ts.SyntaxKind.PlusToken,
					ts.factory.createNumericLiteral(String(offset)),
			  )
			: selfOffsetAccess;
	if (shift > 0) {
		return ts.factory.createBinaryExpression(
			offset > 0
				? ts.factory.createParenthesizedExpression(fullOffset)
				: fullOffset,
			ts.SyntaxKind.GreaterThanGreaterThanToken,
			ts.factory.createNumericLiteral(shift),
		);
	}
	return fullOffset;
}
