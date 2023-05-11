import { CommandsDescriptor, SystemResourceDescriptor, EventReaderDescriptor, EventWriterDescriptor } from 'thyseus';
export function mySystem(commands: Commands, map: SystemRes<Map<bigint, bigint>>, reader: EventReader<LevelUp>, writer: EventWriter<LevelDown>) { }
mySystem.parameters = [CommandsDescriptor(), SystemResourceDescriptor(Map), EventReaderDescriptor(LevelUp), EventWriterDescriptor(LevelDown)];
