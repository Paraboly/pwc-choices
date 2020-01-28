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
  form: HTMLFormElement;

  @Element() root: HTMLPwcChoicesElement;

  /**
   * HTML name attribute. This is implemented for compatibility with HTML forms, it has no internal usage.
   */
  @Prop() name: string;

  /**
   * The selection behaviour.
   * "multi" allows selection of multiple options.
   * "single" allows selection of only a single option (just like the native HTML select element).
   */
  @Prop() type: Type = "multi";
  @Watch("type")
  typeWatchHandler(newValue: Type) {
    if (!AllTypeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported("type", newValue, AllTypeLiterals);
    }
  }

  /**
   * The options available to this component. An option must have a label and a value property.
   */
  @Prop() options: IOption[] | string;
  @Watch("options")
  optionsWatchHandler(newValue: IOption[] | string) {
    this.resolvedOptions = distinctFilter(
      resolveJson(newValue),
      this.distinctMode
    );
  }
  private resolvedOptions: IOption[];

  /**
   * This will be displayed in the input bar after the selected options.
   */
  @Prop() placeholder: string;

  /**
   * If true, the placeholder will be hidden if there are selected options.
   */
  @Prop() autoHidePlaceholder: boolean = true;

  /**
   * This determines wheter the dropdown is open or not.
   */
  @Prop({ mutable: true, reflect: true }) dropdownIsOpen: boolean = false;

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
   * "none" disables the distinct filtering behaviour.
   */
  @Prop() distinctMode: DistinctMode = "none";
  @Watch("distinctMode")
  distinctModeWatchHandler(newValue: DistinctMode) {
    if (!AllDistinctModeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported(
        "distinctMode",
        newValue,
        AllDistinctModeLiterals
      );
    }
  }

  /**
   * This is raised when the selected options change.
   */
  @Event() selectedOptionsChanged: EventEmitter<IOption[]>;

  private changeWasDueToFormReset: boolean = false;
  @State() selectedOptions: IOption[] = [];
  @Watch("selectedOptions")
  selectedOptionsWatchHandler(newValue: IOption[]) {
    if (!this.changeWasDueToFormReset) {
      this.selectedOptionsChanged.emit(newValue);
    }
    this.changeWasDueToFormReset = false;
  }

  /**
   * Returns the values of currently selected options.
   */
  @Method()
  async getSelectedOptionsAsValues(): Promise<string[]> {
    return this.selectedOptions.map(o => o.value);
  }

  /**
   * Returns the labels of currently selected options.
   */
  @Method()
  async getSelectedOptionsAsLabels(): Promise<string[]> {
    return this.selectedOptions.map(o => o.label);
  }

  /**
   * Returns the selected options as objects (as passed in to this component).
   */
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
    this.changeWasDueToFormReset = true;
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
