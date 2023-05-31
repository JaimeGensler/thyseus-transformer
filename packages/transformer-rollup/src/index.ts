import { createFilter } from '@rollup/pluginutils';
import {
	getTransformer,
	// type transformerConfig,
} from '@thyseus/typescript-transformer';
import type { Plugin } from 'vite';

// TODO: Fix types, they got a little goofed beta.7

type TransformerConfig = Parameters<typeof getTransformer>[0];
type ThyseusPluginConfig = {
	include?: string;
	exclude?: string;
} & Partial<TransformerConfig>;
export function thyseusPlugin({
	include = '**/*.ts',
	exclude,
	...transformerConfig
}: ThyseusPluginConfig = {}) {
	const transform = getTransformer(transformerConfig as any);
	const filter = createFilter(include, exclude);

	return {
		name: '@thyseus/transformer-rollup',
		version: '0.12.0-beta.7',
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
