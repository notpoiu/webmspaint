import React, { useState, useCallback } from "react";

import { Groupbox } from "./elements/GroupBox";
import { TabContainer, TabLeft, TabRight } from "./elements/Tab";
import Divider from "./elements/Divider";
import Toggle from "./elements/Toggle";
import Button from "./elements/Button";
import Image from "./elements/Image";
import Label from "./elements/Label";
import { Tabbox } from "./elements/TabBox";
import Dropdown from "./elements/Dropdown";
import Input from "./elements/Input";
import { TabData, UIElement } from "./element.types";
import Slider from "./elements/Slider";

// Parsers //
export const ElementParser: React.FC<{
  element: UIElement;
  stateKeyPrefix?: string;
}> = ({ element, stateKeyPrefix }) => {
  if ("visible" in element && !element.visible) return null;

  switch (element.type) {
    case "Toggle":
      return (
        <Toggle
          text={element.text}
          checked={element.value}
          stateKey={`${stateKeyPrefix || "global"}:el:Toggle:${element.index}`}
        />
      );

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          multi={(element as any).multi ?? (element as any).properties?.multi}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          disabledValues={(element as any).properties?.disabledValues || []}
          stateKey={`${stateKeyPrefix || "global"}:el:Dropdown:${
            element.index
          }`}
        />
      );

    case "Slider":
      return (
        <Slider
          text={element.text}
          value={element.value}
          min={element.properties.min}
          max={element.properties.max}
          compact={element.properties.compact}
          rounding={element.properties.rounding}
          prefix={element.properties.prefix}
          suffix={element.properties.suffix}
          stateKey={`${stateKeyPrefix || "global"}:el:Slider:${element.index}`}
        />
      );

    case "Input":
      return (
        <Input
          text={element.text}
          value={element.value}
          placeholder={element.properties.placeholder}
          stateKey={`${stateKeyPrefix || "global"}:el:Input:${element.index}`}
        />
      );

    case "Divider":
      return <Divider />;

    case "Image":
      return (
        <Image
          image={element.properties.image}
          transparency={element.properties.transparency}
          scaleType={element.properties.scaleType}
          color={element.properties.color}
          rectOffset={element.properties.rectOffset}
          height={element.properties.height}
          rectSize={element.properties.rectSize}
        />
      );

    default:
      // const exhaustiveCheck: never = element;
      return (
        <div className="text-red-400 text-left">
          Unknown element type:{" "}
          {(element as { type: string }).type || "Unknown"}
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
            <Tabbox
              key={tabbox.name}
              tabs={tabbox.tabs}
              scope={`tab:${tabData.name}:left:tabbox:${tabbox.name}`}
            />
          ))}
        {groupboxes?.Left &&
          Object.values(groupboxes.Left).map((gb) => (
            <Groupbox key={gb.name} title={gb.name}>
              {gb.elements.map((el) => (
                <ElementParser
                  key={`left-gb-${gb.name}-${el.index}`}
                  element={el}
                  stateKeyPrefix={`tab:${tabData.name}:left:groupbox:${gb.name}`}
                />
              ))}
            </Groupbox>
          ))}
      </TabLeft>

      <TabRight>
        {tabboxes?.Right &&
          Object.values(tabboxes.Right).map((tabbox) => (
            <Tabbox
              key={tabbox.name}
              tabs={tabbox.tabs}
              scope={`tab:${tabData.name}:right:tabbox:${tabbox.name}`}
            />
          ))}

        {groupboxes?.Right &&
          Object.values(groupboxes.Right).map((gb) => (
            <Groupbox key={gb.name} title={gb.name}>
              {gb.elements.map((el) => (
                <ElementParser
                  key={`right-gb-${gb.name}-${el.index}`}
                  element={el}
                  stateKeyPrefix={`tab:${tabData.name}:right:groupbox:${gb.name}`}
                />
              ))}
            </Groupbox>
          ))}
      </TabRight>
    </TabContainer>
  );
};
