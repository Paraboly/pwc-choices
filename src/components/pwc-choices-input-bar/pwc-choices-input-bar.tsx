import { Component, Prop, h, Listen, Event, EventEmitter } from "@stencil/core";
import { PwcChoices } from "../../interfaces/PwcChoices";
import _ from "lodash";

@Component({
  tag: "pwc-choices-input-bar",
  styleUrl: "../styles.scss",
  shadow: false
})
export class PwcChoicesInputBarComponent {
  @Prop() type: "single" | "multi" = "multi";
  @Prop() options: PwcChoices.IOption[];
  @Prop() showCloseButtons: boolean;
  @Prop() placeholder: string;
  @Prop() autoHidePlaceholder: boolean;

  @Event() optionDiscarded: EventEmitter<
    PwcChoices.IOptionDiscardedEventPayload
  >;

  @Event() inputBarClicked: EventEmitter<
    PwcChoices.IInputBarClickedEventPayload
  >;

  @Listen("closeClicked")
  optionBubbleCloseClickedHandler(
    event: CustomEvent<PwcChoices.IOptionBubbleCloseClickedEventPayload>
  ) {
    this.optionDiscarded.emit({
      originalEvent: event,
      option: event.detail.option,
      index: event.detail.index
    });
  }

  constructInputBar() {
    let inputBarMainRender;

    switch (this.type) {
      case "single":
        inputBarMainRender =
          this.options && this.options.length > 0 ? (
            <div class="singleSelectInputBarItem">{this.options[0].label}</div>
          ) : (
            <div class="singleSelectInputBarItem singleSelectInputBarPlaceholder">
              {this.placeholder}
            </div>
          );
        break;
      case "multi":
        inputBarMainRender = [
          this.constructSelectedOptions(),
          this.constructPlaceholder()
        ];
        break;
    }

    return (
      <div class="input-bar" onClick={e => this.onInputBarClick(e)}>
        <div class="input-bar-main">{inputBarMainRender}</div>
        <div class="input-bar-dropdown-icon">
          <svg width="28" height="28" viewBox="0 0 18 18">
            <path d="M5 8l4 4 4-4z" />
          </svg>
        </div>
      </div>
    );
  }

  constructSelectedOptions() {
    return this.options.map((selectedOption, index) => (
      <pwc-choices-option-bubble
        option={selectedOption}
        showCloseButton={this.showCloseButtons}
        indexInSelectedList={index}
      ></pwc-choices-option-bubble>
    ));
  }

  constructPlaceholder() {
    const selectedItemCount = this.options.length;
    const shouldDisplay =
      this.placeholder && !(this.autoHidePlaceholder && selectedItemCount > 0);

    return (
      shouldDisplay && (
        <pwc-choices-option-bubble
          id="placeholderBubble"
          option={{ value: "placeholder", label: this.placeholder }}
          showCloseButton={false}
          indexInSelectedList={-1}
        ></pwc-choices-option-bubble>
      )
    );
  }

  onInputBarClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.inputBarClicked.emit({ originalEvent: e });
  }

  render() {
    return this.constructInputBar();
  }
}
