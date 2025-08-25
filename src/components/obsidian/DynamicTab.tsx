import React, { useState, useCallback } from "react";

import { Groupbox } from "./elements/GroupBox";
import { TabContainer, TabLeft, TabRight } from "./elements/Tab";
import Divider from "./elements/Divider";
import Toggle from "./elements/Toggle";
import Button from "./elements/Button";
import Label from "./elements/Label";
import { Tabbox } from "./elements/TabBox";
import Dropdown from "./elements/Dropdown";
import Input from "./elements/Input";

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

export type UIElement =
  | ToggleElement
  | LabelElement
  | ButtonElement
  | DropdownElement
  | SliderElement
  | InputElement
  | DividerElement;

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

// Parsers //
export const ElementParser: React.FC<{ element: UIElement }> = ({
  element,
}) => {
  if ("visible" in element && !element.visible) return null;

  switch (element.type) {
    case "Toggle":
      return <Toggle text={element.text} checked={element.value} />;

    case "Label":
      return <Label>{element.text}</Label>;

    case "Button":
      return (
        <Button
          text={element.text}
          subButton={element.subButton && element.subButton}
        />
      );

    case "Dropdown":
      return (
        <Dropdown
          text={element.text}
          value={element.value}
          options={element.properties.values}
          multi={element.multi}
        />
      );

    /*    case 'Slider':
            return <Slider text={element.text} value={element.value} min={element.properties.min} max={element.properties.max} />;
      */
    case "Input":
      return (
        <Input
          text={element.text}
          value={element.value}
          placeholder={element.properties.placeholder}
        />
      );

    case "Divider":
      return <Divider />;

    default:
      // const exhaustiveCheck: never = element;
      return (
        <div className="text-red-400 text-left">
          Unknown element type: {element.type}
        </div>
      );
  }
};

export const TabParser: React.FC<{ tabData: TabData | null }> = ({
  tabData,
}) => {
  if (!tabData) return null;

  const { groupboxes, tabboxes } = tabData;
  return (
    <TabContainer>
      <TabLeft>
        {tabboxes?.Left &&
          Object.values(tabboxes.Left).map((tabbox) => (
            <Tabbox key={tabbox.name} tabs={tabbox.tabs} />
          ))}
        {groupboxes?.Left &&
          Object.values(groupboxes.Left).map((gb) => (
            <Groupbox key={gb.name} title={gb.name}>
              {gb.elements.map((el) => (
                <ElementParser key={el.index} element={el} />
              ))}
            </Groupbox>
          ))}
      </TabLeft>

      <TabRight>
        {tabboxes?.Right &&
          Object.values(tabboxes.Right).map((tabbox) => (
            <Tabbox key={tabbox.name} tabs={tabbox.tabs} />
          ))}

        {groupboxes?.Right &&
          Object.values(groupboxes.Right).map((gb) => (
            <Groupbox key={gb.name} title={gb.name}>
              {gb.elements.map((el) => (
                <ElementParser key={el.index} element={el} />
              ))}
            </Groupbox>
          ))}
      </TabRight>
    </TabContainer>
  );
};
