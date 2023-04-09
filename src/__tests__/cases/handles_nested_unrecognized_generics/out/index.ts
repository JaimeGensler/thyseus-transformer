import { SystemResourceDescriptor } from 'thyseus/descriptors';
function mySystem(systemRes: SystemRes<Map<bigint, bigint>>) { }
mySystem.parameters = [SystemResourceDescriptor(Map)];
