import { SystemResourceDescriptor } from 'thyseus/descriptors';
class MyClass {
}
export function localResourceSystem(myClass: SystemRes<MyClass>) { }
localResourceSystem.parameters = [SystemResourceDescriptor(MyClass)];
