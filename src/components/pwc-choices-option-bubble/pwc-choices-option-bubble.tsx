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
import _ from "lodash";
import { constructIcon } from "../../utils/constructIcon";

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
    this.closeClicked.emit({
      originalEvent: event,
      option: this.option,
      bubbleElement: this.rootElement,
      index: this.indexInSelectedList
    });
  }

  render() {
    const { displayIcon, iconElm } = constructIcon(
      this.displayIcon,
      this.option.icon
    );

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
