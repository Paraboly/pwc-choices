import {
  Component,
  Prop,
  h,
  State,
  Watch,
  Listen,
  Method,
  Event,
  EventEmitter
} from "@stencil/core";
import { PwcChoices2 } from "../../interfaces/PwcChoices2";
import {
  resolveJson,
  distinctFilter,
  throwTypeLiteralNotSupported
} from "../../utils/utils";
import _ from "lodash";
import { Mouse } from "puppeteer";

@Component({
  tag: "pwc-choices-2",
  styleUrl: "../styles.scss",
  shadow: true
})
export class PwcChoices2Component {
  @Prop() type: PwcChoices2.Type = "multi";
  @Watch("type")
  typeWatchHandler(newValue) {
    if (!PwcChoices2.AllTypeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported(
        "type",
        newValue,
        PwcChoices2.AllTypeLiterals
      );
    }
  }

  private resolvedOptions: PwcChoices2.IOption[];
  @Prop() options: PwcChoices2.IOption[] | string;
  @Watch("options")
  optionsWatchHandler(newValue: PwcChoices2.IOption[] | string) {
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
  @Prop() distinctMode: PwcChoices2.DistinctMode = "none";
  @Watch("distinctMode")
  distinctModeWatchHandler(newValue) {
    if (!PwcChoices2.AllDistinctModeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported(
        "distinctMode",
        newValue,
        PwcChoices2.AllDistinctModeLiterals
      );
    }
  }

  @Event() selectedOptionsChanged: EventEmitter<PwcChoices2.IOption[]>;

  @State() selectedOptions: PwcChoices2.IOption[] = [];
  @Watch("selectedOptions")
  selectedOptionsWatchHandler(newValue: PwcChoices2.IOption[]) {
    this.selectedOptionsChanged.emit(newValue);
    this.selectedOptions = newValue;
  }

  async getSelectedOptions(mode: "option"): Promise<PwcChoices2.IOption[]>;
  async getSelectedOptions(mode: "value" | "label"): Promise<string[]>;
  async getSelectedOptions(
    mode: PwcChoices2.RetreiveMode
  ): Promise<string[] | PwcChoices2.IOption[]>;

  @Method()
  async getSelectedOptions(
    mode: PwcChoices2.RetreiveMode = "option"
  ): Promise<string[] | PwcChoices2.IOption[]> {
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
          PwcChoices2.AllRetreiveModeLiterals
        );
    }
  }

  @Listen("optionDiscarded")
  optionDiscardedHandler(
    event: CustomEvent<PwcChoices2.IOptionDiscardedEventPayload>
  ) {
    const payload = event.detail;
    const newSelectedItems = [...this.selectedOptions];
    newSelectedItems.splice(payload.index, 1);
    this.selectedOptions = newSelectedItems;
  }

  @Listen("inputBarClicked")
  inputBarClickedHandler() // event: CustomEvent<PwcChoices2.IInputBarClickedEventPayload>
  {
    this.dropdownIsOpen = !this.dropdownIsOpen;
  }

  @Listen("dropdownOptionClicked")
  dropdownOptionClickedHandler(
    event: CustomEvent<PwcChoices2.IDropdownOptionClickedEventPayload>
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

  constructInputBar() {
    return (
      <pwc-choices-2-input-bar
        options={this.selectedOptions}
        showCloseButtons={this.showCloseButtons}
        placeholder={this.placeholder}
        autoHidePlaceholder={this.autoHidePlaceholder}
        type={this.type}
      ></pwc-choices-2-input-bar>
    );
  }

  constructDropdown() {
    const dropdownOptions = this.uniqueSelections
      ? _.difference(this.resolvedOptions, this.selectedOptions)
      : this.resolvedOptions;

    return (
      <pwc-choices-2-dropdown
        noOptionsString={this.noOptionsString}
        options={dropdownOptions}
      ></pwc-choices-2-dropdown>
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
