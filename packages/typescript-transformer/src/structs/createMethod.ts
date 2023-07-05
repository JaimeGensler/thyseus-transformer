import ts from 'typescript';
import type { TypeDescription } from './types';

type StructProperty = { name: string; type: TypeDescription };

export function createSerialize(properties: StructProperty[]) {
	let offset = 0;
	const statements: ts.Statement[] = [];
	for (const { name, type } of properties) {
		statements.push(...[type.serialize({ name, offset })].flat());
		offset += type.size;
	}
	return createMethod('serialize', statements);
}
export function createDeserialize(properties: StructProperty[]) {
	let offset = 0;
	const statements: ts.Statement[] = [];
	for (const { name, type } of properties) {
		statements.push(...[type.deserialize({ name, offset })].flat());
		offset += type.size;
	}
	return createMethod('deserialize', statements);
}

function createMethod(
	name: string,
	statements: ts.Statement[],
): ts.MethodDeclaration {
	return ts.factory.createMethodDeclaration(
		undefined,
		undefined,
		name,
		undefined,
		undefined,
		[],
		undefined,
		ts.factory.createBlock(statements),
	);
}
