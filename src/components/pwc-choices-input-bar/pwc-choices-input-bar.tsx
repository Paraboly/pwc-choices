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
import { HTMLStencilElement } from "../../../dist/types/stencil.core";

@Component({
  tag: "pwc-choices-input-bar",
  styleUrl: "pwc-choices-input-bar.scss",
  shadow: false
})
export class PwcChoicesInputBar {
  private isOverflowing: boolean = false;
  private isCalculating = true;

  @Element() root: HTMLStencilElement;

  @Prop() type: "single" | "multi" = "multi";
  @Prop() options: IOption[];
  @Watch("options")
  optionsWatchHandler() {
    if (this.displayMode === "dynamic") {
      this.isCalculating = true;
    }
  }

  @Prop() showCloseButtons: boolean;
  @Prop() placeholder: string;
  @Prop() autoHidePlaceholder: boolean;
  @Prop() displayMode: "countOnly" | "fixed" | "dynamic" | "grow";

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

  componentWillRender() {
    if (this.displayMode === "dynamic") {
      if (this.isCalculating) {
        if (!this.root.hasAttribute("calculating")) {
          this.root.setAttribute("calculating", "");
          this.root.forceUpdate();
        }
      }
    }
  }

  render() {
    let toReturn: any;
    const shouldCollapse = this.isCalculating
      ? false
      : this.displayMode !== "grow" && this.isOverflowing;

    if (this.displayMode === "countOnly" || shouldCollapse) {
      toReturn = this.counstructCount();
    } else {
      toReturn = this.constructBubbles();
    }
    return toReturn;
  }

  componentDidRender() {
    if (this.displayMode === "dynamic") {
      if (this.isCalculating) {
        this.isOverflowing = checkOverflow(this.root);
        this.isCalculating = false;
        this.root.forceUpdate();
      } else {
        if (this.root.hasAttribute("calculating")) {
          this.root.removeAttribute("calculating");
          this.root.forceUpdate();
        }
      }
    }
  }
}
