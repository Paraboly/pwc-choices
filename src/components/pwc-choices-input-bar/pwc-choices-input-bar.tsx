import { Component, Prop, h, Listen, Event, EventEmitter } from "@stencil/core";
import _ from "lodash";
import { IOption } from "../pwc-choices/IOption";
import { IOptionDiscardedEventPayload } from "./IOptionDiscardedEventPayload";
import { IInputBarClickedEventPayload } from "./IInputBarClickedEventPayload";
import { IOptionBubbleCloseClickedEventPayload } from "../pwc-choices-option-bubble/IOptionBubbleCloseClickedEventPayload";

@Component({
  tag: "pwc-choices-input-bar",
  styleUrl: "pwc-choices-input-bar.scss",
  shadow: false
})
export class PwcChoicesInputBar {
  @Prop() type: "single" | "multi" = "multi";
  @Prop() options: IOption[];
  @Prop() showCloseButtons: boolean;
  @Prop() placeholder: string;
  @Prop() autoHidePlaceholder: boolean;

  @Event() optionDiscarded: EventEmitter<IOptionDiscardedEventPayload>;

  @Event() inputBarClicked: EventEmitter<IInputBarClickedEventPayload>;

  @Listen("closeClicked")
  optionBubbleCloseClickedHandler(
    event: CustomEvent<IOptionBubbleCloseClickedEventPayload>
  ) {
    this.optionDiscarded.emit({
      originalEvent: event,
      option: event.detail.option,
      index: event.detail.index
    });
  }

  @Listen("click")
  onInputBarClick(e: MouseEvent): void {
    this.inputBarClicked.emit({ originalEvent: e });
  }

  constructSelectedOptions() {
    return this.options.map((option, index) => (
      <pwc-choices-option-bubble
        option={option}
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
          id="pwc-choices___placeholder-bubble"
          option={{ value: "placeholder", label: this.placeholder }}
          showCloseButton={false}
          indexInSelectedList={-1}
        ></pwc-choices-option-bubble>
      )
    );
  }

  constructMainRender() {
    switch (this.type) {
      case "single":
        return this.options && this.options.length > 0 ? (
          <div class="pwc-choices___single-select-input-bar-item">
            {this.options[0].label}
          </div>
        ) : (
          <div class="pwc-choices___single-select-input-bar-item pwc-choices___single-select-input-bar-placeholder">
            {this.placeholder}
          </div>
        );
      case "multi":
        return [this.constructSelectedOptions(), this.constructPlaceholder()];
    }
  }

  render() {
    return [
      <div class="pwc-choices___input-bar-main">
        {this.constructMainRender()}
      </div>,
      <div class="pwc-choices___input-bar-dropdown-icon">
        <svg width="28" height="28" viewBox="0 0 18 18">
          <path d="M5 8l4 4 4-4z" />
        </svg>
      </div>
    ];
  }
}
