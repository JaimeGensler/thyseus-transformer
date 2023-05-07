import {
	getTransformer,
	type TransformerOptions,
} from '../../ts-transformer/src';

export default function thyseusLoader(
	sourceCode: string,
	options: TransformerOptions,
) {
	const transform = getTransformer(options);
	return transform(sourceCode);
}
