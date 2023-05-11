import { SystemResourceDescriptor } from 'thyseus';
class MyClass {
}
export function localResourceSystem(myClass: SystemRes<MyClass>) { }
localResourceSystem.parameters = [SystemResourceDescriptor(MyClass)];
