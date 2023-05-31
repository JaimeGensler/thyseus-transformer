import {
	defaultSystemParameters,
	type SystemParameterMap,
} from '../systemParameters';

export interface TransformerConfig {
	systemParameters: SystemParameterMap;
}

let config: TransformerConfig;
export const Config = {
	set(newConfig: Partial<TransformerConfig> | undefined) {
		config = {
			systemParameters: {
				...(newConfig?.systemParameters ?? {}),
				...defaultSystemParameters,
			},
		};
	},
	use<T extends keyof TransformerConfig>(key: T): TransformerConfig[T] {
		return config[key];
	},
};
