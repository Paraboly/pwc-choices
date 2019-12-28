import {
  Component,
  Prop,
  h,
  State,
  Watch,
  Listen,
  Method
} from "@stencil/core";
import { PwcChoices2 } from "../../utils/PwcChoices2";
import { resolveJson } from "../../utils/utils";
import _ from "lodash";

@Component({
  tag: "pwc-choices-2",
  styleUrl: "../styles.scss",
  shadow: true
})
export class PwcChoices2Component {
  @Prop() type: "single" | "multi" = "multi";

  private resolvedOptions: PwcChoices2.IOption[];
  @Prop() options: PwcChoices2.IOption[] | string;
  @Watch("options")
  optionsWatchHandler(newValue: PwcChoices2.IOption[] | string) {
    this.resolvedOptions = resolveJson(newValue);
  }

  @Prop() dropdownIsOpen: boolean = false;
  @Prop() placeholder: string;

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
   * If not undefined, this will be displayed in dropdown instead of the default text when there are no options left to choose.
   */
  @Prop() noOptionsString: string = "No options to choose from.";

  @State() selectedOptions: PwcChoices2.IOption[] = [];

  @Method()
  async getSelectedOptions(mode: "option" | "value" | "label" = "option") {
    switch (mode) {
      case "option":
        return this.selectedOptions;

      case "value":
        return this.selectedOptions.map(o => o.value);

      case "option":
        return this.selectedOptions.map(o => o.label);

      default:
        throw new Error(
          `mode value of "${mode}" is invalid. valid values are: "option", "value", "label"`
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
  inputBarClickedHandler(
    event: CustomEvent<PwcChoices2.IInputBarClickedEventPayload>
  ) {
    this.dropdownIsOpen = !this.dropdownIsOpen;
  }

  @Listen("dropdownOptionClicked")
  dropdownOptionClickedHandler(
    event: CustomEvent<PwcChoices2.IDropdownOptionClickedEventPayload>
  ) {
    this.selectedOptions = [...this.selectedOptions, event.detail.option];
  }

  componentWillLoad() {
    this.optionsWatchHandler(this.options);
  }

  render() {
    return (
      <div class="container">
        {this.constructInputBar()}
        {this.dropdownIsOpen && this.constructDropdown()}
      </div>
    );
  }

  constructInputBar() {
    return (
      <pwc-choices-2-input-bar
        options={this.selectedOptions}
        showCloseButtons={this.showCloseButtons}
        placeholder={this.placeholder}
        autoHidePlaceholder={this.autoHidePlaceholder}
      ></pwc-choices-2-input-bar>
    );
  }

  constructDropdown() {
    const dropdownOptions: PwcChoices2.IOption[] = this.uniqueSelections
      ? _.difference(this.resolvedOptions, this.selectedOptions)
      : this.resolvedOptions;

    return (
      <pwc-choices-2-dropdown
        noOptionsString={this.noOptionsString}
        options={dropdownOptions}
      ></pwc-choices-2-dropdown>
    );
  }
}
