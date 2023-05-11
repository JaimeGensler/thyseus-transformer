import { CommandsDescriptor, SystemResourceDescriptor, EventReaderDescriptor, EventWriterDescriptor } from 'thyseus/descriptors';
export function mySystem(commands: Commands, map: SystemRes<Map<bigint, bigint>>, reader: EventReader<LevelUp>, writer: EventWriter<LevelDown>) { }
mySystem.parameters = [CommandsDescriptor(), SystemResourceDescriptor(Map), EventReaderDescriptor(LevelUp), EventWriterDescriptor(LevelDown)];
