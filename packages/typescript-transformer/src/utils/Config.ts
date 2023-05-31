import {
	defaultSystemParameters,
	type SystemParameterMap,
} from '../systemParameters';

type TransformerConfigComplete = {
	systemParameters: SystemParameterMap;
};
export type TransformerConfig = Partial<TransformerConfigComplete>;

let config: TransformerConfigComplete;
export const Config = {
	set(newConfig: Partial<TransformerConfig> | undefined) {
		config = {
			systemParameters: {
				...(newConfig?.systemParameters ?? {}),
				...defaultSystemParameters,
			},
		};
	},
	use<T extends keyof TransformerConfig>(
		key: T,
	): TransformerConfigComplete[T] {
		return config[key];
	},
};
