type PipeFunction<I, O> = (value: I) => O;

export function pipe<I, O>(...fns: PipeFunction<I, O>[]): PipeFunction<I, O> {
	return function (value) {
		return fns.reduce((acc, fn) => (fn as any)(acc as any), value) as any;
	};
}
