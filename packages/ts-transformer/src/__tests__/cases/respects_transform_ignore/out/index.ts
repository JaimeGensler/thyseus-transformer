import { CommandsDescriptor } from 'thyseus/descriptors';
// thyseus-ignore
function mySystem(systemRes: SystemRes<Map<bigint, bigint>>) { }
function otherSystem(commands: Commands) { }
otherSystem.parameters = [CommandsDescriptor()];
