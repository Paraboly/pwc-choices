import { Component, Prop, h, Listen, Event, EventEmitter } from "@stencil/core";
import { PwcChoices2 } from "../../utils/PwcChoices2";
import _ from "lodash";

@Component({
  tag: "pwc-choices-2-input-bar",
  styleUrl: "../styles.scss",
  shadow: true
})
export class PwcChoices2InputBarComponent {
  @Prop() options: PwcChoices2.IOption[];
  @Prop() showCloseButtons: boolean;
  @Prop() placeholder: string;
  @Prop() autoHidePlaceholder: boolean;

  @Event() optionDiscarded: EventEmitter<
    PwcChoices2.IOptionDiscardedEventPayload
  >;

  @Event() inputBarClicked: EventEmitter<
    PwcChoices2.IInputBarClickedEventPayload
  >;

  @Listen("closeClicked")
  optionBubbleCloseClickedHandler(
    event: CustomEvent<PwcChoices2.IOptionBubbleCloseClickedEventPayload>
  ) {
    this.optionDiscarded.emit({
      originalEvent: event,
      option: event.detail.option,
      index: event.detail.index
    });
  }

  render() {
    return this.constructInputBar();
  }

  constructInputBar() {
    return (
      <div class="input-bar" onClick={e => this.onInputBarClick(e)}>
        <div class="input-bar-main">
          {this.constructSelectedOptions()}
          {this.constructPlaceholder()}
        </div>
        <div class="input-bar-dropdown-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 18 18"
          >
            <path d="M5 8l4 4 4-4z" />
          </svg>
        </div>
      </div>
    );
  }

  constructSelectedOptions() {
    return this.options.map((selectedOption, index) => (
      <pwc-choices-2-option-bubble
        option={selectedOption}
        showCloseButton={this.showCloseButtons}
        indexInSelectedList={index}
      ></pwc-choices-2-option-bubble>
    ));
  }

  constructPlaceholder() {
    const selectedItemCount = this.options.length;
    const shouldDisplay =
      this.placeholder && !(this.autoHidePlaceholder && selectedItemCount > 0);

    return (
      shouldDisplay && (
        <pwc-choices-2-option-bubble
          id="placeholderBubble"
          option={{ value: "placeholder", label: this.placeholder }}
          showCloseButton={false}
          indexInSelectedList={-1}
        ></pwc-choices-2-option-bubble>
      )
    );
  }

  onInputBarClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.inputBarClicked.emit({ originalEvent: e });
  }
}
