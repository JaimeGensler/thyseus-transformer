import * as rollup from 'rollup';
import { TransformerOptions } from '@thyseus/typescript-transformer';

type ThyseusPluginConfig = {
    include?: string;
    exclude?: string;
} & TransformerOptions;
declare function thyseusPlugin({ include, exclude, ...transformerConfig }?: ThyseusPluginConfig): {
    name: string;
    version: string;
    enforce: "pre";
    transform(this: rollup.TransformPluginContext, file: string, id: string): {
        code: string;
        map: null;
    } | undefined;
};

export { thyseusPlugin };
