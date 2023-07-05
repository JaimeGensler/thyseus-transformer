import { struct } from 'thyseus';
class MyClass {
	static size = 1;
	static alignment = 1;
	__$$b = 0;
	a: boolean;
	deserialize() {
		this.a = Boolean(Memory.u8[this.__$$b]);
	}
	serialize() {
		Memory.u8[this.__$$b] = Number(this.a);
	}
}
