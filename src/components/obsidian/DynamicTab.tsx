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
import { TabData, UIElement } from "./element.types";

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
            return <Slider text={element.text} value={element.value} min={element.properties.min} max={element.properties.max} compact={element.properties.compact} rounding={element.properties.rounding} prefix={element.properties.prefix} suffix={element.properties.suffix} />;
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
