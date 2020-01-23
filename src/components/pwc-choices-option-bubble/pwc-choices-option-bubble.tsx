import {
  Component,
  h,
  Prop,
  EventEmitter,
  Event,
  Element
} from "@stencil/core";
import { PwcChoices } from "../../interfaces/PwcChoices";

@Component({
  tag: "pwc-choices-option-bubble",
  styleUrl: "../styles.scss",
  shadow: false
})
export class PwcChoicesOptionBubbleComponent {
  @Element() rootElement: HTMLPwcChoicesOptionBubbleElement;

  @Prop() showCloseButton: boolean;
  @Prop() option: PwcChoices.IOption;
  @Prop() indexInSelectedList: number;

  @Event() closeClicked: EventEmitter<
    PwcChoices.IOptionBubbleCloseClickedEventPayload
  >;

  onCloseClicked(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeClicked.emit({
      originalEvent: event,
      option: this.option,
      bubbleElement: this.rootElement,
      index: this.indexInSelectedList
    });
  }

  render() {
    return (
      <div class="bubble">
        <span class="bubble-label">{this.option.label}</span>
        {this.showCloseButton && (
          <span
            class="bubble-closeButton"
            onClick={e => this.onCloseClicked(e)}
          >
            <svg width="16" height="16" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </span>
        )}
      </div>
    );
  }
}