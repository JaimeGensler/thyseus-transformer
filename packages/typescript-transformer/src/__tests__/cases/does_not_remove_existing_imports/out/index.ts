import { Something, SomethingElse, CommandsDescriptor, ResourceDescriptor } from 'thyseus';
import ADefaultImport, { aNamedImport } from 'somewhereElse';
function mySystem(commands: Commands, Res: Res<Time>) { }
mySystem.parameters = [CommandsDescriptor(), ResourceDescriptor(Time)];
