type SystemParameterDescriptor = {
    descriptorName: string;
    importPath: string;
};
type SystemParameterMap = Record<string, SystemParameterDescriptor>;

interface TransformerOptions {
    systemParameters?: SystemParameterMap;
}
declare function getTransformer(options?: TransformerOptions): (inputFile: string) => string;

export { TransformerOptions, getTransformer };
