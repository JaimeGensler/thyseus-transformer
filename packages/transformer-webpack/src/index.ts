import {
	getTransformer,
	type TransformerConfig,
} from '@thyseus/typescript-transformer';

export default function tsTransformLoader(this: any, source: string) {
	const options: TransformerConfig = this.query;
	const transform = getTransformer(options);

	return transform(source);
}
