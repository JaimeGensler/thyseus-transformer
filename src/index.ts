import ts from 'typescript';
import { thyseusTransformer, type SystemParameterMap } from './transformer';
import type { Plugin } from 'vite';

interface ThyseusPluginConfig {
	systemParameters?: SystemParameterMap;
}

export function thyseusPlugin(config?: ThyseusPluginConfig): Plugin {
	const printer = ts.createPrinter();

	return {
		name: '@thyseus/plugin-vite',
		version: '0.12.0',
		transform(_, id) {
			const program = ts.createProgram([id], {});
			const transformer = thyseusTransformer(program);
			const sourceFile = program.getSourceFile(id)!;
			const { transformed } = ts.transform(sourceFile, [transformer]);
			return {
				code: printer.printFile(transformed[0]),
				map: null,
			};
		},
	};
}
