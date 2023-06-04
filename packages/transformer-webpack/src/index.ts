import { getOptions } from 'loader-utils';
import { getTransformer } from '@thyseus/typescript-transformer';

export default function tsTransformLoader(this: any, source: string) {
	const options: any = getOptions(this as any) || {};
	const transform = getTransformer(options);

	return transform(source);
}
