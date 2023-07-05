import ts from 'typescript';
import {
	BooleanTypeDescription,
	NumericTypeDescription,
} from './types/PrimitiveTypeDescription';
import { TupleTypeDescription } from './types/TupleTypeDescription';
import { StringTypeDescription } from './types/StringTypeDescription';
import { TypeDescription } from './types/TypeDescription';
import { ArrayTypeDescription } from './types';

const recognizedTypes = [
	NumericTypeDescription,
	BooleanTypeDescription,
	TupleTypeDescription,
	StringTypeDescription,
	ArrayTypeDescription,
];
export function getType(node: ts.PropertyDeclaration): TypeDescription | null {
	if (!node.type) {
		return null;
	}
	for (const typeDescription of recognizedTypes) {
		const result = typeDescription.is(node.type);
		if (result) {
			return result;
		}
	}
	return null;
}
