import { EventReaderDescriptor, EventWriterDescriptor } from 'thyseus';
const arrowSystem = (eventReader: EventReader<LevelUpEvent>, eventWriter: EventWriter<LevelUpEvent>) => { };
arrowSystem.parameters = [EventReaderDescriptor(LevelUpEvent), EventWriterDescriptor(LevelUpEvent)];
