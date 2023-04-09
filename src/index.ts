import ts from 'typescript';
import { thyseusTransformer, type SystemParameterMap } from './transformer';
import type { Plugin } from 'vite';

interface PluginConfig {
	systemParameters: SystemParameterMap;
}

export function thyseusPlugin(config?: PluginConfig): Plugin {
	let program: ts.Program;
	let checker: ts.TypeChecker;
	let transformer: ts.TransformerFactory<ts.SourceFile>;
	const printer = ts.createPrinter();

	return {
		name: '@thyseus/plugin-vite',
		version: '0.12.0',
		configResolved({ root }) {
			program = ts.createProgram([root], { noEmit: true });
			checker = program.getTypeChecker();
			transformer = thyseusTransformer(program);
		},
		transform(_, id) {
			const sourceFile = program.getSourceFile(id)!;
			const { transformed } = ts.transform(sourceFile, [transformer]);
			return {
				code: printer.printFile(transformed[0]),
				map: null,
			};
		},
	};
}
