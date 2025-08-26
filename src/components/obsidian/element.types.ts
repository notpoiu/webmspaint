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

/*
info.properties = {
            image = element.Image,
            color = UIExtractor:Serialize(element.Color),
            rectOffset = UIExtractor:Serialize(element.RectOffset),
            rectSize = UIExtractor:Serialize(element.RectSize),
            height = UIExtractor:Serialize(element.Height),
            scaleType = element.ScaleType.Name,
            transparency = element.Transparency
        }
*/
export interface ImageElement {
  index: number;
  type: "Image";
  properties: {
    image: string;
    color: {
      r: number;
      g: number;
      b: number;
    };
    rectOffset: {
      x: number;
      y: number;
    };
    rectSize: {
      x: number;
      y: number;
    };
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
  side: "Left" | "Right" | "Unknown";
  elements: UIElement[];
}

export interface TabboxTab {
  type: "Tab";
  name: string;
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
