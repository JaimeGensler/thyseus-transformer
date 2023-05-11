/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
	build: {
		target: 'esnext',
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
			},
			name: 'thyseus_ts_transformer',
		},
		rollupOptions: {
			external: ['typescript'],
			output: {
				exports: 'named',
				globals: {
					typescript: 'ts',
				},
			},
		},
	},
});
