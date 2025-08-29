// Data Structures //
export interface Color3 {
	r: number;
	g: number;
	b: number;
}

export interface Vector2 {
	x: number;
	y: number;
}

// Addon Types //
export interface KeyPickerAddon {
	type: "KeyPicker";
	mode: "Toggle" | "Hold" | "Always";
	value: string;
	text: string;
}

export interface ColorPickerAddon {
	type: "ColorPicker";
	value: Color3;
	title: string;
}

export type AddonsArray = KeyPickerAddon | ColorPickerAddon;

// Element Types //
interface BaseElement {
	index: number;
	visible: boolean;
	type: string;
	text: string;
	disabled: boolean;
}

export interface ToggleElement extends BaseElement {
	type: "Toggle";
	value: boolean;
	properties: {
		risky: boolean;
		addons?: AddonsArray[] | undefined;
	};
}

export interface LabelElement extends BaseElement {
	type: "Label";
	properties: {
		doesWrap: boolean;
		addons?: AddonsArray[] | undefined;
	};
}

export interface ButtonElement extends BaseElement {
	type: "Button";
	subButton?: {
		text: string;
	};
}

export interface DropdownElement extends BaseElement {
	type: "Dropdown";
	value: string | { [key: string]: boolean };
	multi: boolean | undefined;
	properties: {
		values: string[];
		disabledValues: string[] | undefined;
		multi: boolean | undefined;
	};
}

export interface SliderElement extends BaseElement {
	type: "Slider";
	value: number;
	properties: {
		min: number;
		max: number;
		compact: boolean | undefined;
		rounding: number | undefined;
		prefix: string;
		suffix: string;
	};
}

export interface InputElement extends BaseElement {
	type: "Input";
	value: string;
	properties: {
		placeholder: string;
		finished: boolean;
		emptyReset: string;
		numeric: boolean;
		clearTextOnFocus: boolean;
		allowEmpty: boolean;
	};
}

export interface DividerElement extends BaseElement {
	type: "Divider";
	properties: object;
}

export interface ImageElement extends BaseElement {
	type: "Image";
	visible: boolean;
	properties: {
		image: string;
		color: Color3;
		rectOffset: Vector2;
		rectSize: Vector2;
		height: number;
		scaleType: string;
		transparency: number;
	};
}

export type UIElement =
	| ToggleElement
	| LabelElement
	| ButtonElement
	| DropdownElement
	| SliderElement
	| InputElement
	| DividerElement
	| ImageElement;

// JSON File Types //
export interface GroupboxData {
	name: string;
	order: number;
	side: "Left" | "Right" | "Unknown";
	elements: UIElement[];
}

export interface TabboxTab {
	type: "Tab";
	name: string;
	order: number;
	elements: UIElement[];
}

export interface TabboxData {
	type: "Tabbox";
	name: number;
	side: "Left" | "Right" | "Unknown";
	tabs: {
		[key: string]: TabboxTab;
	};
}

export interface TabData {
	name: string;
	type: string;
	icon: string;
	order: number;
	tabboxes: {
		Left: TabboxData[];
		Right: TabboxData[];
		Unknown: TabboxData[];
	};
	groupboxes: {
		Left: { [key: string]: GroupboxData };
		Right: { [key: string]: GroupboxData };
		Unknown: { [key: string]: GroupboxData };
	};
}

export interface UIData {
	tabs: {
		[key: string]: TabData;
	};
}

