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
import { PwcChoicesInterfaces } from "../../interfaces/PwcChoicesInterfaces";
import {
  resolveJson,
  distinctFilter,
  throwTypeLiteralNotSupported
} from "../../utils/utils";
import _ from "lodash";

@Component({
  tag: "pwc-choices",
  styleUrl: "../styles.scss",
  shadow: false
})
export class PwcChoices {
  @Element() root: HTMLElement;

  @Prop() name: string;

  @Prop() type: PwcChoicesInterfaces.Type = "multi";
  form: HTMLFormElement;
  @Watch("type")
  typeWatchHandler(newValue) {
    if (!PwcChoicesInterfaces.AllTypeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported(
        "type",
        newValue,
        PwcChoicesInterfaces.AllTypeLiterals
      );
    }
  }

  private resolvedOptions: PwcChoicesInterfaces.IOption[];
  @Prop() options: PwcChoicesInterfaces.IOption[] | string;
  @Watch("options")
  optionsWatchHandler(newValue: PwcChoicesInterfaces.IOption[] | string) {
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
  @Prop() distinctMode: PwcChoicesInterfaces.DistinctMode = "none";
  @Watch("distinctMode")
  distinctModeWatchHandler(newValue) {
    if (!PwcChoicesInterfaces.AllDistinctModeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported(
        "distinctMode",
        newValue,
        PwcChoicesInterfaces.AllDistinctModeLiterals
      );
    }
  }

  @Event() selectedOptionsChanged: EventEmitter<PwcChoicesInterfaces.IOption[]>;

  @State() selectedOptions: PwcChoicesInterfaces.IOption[] = [];
  @Watch("selectedOptions")
  selectedOptionsWatchHandler(newValue: PwcChoicesInterfaces.IOption[]) {
    this.selectedOptionsChanged.emit(newValue);
    this.selectedOptions = newValue;
  }

  async getSelectedOptions(
    mode: "option"
  ): Promise<PwcChoicesInterfaces.IOption[]>;
  async getSelectedOptions(mode: "value" | "label"): Promise<string[]>;
  async getSelectedOptions(
    mode: PwcChoicesInterfaces.RetreiveMode
  ): Promise<string[] | PwcChoicesInterfaces.IOption[]>;

  @Method()
  async getSelectedOptions(
    mode: PwcChoicesInterfaces.RetreiveMode = "option"
  ): Promise<string[] | PwcChoicesInterfaces.IOption[]> {
    switch (mode) {
      case "option":
        return this.selectedOptions;

      case "value":
        return this.selectedOptions.map(o => o.value);

      case "label":
        return this.selectedOptions.map(o => o.label);

      default:
        throwTypeLiteralNotSupported(
          "mode",
          mode,
          PwcChoicesInterfaces.AllRetreiveModeLiterals
        );
    }
  }

  @Listen("optionDiscarded")
  optionDiscardedHandler(
    event: CustomEvent<PwcChoicesInterfaces.IOptionDiscardedEventPayload>
  ) {
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
    event: CustomEvent<PwcChoicesInterfaces.IDropdownOptionClickedEventPayload>
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
    return (
      <div class="container">
        {this.constructInputBar()}
        {this.dropdownIsOpen && this.constructDropdown()}
      </div>
    );
  }
}
