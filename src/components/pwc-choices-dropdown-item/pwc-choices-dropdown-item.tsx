import {
  Component,
  Prop,
  h,
  EventEmitter,
  Event,
  Listen,
  Element,
  Watch
} from "@stencil/core";
import _ from "lodash";
import { FilterResult } from "fuzzy";
import { IOption } from "../pwc-choices/IOption";
import { IDropdownItemClickedEventPayload } from "./IDropdownItemClickedEventPayload";
import { constructIcon } from "../../utils/constructIcon";

@Component({
  tag: "pwc-choices-dropdown-item",
  styleUrl: "pwc-choices-dropdown-item.scss",
  shadow: false
})
export class PwcChoicesDropdownItem {
  @Element() root: HTMLPwcChoicesDropdownItemElement;

  @Prop() option: FilterResult<IOption>;
  @Prop() selectionBehaviour: "remove" | "toggle" | "accumulate";
  @Prop({ reflect: true }) isNoOption: boolean;
  @Prop() toggleText: string;

  @Prop() selectCount: number;
  @Watch("selectCount")
  selectCountWatchHandler(value) {
    this.active = value > 0;
  }

  @Prop({ reflect: true, mutable: true }) active: boolean;

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

  constructDropdownOption() {
    const { displayIcon, iconElm } = this.isNoOption
      ? { displayIcon: false, iconElm: null }
      : constructIcon(true, this.option.original.icon);

    const indicatorContent =
      (this.selectionBehaviour === "accumulate" && this.selectCount) ||
      (this.selectionBehaviour === "toggle" && this.toggleText) ||
      "";

    return [
      this.selectionBehaviour !== "remove" && (
        <i>{this.selectCount > 0 && indicatorContent}</i>
      ),
      displayIcon && iconElm,
      <span innerHTML={this.option.string}></span>
    ];
  }

  componentWillLoad() {
    this.selectCountWatchHandler(this.selectCount);
  }

  render() {
    return this.constructDropdownOption();
  }
}
