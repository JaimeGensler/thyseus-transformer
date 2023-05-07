type SystemParameterDescriptor = { descriptorName: string; importPath: string };
export type SystemParameterMap = Record<string, SystemParameterDescriptor>;

export const defaultSystemParameters: SystemParameterMap = {
	// Parameters
	Query: {
		descriptorName: 'QueryDescriptor',
		importPath: 'thyseus/descriptors',
	},
	Res: {
		descriptorName: 'ResourceDescriptor',
		importPath: 'thyseus/descriptors',
	},
	Commands: {
		descriptorName: 'CommandsDescriptor',
		importPath: 'thyseus/descriptors',
	},
	World: {
		descriptorName: 'WorldDescriptor',
		importPath: 'thyseus/descriptors',
	},
	SystemRes: {
		descriptorName: 'SystemResourceDescriptor',
		importPath: 'thyseus/descriptors',
	},
	EventReader: {
		descriptorName: 'EventReaderDescriptor',
		importPath: 'thyseus/descriptors',
	},
	EventWriter: {
		descriptorName: 'EventWriterDescriptor',
		importPath: 'thyseus/descriptors',
	},

	// Modifiers
	Mut: {
		descriptorName: 'Mut',
		importPath: 'thyseus/descriptors',
	},
	With: {
		descriptorName: 'With',
		importPath: 'thyseus/descriptors',
	},
	Without: {
		descriptorName: 'Without',
		importPath: 'thyseus/descriptors',
	},
	Or: {
		descriptorName: 'Or',
		importPath: 'thyseus/descriptors',
	},
	Optional: {
		descriptorName: 'Optional',
		importPath: 'thyseus/descriptors',
	},
};
