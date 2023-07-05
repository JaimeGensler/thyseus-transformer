import { struct } from 'thyseus';
class StringOnly {
	static size = 12;
	static alignment = 4;
	__$$b = 0;
	val: string;
	deserialize() {
		this.val = deserializeString(this.__$$b);
	}
	serialize() {
		serializeString(this.__$$b, this.val);
	}
}
class OffsetString {
	static size = 24;
	static alignment = 8;
	__$$b = 0;
	first: number;
	val: string;
	deserialize() {
		this.first = Memory.f64[this.__$$b >> 3];
		this.val = deserializeString(this.__$$b + 8);
	}
	serialize() {
		Memory.f64[this.__$$b >> 3] = this.first;
		serializeString(this.__$$b + 8, this.val);
	}
}
