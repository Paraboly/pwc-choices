import {
  Component,
  Prop,
  h,
  State,
  Watch,
  Listen,
  Method,
  Event,
  EventEmitter,
  Element
} from "@stencil/core";
import { resolveJson } from "../../utils/resolveJson";
import { throwTypeLiteralNotSupported } from "../../utils/throwTypeLiteralNotSupported";
import { distinctFilter } from "../../utils/distinctFilter";
import _ from "lodash";
import { Type } from "./Type";
import { AllTypeLiterals } from "./AllTypeLiterals";
import { IOption } from "./IOption";
import { DistinctMode } from "./DistinctMode";
import { AllDistinctModeLiterals } from "./AllDistinctModeLiterals";
import { IOptionDiscardedEventPayload } from "../pwc-choices-input-bar/IOptionDiscardedEventPayload";
import { IDropdownOptionClickedEventPayload } from "../pwc-choices-dropdown/IDropdownOptionClickedEventPayload";

@Component({
  tag: "pwc-choices",
  styleUrl: "pwc-choices.scss",
  shadow: false
})
export class PwcChoices {
  @Element() root: HTMLElement;

  @Prop() name: string;

  @Prop() type: Type = "multi";
  form: HTMLFormElement;
  @Watch("type")
  typeWatchHandler(newValue) {
    if (!AllTypeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported("type", newValue, AllTypeLiterals);
    }
  }

  private resolvedOptions: IOption[];
  @Prop() options: IOption[] | string;
  @Watch("options")
  optionsWatchHandler(newValue: IOption[] | string) {
    this.resolvedOptions = distinctFilter(
      resolveJson(newValue),
      this.distinctMode
    );
  }

  @Prop() placeholder: string;
  @Prop() dropdownIsOpen: boolean = false;

  /**
   * If true, the placeholder will be hidden if there are selected options.
   */
  @Prop() autoHidePlaceholder: boolean = true;

  /**
   * If true, selected option bubbles will have close buttons.
   */
  @Prop() showCloseButtons: boolean = true;

  /**
   * If true, the option will be removed from available options after selection.
   */
  @Prop() uniqueSelections: boolean = true;

  /**
   * This will be displayed in the dropdown when there are no options left to choose.
   */
  @Prop() noOptionsString: string = "No options to choose from.";

  /**
   * This is the mode of filtering we use to make given option objects distinct.
   */
  @Prop() distinctMode: DistinctMode = "none";
  @Watch("distinctMode")
  distinctModeWatchHandler(newValue) {
    if (!AllDistinctModeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported(
        "distinctMode",
        newValue,
        AllDistinctModeLiterals
      );
    }
  }

  @Event() selectedOptionsChanged: EventEmitter<IOption[]>;

  @State() selectedOptions: IOption[] = [];
  @Watch("selectedOptions")
  selectedOptionsWatchHandler(newValue: IOption[]) {
    this.selectedOptionsChanged.emit(newValue);
    this.selectedOptions = newValue;
  }

  @Method()
  async getSelectedOptionsAsValues(): Promise<string[]> {
    return this.selectedOptions.map(o => o.value);
  }

  @Method()
  async getSelectedOptionsAsLabels(): Promise<string[]> {
    return this.selectedOptions.map(o => o.label);
  }

  @Method()
  async getSelectedOptionsAsObjects(): Promise<IOption[]> {
    return this.selectedOptions;
  }

  @Listen("optionDiscarded")
  optionDiscardedHandler(event: CustomEvent<IOptionDiscardedEventPayload>) {
    const payload = event.detail;
    const newSelectedItems = [...this.selectedOptions];
    newSelectedItems.splice(payload.index, 1);
    this.selectedOptions = newSelectedItems;
  }

  @Listen("inputBarClicked")
  inputBarClickedHandler() // event: CustomEvent<PwcChoices.IInputBarClickedEventPayload>
  {
    this.dropdownIsOpen = !this.dropdownIsOpen;
  }

  @Listen("dropdownOptionClicked")
  dropdownOptionClickedHandler(
    event: CustomEvent<IDropdownOptionClickedEventPayload>
  ) {
    switch (this.type) {
      case "multi":
        this.selectedOptions = [...this.selectedOptions, event.detail.option];
        break;
      case "single":
        this.selectedOptions = [event.detail.option];
        this.dropdownIsOpen = false;
        break;
    }
  }

  @Listen("click", {
    target: "window"
  })
  windowClickHandler() {
    this.dropdownIsOpen = false;
  }

  @Listen("click")
  selfClickHandler(event: MouseEvent) {
    // stop propagation so windowClickHandler doesn't capture it.
    event.stopPropagation();
  }

  componentWillLoad() {
    this.optionsWatchHandler(this.options);
    this.typeWatchHandler(this.type);
    this.distinctModeWatchHandler(this.distinctMode);
  }

  componentDidLoad() {
    this.form = this.root.closest("form");

    if (this.form) {
      this.form.addEventListener("reset", this.handleFormReset.bind(this));
    }
  }

  componentDidUnload() {
    if (this.form) {
      this.form.removeEventListener("reset", this.handleFormReset.bind(this));
    }
  }

  handleFormReset() {
    this.selectedOptions = [];
  }

  constructInputBar() {
    return (
      <pwc-choices-input-bar
        options={this.selectedOptions}
        showCloseButtons={this.showCloseButtons}
        placeholder={this.placeholder}
        autoHidePlaceholder={this.autoHidePlaceholder}
        type={this.type}
      ></pwc-choices-input-bar>
    );
  }

  constructDropdown() {
    const dropdownOptions = this.uniqueSelections
      ? _.difference(this.resolvedOptions, this.selectedOptions)
      : this.resolvedOptions;

    return (
      <pwc-choices-dropdown
        noOptionsString={this.noOptionsString}
        options={dropdownOptions}
      ></pwc-choices-dropdown>
    );
  }

  render() {
    return [
      this.constructInputBar(),
      this.dropdownIsOpen && this.constructDropdown()
    ];
  }
}
