import {
  Component,
  Prop,
  h,
  Listen,
  Event,
  EventEmitter,
  Element,
  Watch
} from "@stencil/core";
import _ from "lodash";
import { IOption } from "../pwc-choices/IOption";
import { IOptionDiscardedEventPayload } from "./IOptionDiscardedEventPayload";
import { IInputBarClickedEventPayload } from "./IInputBarClickedEventPayload";
import { IOptionBubbleCloseClickedEventPayload } from "../pwc-choices-option-bubble/IOptionBubbleCloseClickedEventPayload";
import { checkOverflow } from "../../utils/checkOverflow";
import { constructIcon } from "../../utils/constructIcon";

@Component({
  tag: "pwc-choices-input-bar",
  styleUrl: "pwc-choices-input-bar.scss",
  shadow: false
})
export class PwcChoicesInputBar {
  private isOverflowing: boolean = false;
  private isCalculating = true;

  @Element() root: HTMLPwcChoicesInputBarElement;

  @Prop() type: "single" | "multi" = "multi";
  @Prop() options: IOption[];
  @Watch("options")
  optionsWatchHandler() {
    if (this.type === "multi" && this.displayMode === "dynamic") {
      this.isCalculating = true;
    }
  }

  @Prop() showCloseButtons: boolean;
  @Prop() placeholder: string;
  @Prop() autoHidePlaceholder: boolean;
  @Prop() displayMode: "countOnly" | "dynamic" | "bubblesOnly";
  @Prop() displayIcons: boolean;
  @Prop() countTextProvider: (count: number) => string;

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
        displayIcon={this.displayIcons}
      ></pwc-choices-option-bubble>
    ));
  }

  constructPlaceholder() {
    const selectedItemCount = this.options.length;
    const shouldDisplay =
      this.placeholder !== "" &&
      !(this.autoHidePlaceholder && selectedItemCount > 0);

    return (
      shouldDisplay && (
        <pwc-choices-option-bubble
          class="pwc-choices___placeholder-bubble"
          option={{
            value: "placeholder",
            label: this.placeholder || "No options are selected."
          }}
          showCloseButton={false}
          indexInSelectedList={-1}
        ></pwc-choices-option-bubble>
      )
    );
  }

  constructMainRender() {
    switch (this.type) {
      case "single":
        if (this.options && this.options.length > 0) {
          const { displayIcon, iconElm } = constructIcon(
            this.displayIcons,
            this.options[0].icon
          );
          return (
            <div class="pwc-choices___single-select-input-bar-item">
              {displayIcon && iconElm}
              <span>{this.options[0].label}</span>
            </div>
          );
        } else {
          return (
            <div class="pwc-choices___single-select-input-bar-item pwc-choices___single-select-input-bar-placeholder">
              <span>{this.placeholder}</span>
            </div>
          );
        }
      case "multi":
        return this.constructMultiSelecMainRender();
    }
  }

  constructMultiSelecMainRender() {
    return [this.constructSelectedOptions(), this.constructPlaceholder()];
  }

  decideFlexAlignClass() {
    if (this.type === "single") {
      return " pwc-choices___flex-align-main-start pwc-choices___flex-align-cross-center";
    }

    if (this.type === "multi") {
      if (this.isOverflowing) {
        return " pwc-choices___flex-align-main-center pwc-choices___flex-align-cross-center";
      } else {
        return " pwc-choices___flex-align-main-start pwc-choices___flex-align-cross-start";
      }
    }
  }

  constructBubbles() {
    const flexAlignClass = this.decideFlexAlignClass();

    return [
      <div class={"pwc-choices___input-bar-main " + flexAlignClass}>
        {this.constructMainRender()}
      </div>,
      <div class="pwc-choices___input-bar-dropdown-icon">
        <svg width="28" height="28" viewBox="0 0 18 18">
          <path d="M5 8l4 4 4-4z" />
        </svg>
      </div>
    ];
  }

  constructCount() {
    const flexAlignClass = this.decideFlexAlignClass();

    return [
      <div class={"pwc-choices___input-bar-main" + flexAlignClass}>
        <span>
          {this.countTextProvider
            ? this.countTextProvider(this.options.length)
            : `Selected ${this.options.length} options.`}
        </span>
      </div>,
      <div class="pwc-choices___input-bar-dropdown-icon">
        <svg width="28" height="28" viewBox="0 0 18 18">
          <path d="M5 8l4 4 4-4z" />
        </svg>
      </div>
    ];
  }

  componentWillRender() {
    if (this.type === "multi" && this.displayMode === "dynamic") {
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
      : this.displayMode !== "bubblesOnly" && this.isOverflowing;

    if (
      this.type === "multi" &&
      (this.displayMode === "countOnly" || shouldCollapse)
    ) {
      toReturn = this.constructCount();
    } else {
      toReturn = this.constructBubbles();
    }
    return toReturn;
  }

  componentDidRender() {
    if (this.type === "multi" && this.displayMode === "dynamic") {
      if (this.isCalculating) {
        this.isOverflowing = checkOverflow(this.root, true, true);
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
