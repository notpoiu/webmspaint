// Data Structures //
interface Color3 {
  r: number;
  g: number;
  b: number;
}

interface Vector2 {
  x: number;
  y: number;
}

// Element Types //
interface BaseElement {
  index: number;
  visible: boolean;
  type: string;
  text: string;
  disabled: boolean;
}

export interface KeybindElement extends BaseElement {
  type: "KeyPicker";
  mode: "Toggle" | "Hold" | "Always";
  value: string;
}

export interface ColorPickerElement extends BaseElement {
  type: "ColorPicker";
  value: Color3;
}

export interface ToggleElement extends BaseElement {
  type: "Toggle";
  value: boolean;
}

export interface LabelElement extends BaseElement {
  type: "Label";
  properties: {
    doesWrap: boolean;
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
    disabledValues: string[];
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

export interface DividerElement {
  index: number;
  type: "Divider";
  properties: object;
  visible?: boolean;
}

export interface ImageElement {
  index: number;
  type: "Image";
  properties: {
    image: string;
    color: Color3;
    rectOffset: Vector2;
    rectSize: Vector2;
    height: number;
    scaleType: string;
    transparency: number;
  };
  visible?: boolean;
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
