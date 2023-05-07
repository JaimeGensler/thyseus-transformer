import { describe, it, expect } from 'vitest';
import { thyseusPlugin } from '..';

function setupPlugin(root: any) {
	return thyseusPlugin() as { transform: (...args: any[]) => any };
}

const cases = createTestSuite(
	import.meta.glob('./cases/**/*.ts', {
		eager: true,
		as: 'raw',
	}),
);

type Test = {
	root: string;
	inFiles: File[];
	outFiles: File[];
};
type File = {
	path: string;
	content: string;
};

type TestSuites = Record<string, Test>;

function createTestSuite(files: Record<string, string>) {
	return Object.entries(files).reduce<TestSuites>(
		(testSuites, [path, content]) => {
			const [, , testName, inOrOut, fileName] = path.split('/');
			if (!(testName in testSuites)) {
				testSuites[testName] = {
					root: '',
					inFiles: [],
					outFiles: [],
				};
			}
			const test = testSuites[testName];
			const file = {
				path: new URL(path, import.meta.url).pathname,
				content,
			};
			if (inOrOut === 'in' && fileName === 'index.ts') {
				test.root = file.path;
				test.inFiles.unshift(file);
			} else {
				test[`${inOrOut as 'in' | 'out'}Files`].push(file);
			}
			return testSuites;
		},
		{},
	);
}

describe('transformer', () => {
	for (const [testName, { root, inFiles, outFiles }] of Object.entries(
		cases,
	)) {
		if (testName === 'works_for_aliases') {
			continue;
		}
		it(testName.replaceAll('_', ' '), () => {
			const plugin = setupPlugin(root);
			for (let i = 0; i < inFiles.length; i++) {
				expect(
					plugin.transform(inFiles[i].content, inFiles[i].path).code,
				).toBe(outFiles[i].content);
			}
		});
	}
});
