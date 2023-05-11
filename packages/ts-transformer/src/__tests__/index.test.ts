import { describe, it, expect } from 'vitest';
import { getTransformer } from '../index';

const cases = createTestSuite(
	import.meta.glob('./cases/**/*.ts', {
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

describe('transformer', () => {
	for (const [testName, { inFiles, outFiles, skip, only }] of Object.entries(
		cases,
	)) {
		const itType = skip ? it.skip : only ? it.only : it;
		itType(testName.replaceAll('_', ' '), () => {
			const transform = getTransformer();
			for (let i = 0; i < inFiles.length; i++) {
				expect(transform(inFiles[i].content)).toBe(outFiles[i].content);
			}
		});
	}
});
