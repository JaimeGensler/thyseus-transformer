import { describe, it, expect } from 'vitest';
import { getTransformer } from '../index';
import prettier from 'prettier';

const systemTests = createTestSuite(
	import.meta.glob('./systems/**/*.ts', {
		eager: true,
		as: 'raw',
	}),
);
const structTests = createTestSuite(
	import.meta.glob('./structs/**/*.ts', {
		eager: true,
		as: 'raw',
	}),
);

type Test = {
	inFiles: File[];
	outFiles: File[];
	skip: boolean;
	only: boolean;
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
					inFiles: [],
					outFiles: [],
					skip: testName.startsWith('skip.'),
					only: testName.startsWith('only.'),
				};
			}
			const test = testSuites[testName];
			const file = {
				path: new URL(path, import.meta.url).pathname,
				content,
			};
			if (inOrOut === 'in' && fileName === 'index.ts') {
				test.inFiles.unshift(file);
			} else {
				test[`${inOrOut as 'in' | 'out'}Files`].push(file);
			}
			return testSuites;
		},
		{},
	);
}

const customConfig = {
	MyCustomParameter: {
		descriptorName: 'MyCustomParameterDescriptor',
		importPath: ':somewhere',
	},
};

describe('systems', () => {
	for (const [testName, { inFiles, outFiles, skip, only }] of Object.entries(
		systemTests,
	)) {
		const itType = skip ? it.skip : only ? it.only : it;
		itType(testName.replaceAll('_', ' '), () => {
			const transform = getTransformer({
				systemParameters: customConfig,
			});
			for (let i = 0; i < inFiles.length; i++) {
				expect(transform(inFiles[i].content)).toBe(outFiles[i].content);
			}
		});
	}
});

const format = (str: string) =>
	prettier.format(str, {
		parser: 'typescript',
	});
describe.only('structs', () => {
	for (const [testName, { inFiles, outFiles, skip, only }] of Object.entries(
		structTests,
	)) {
		const itType = skip ? it.skip : only ? it.only : it;
		itType(testName.replaceAll('_', ' '), () => {
			const transform = getTransformer({
				systemParameters: customConfig,
			});
			for (let i = 0; i < inFiles.length; i++) {
				expect(format(transform(inFiles[i].content))).toBe(
					format(outFiles[i].content),
				);
			}
		});
	}
});
