import { TransformerOptions } from '@thyseus/typescript-transformer';
import { Plugin } from 'vite';

declare function thyseusPlugin(config?: TransformerOptions): Plugin;

export { thyseusPlugin };
