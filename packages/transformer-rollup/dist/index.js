import { createFilter } from "@rollup/pluginutils";
import { getTransformer } from "@thyseus/typescript-transformer";
function thyseusPlugin({
  include = "**/*.ts",
  exclude,
  ...transformerConfig
} = {}) {
  const transformer = getTransformer(transformerConfig), filter = createFilter(include, exclude);
  return {
    name: "@thyseus/transformer-rollup",
    version: "0.12.0-beta.3",
    enforce: "pre",
    transform(file, id) {
      if (filter(id))
        return {
          code: transformer(file),
          map: null
        };
    }
  };
}
export {
  thyseusPlugin
};
