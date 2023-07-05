import { struct } from 'thyseus';
class ArrayStruct {
	static size = 24;
	static alignment = 4;
	__$$b = 0;
	a: i16[];
	b: Array<number>;
	deserialize() {
		deserializeArray(this.__$$b, this.a, 'i16');
		deserializeArray(this.__$$b + 12, this.b, 'f64');
	}
	serialize() {
		serializeArray(this.__$$b, this.a, 'i16');
		serializeArray(this.__$$b + 12, this.b, 'f64');
	}
}
