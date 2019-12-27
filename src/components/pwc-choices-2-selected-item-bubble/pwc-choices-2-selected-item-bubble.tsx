import {
  Component,
  h,
  Prop,
  EventEmitter,
  Event,
  Element
} from "@stencil/core";
import { PwcChoices2 } from "../../utils/PwcChoices2";

@Component({
  tag: "pwc-choices-2-selected-item-bubble",
  styleUrl: "pwc-choices-2-selected-item-bubble.scss",
  shadow: true
})
export class PwcChoices2SelectedItemBubbleComponent {
  @Element() rootElement: HTMLPwcChoices2SelectedItemBubbleElement;

  @Prop() showCloseButton: boolean;
  @Prop() option: PwcChoices2.IOption;
  @Prop() indexInSelectedList: number;

  @Event() closeClicked: EventEmitter<
    PwcChoices2.ISelectedItemBubbleCloseClickedEventPayload
  >;

  render() {
    return (
      <div>
        <span class="label">{this.option.label}</span>
        {this.showCloseButton && (
          <button class="close-button" onClick={e => this.onCloseClicked(e)}>
            X
          </button>
        )}
      </div>
    );
  }

  onCloseClicked(event: MouseEvent): void {
    console.log("onCloseClicked");
    console.log(this);
    event.preventDefault();
    event.stopPropagation();
    this.closeClicked.emit({
      originalEvent: event,
      option: this.option,
      bubbleElement: this.rootElement,
      index: this.indexInSelectedList
    });
  }
}
