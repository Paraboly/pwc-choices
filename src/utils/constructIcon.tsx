import { IIconOptions } from "../components/pwc-choices/IconOptions";
import { h } from "@stencil/core";
import _ from "lodash";

export function constructIcon(
  displayIcon: boolean,
  iconOptions: IIconOptions
): { displayIcon: boolean; iconElm: HTMLImageElement } {
  if (iconOptions) {
    iconOptions = _.cloneDeep(iconOptions);

    const iconStyle = {
      width: iconOptions.width,
      height: iconOptions.height
    };
    delete iconOptions.width;
    delete iconOptions.height;

    return {
      displayIcon,
      iconElm: <img {...iconOptions} style={iconStyle}></img>
    };
  } else {
    return { displayIcon: false, iconElm: null };
  }
}
