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
        {this.constructSelectedOptions()}
        {this.constructPlaceholder()}
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
