import {
	getTransformer,
	type TransformerOptions,
} from '@thyseus/typescript-transformer';
import type { Plugin } from 'vite';

export function thyseusPlugin(config?: TransformerOptions): Plugin {
	const transformer = getTransformer(config);

	return {
		name: '@thyseus/transformer-rollup',
		version: '0.12.0-beta.3',
		transform(file) {
			return {
				code: transformer(file),
				map: null,
			};
		},
	};
}
