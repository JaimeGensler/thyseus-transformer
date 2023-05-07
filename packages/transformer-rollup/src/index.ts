import {
	getTransformer,
	type TransformerOptions,
} from '../../ts-transformer/src';
import type { Plugin } from 'vite';

export function thyseusPlugin(config?: TransformerOptions): Plugin {
	const transformer = getTransformer(config);

	return {
		name: '@thyseus/transformer-rollup',
		version: '0.12.0',
		transform(_) {
			return {
				code: transformer(_),
				map: null,
			};
		},
	};
}
