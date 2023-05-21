import { createFilter } from '@rollup/pluginutils';
import {
	getTransformer,
	type TransformerOptions,
} from '@thyseus/typescript-transformer';
import type { Plugin } from 'vite';

type ThyseusPluginConfig = {
	include?: string;
	exclude?: string;
} & TransformerOptions;
export function thyseusPlugin({
	include = '**/*.ts',
	exclude,
	...transformerConfig
}: ThyseusPluginConfig = {}) {
	const transform = getTransformer(transformerConfig);
	const filter = createFilter(include, exclude);

	return {
		name: '@thyseus/transformer-rollup',
		version: '0.12.0-beta.3',
		enforce: 'pre',
		transform(file, id) {
			if (!filter(id)) {
				return;
			}

			return {
				code: transform(file),
				map: null,
			};
		},
	} satisfies Plugin;
}
