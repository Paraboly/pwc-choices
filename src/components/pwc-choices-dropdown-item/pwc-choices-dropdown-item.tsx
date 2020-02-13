import { Component, Prop, h, EventEmitter, Event, Listen } from "@stencil/core";
import _ from "lodash";
import { FilterResult } from "fuzzy";
import { IOption } from "../pwc-choices/IOption";
import { IIconOptions } from "../pwc-choices/IconOptions";
import { IDropdownItemClickedEventPayload } from "./IDropdownItemClickedEventPayload";

@Component({
  tag: "pwc-choices-dropdown-item",
  styleUrl: "pwc-choices-dropdown-item.scss",
  shadow: false
})
export class PwcChoicesDropdownItem {
  @Prop() option: FilterResult<IOption>;
  @Prop({ reflect: true }) isNoOption: boolean;

  @Event() dropdownItemClicked: EventEmitter<IDropdownItemClickedEventPayload>;

  @Listen("click")
  clickSelfHandler(event) {
    if (!this.isNoOption) {
      this.dropdownItemClicked.emit({
        originalEvent: event,
        option: this.option
      });
    }
  }

  constructIcon(
    iconOptions: IIconOptions
  ): { displayIcon: boolean; iconElm: HTMLImageElement } {
    if (iconOptions) {
      const iconElm = <img {...iconOptions}></img>;
      return { displayIcon: true, iconElm };
    } else {
      return { displayIcon: false, iconElm: null };
    }
  }

  constructDropdownOption(option: FilterResult<IOption>) {
    const { displayIcon, iconElm } = this.isNoOption
      ? { displayIcon: false, iconElm: null }
      : this.constructIcon(option.original.icon);

    return [displayIcon && iconElm, <span innerHTML={option.string}></span>];
  }

  render() {
    return this.constructDropdownOption(this.option);
  }
}
