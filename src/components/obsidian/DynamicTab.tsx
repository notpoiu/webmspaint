import React from "react";

import { Groupbox } from "./elements/GroupBox";
import { TabContainer, TabLeft, TabRight } from "./elements/Tab";
import Divider from "./elements/Divider";
import Toggle from "./elements/Toggle";
import Button from "./elements/Button";
import ObsidianImage from "./elements/Image";
import Label from "./elements/Label";
import Tabbox from "./elements/TabBox";
import Dropdown from "./elements/Dropdown";
import Input from "./elements/Input";
import { TabData, UIElement, AddonsArray } from "./element.types";
import Slider from "./elements/Slider";
import KeyPicker from "./elements/addons/KeyPicker";
import AddonContainer from "./elements/addons/AddonContainer";
import ColorPicker from "./elements/addons/ColorPicker";

// Parsers //
const renderAddons = (addons?: AddonsArray[]) => {
  if (!addons || addons.length === 0) return null;
  return (
    <AddonContainer className="absolute inset-0 pointer-events-none">
      {addons.map((addon, idx) => {
        switch (addon.type) {
          case "KeyPicker":
            return (
              <KeyPicker
                key={idx}
                defaultValue={addon.value}
                className="pointer-events-auto"
              />
            );

          case "ColorPicker":
            return (
              <ColorPicker
                key={idx}
                title={addon.title}
                defaultValue={addon.value}
                className="pointer-events-auto"
              />
            );

          default:
            return null;
        }
      })}
    </AddonContainer>
  );
};

export const ElementParser: React.FC<{
  element: UIElement;
  stateKeyPrefix?: string;
}> = ({ element, stateKeyPrefix }) => {
  if ("visible" in element && !element.visible) return null;

  const scope = stateKeyPrefix || "global";
  let addonsForElement: AddonsArray[] | undefined = undefined;

  switch (element.type) {
    case "Toggle":
      addonsForElement = element.properties?.addons;
      break;

    case "Label":
      addonsForElement = element.properties?.addons;
      break;

    default:
      addonsForElement = undefined;
      break;
  }

  const core = (() => {
    switch (element.type) {
      case "Toggle":
        return (
          <Toggle
            text={element.text}
            risky={element.properties.risky}
            checked={element.value}
            stateKey={`${scope}:el:Toggle:${element.index}`}
          />
        );

      case "Label":
        return <Label>{element.text}</Label>;

      case "Button":
        return <Button text={element.text} subButton={element.subButton} />;

      case "Dropdown":
        return (
          <Dropdown
            text={element.text}
            value={element.value}
            options={element.properties.values}
            multi={(element.multi ?? element.properties.multi) === true}
            disabledValues={element.properties.disabledValues || []}
            stateKey={`${scope}:el:Dropdown:${element.index}`}
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
            stateKey={`${scope}:el:Slider:${element.index}`}
          />
        );

      case "Input":
        return (
          <Input
            text={element.text}
            value={element.value}
            placeholder={element.properties.placeholder}
            stateKey={`${scope}:el:Input:${element.index}`}
          />
        );

      case "Divider":
        return <Divider />;

      case "Image":
        return (
          <ObsidianImage
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
        return (
          <div className="text-red-400 text-left">
            Unknown element type:{" "}
            {(element as { type: string }).type || "Unknown"}
          </div>
        );
    }
  })();

  return (
    <div className="relative">
      {core}
      {renderAddons(addonsForElement)}
    </div>
  );
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
          Object.values(groupboxes.Left)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((gb) => (
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
          Object.values(groupboxes.Right)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((gb) => (
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
