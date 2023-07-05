import { struct } from 'thyseus';
abstract class Abstract {
	static size = 0;
	static alignment = 1;
	__$$b = 0;
	abstract field: number;
	deserialize() {
	}
	serialize() {
	}
}
class Concrete {
	static size = 0;
	static alignment = 1;
	__$$b = 0;
	declare declaredProp: number;
	static staticProp: number;
	readonly prop: number;
	deserialize() {
	}
	serialize() {
	}
}
