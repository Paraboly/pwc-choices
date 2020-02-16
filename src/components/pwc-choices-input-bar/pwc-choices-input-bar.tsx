import {
  Component,
  Prop,
  h,
  Listen,
  Event,
  EventEmitter,
  Element,
  State,
  Watch
} from "@stencil/core";
import _ from "lodash";
import { IOption } from "../pwc-choices/IOption";
import { IOptionDiscardedEventPayload } from "./IOptionDiscardedEventPayload";
import { IInputBarClickedEventPayload } from "./IInputBarClickedEventPayload";
import { IOptionBubbleCloseClickedEventPayload } from "../pwc-choices-option-bubble/IOptionBubbleCloseClickedEventPayload";
import { IIconOptions } from "../pwc-choices/IconOptions";
import { checkOverflow } from "../../utils/checkOverflow";

@Component({
  tag: "pwc-choices-input-bar",
  styleUrl: "pwc-choices-input-bar.scss",
  shadow: false
})
export class PwcChoicesInputBar {
  @Element() root: HTMLElement;

  @Prop() type: "single" | "multi" = "multi";
  @Prop() options: IOption[];
  @Watch("options")
  optionsWatchHandler(newVal: IOption[], oldVal: IOption[]) {
    // The content can only fit again if the operation was the deletion of an option.
    const wasDeletion = newVal.length < oldVal.length;
    if (wasDeletion) {
      // reset to check the overflow again in the upcoming render cycle.
      this.isOverflowing = false;
    }
  }

  @Prop() showCloseButtons: boolean;
  @Prop() placeholder: string;
  @Prop() autoHidePlaceholder: boolean;
  @Prop() displayMode: "countOnly" | "fixed" | "dynamic" | "grow";

  @State() isOverflowing: boolean = false;

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

  constructMainRender() {
    switch (this.type) {
      case "single":
        const { displayIcon, iconElm } = this.constructIcon(
          this.options[0].icon
        );
        return this.options && this.options.length > 0 ? (
          <div class="pwc-choices___single-select-input-bar-item">
            {displayIcon && iconElm}
            <span>{this.options[0].label}</span>
          </div>
        ) : (
          <div class="pwc-choices___single-select-input-bar-item pwc-choices___single-select-input-bar-placeholder">
            <span>{this.placeholder}</span>
          </div>
        );
      case "multi":
        return this.constructMultiSelecMainRender();
    }
  }

  constructMultiSelecMainRender() {
    return [this.constructSelectedOptions(), this.constructPlaceholder()];
  }

  constructBubbles() {
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

  counstructCount() {
    return [
      <div class="pwc-choices___input-bar-main">
        {"Selected " + this.options.length + " options."}
      </div>,
      <div class="pwc-choices___input-bar-dropdown-icon">
        <svg width="28" height="28" viewBox="0 0 18 18">
          <path d="M5 8l4 4 4-4z" />
        </svg>
      </div>
    ];
  }

  render() {
    const shouldCollapse = this.displayMode !== "grow" && this.isOverflowing;
    if (this.displayMode === "countOnly" || shouldCollapse) {
      return this.counstructCount();
    } else {
      return this.constructBubbles();
    }
  }

  componentDidRender() {
    // if we decided that it was overflowing before, then it is still overflowing.
    this.isOverflowing = this.isOverflowing || checkOverflow(this.root);
  }
}
