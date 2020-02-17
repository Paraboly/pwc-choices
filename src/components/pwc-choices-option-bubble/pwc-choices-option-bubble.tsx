import {
  Component,
  h,
  Prop,
  EventEmitter,
  Event,
  Element
} from "@stencil/core";
import { IOption } from "../pwc-choices/IOption";
import { IOptionBubbleCloseClickedEventPayload } from "./IOptionBubbleCloseClickedEventPayload";
import { IIconOptions } from "../pwc-choices/IconOptions";
import _ from "lodash";

@Component({
  tag: "pwc-choices-option-bubble",
  styleUrl: "pwc-choices-option-bubble.scss",
  shadow: false
})
export class PwcChoicesOptionBubble {
  @Element() rootElement: HTMLPwcChoicesOptionBubbleElement;

  @Prop() showCloseButton: boolean;
  @Prop() option: IOption;
  @Prop() indexInSelectedList: number;
  @Prop() displayIcon: boolean;

  @Event() closeClicked: EventEmitter<IOptionBubbleCloseClickedEventPayload>;

  onCloseClicked(event: MouseEvent): void {
    // stop propagation so the input bar doesn't pick it up as a click on itself and close the dropdown.
    event.stopPropagation();
    this.closeClicked.emit({
      originalEvent: event,
      option: this.option,
      bubbleElement: this.rootElement,
      index: this.indexInSelectedList
    });
  }

  constructIcon(
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
        displayIcon: this.displayIcon,
        iconElm: <img {...iconOptions} style={iconStyle}></img>
      };
    } else {
      return { displayIcon: false, iconElm: null };
    }
  }

  render() {
    const { displayIcon, iconElm } = this.constructIcon(this.option.icon);

    return [
      displayIcon && iconElm,
      <span class="pwc-choices___bubble-label">{this.option.label}</span>,
      this.showCloseButton && (
        <span
          class="pwc-choices___bubble-close-button"
          onClick={e => this.onCloseClicked(e)}
        >
          <svg width="16" height="16" viewBox="0 0 18 18">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
          </svg>
        </span>
      )
    ];
  }
}
