import { struct } from 'thyseus';
class MyClass {
	static size = 8;
	static alignment = 8;
	__$$b = 0;
	a: number;
	deserialize() {
		this.a = Memory.f64[this.__$$b >> 3];
	}
	serialize() {
		Memory.f64[this.__$$b >> 3] = this.a;
	}
}
