import ts from 'typescript';
import { assert } from '../utils';
import { isStruct, isTransformableMember } from './gatekeep';
import { createSerialize, createDeserialize } from './createMethod';
import { getType } from './getType';
import type { TypeDescription } from './types/TypeDescription';

type StructProperty = {
	name: string;
	type: TypeDescription;
};
export function transformStructs(node: ts.Node) {
	if (!isStruct(node)) {
		return node;
	}

	const propertyList: StructProperty[] = [];
	for (const member of node.members) {
		if (isTransformableMember(member)) {
			const typeDescription = getType(member);
			// Throw if consumer is using types that won't work
			assert(
				typeDescription,
				'Unrecognized type in @struct class - structs can only contain properties of specific types.',
			);

			propertyList.push({
				name: member.name.getText(),
				type: typeDescription,
			});
		}
	}
	propertyList.sort((a, z) => z.type.alignment - a.type.alignment);
	const [size, alignment] = getSizeAndAlignment(propertyList);

	const sizeProperty = ts.factory.createPropertyDeclaration(
		[ts.factory.createToken(ts.SyntaxKind.StaticKeyword)],
		'size',
		undefined,
		undefined,
		ts.factory.createNumericLiteral(size),
	);
	const alignmentProperty = ts.factory.createPropertyDeclaration(
		[ts.factory.createToken(ts.SyntaxKind.StaticKeyword)],
		'alignment',
		undefined,
		undefined,
		ts.factory.createNumericLiteral(alignment),
	);
	const byteOffsetProperty = ts.factory.createPropertyDeclaration(
		undefined,
		'__$$b',
		undefined,
		undefined,
		ts.factory.createNumericLiteral(0),
	);

	const modifiedMembers = [
		sizeProperty,
		alignmentProperty,
		byteOffsetProperty,
		...node.members,
		createDeserialize(propertyList),
		createSerialize(propertyList),
	];
	const modifiedModifiers = node.modifiers?.filter(
		modifier =>
			!(
				ts.isDecorator(modifier) &&
				modifier.expression.getText() === 'struct'
			),
	);
	return ts.factory.updateClassDeclaration(
		node,
		modifiedModifiers,
		node.name,
		node.typeParameters,
		node.heritageClauses,
		modifiedMembers,
	);
}
const getSizeAndAlignment = (
	properties: StructProperty[],
): [number, number] => {
	let size = 0;
	let alignment = 1;
	for (const { type } of properties) {
		size += type.size;
		alignment = Math.max(alignment, type.alignment);
	}

	return [Math.ceil(size / alignment) * alignment, alignment];
};
