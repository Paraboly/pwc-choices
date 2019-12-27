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
  @Prop() customNoOptionsString: string;

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

  @Listen("closeClicked")
  optionBubbleCloseClickedHandler(
    event: CustomEvent<PwcChoices2.IOptionBubbleCloseClickedEventPayload>
  ) {
    const payload = event.detail;
    const newSelectedItems = [...this.selectedOptions];
    newSelectedItems.splice(payload.index, 1);
    this.selectedOptions = newSelectedItems;
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
      <div class="input-bar" onClick={e => this.onInputBarClick(e)}>
        {this.constructSelectedOptions()}
        {this.constructPlaceholder()}
      </div>
    );
  }

  constructDropdown() {
    const dropdownOptions: PwcChoices2.IOption[] = this.uniqueSelections
      ? _.difference(this.resolvedOptions, this.selectedOptions)
      : this.resolvedOptions;

    return (
      <div class="dropdown">
        <ul>
          {this.resolvedOptions && dropdownOptions.length === 0 ? (
            <li> {this.customNoOptionsString || "No options to select."}</li>
          ) : (
            dropdownOptions.map(option => this.constructDropdownOption(option))
          )}
        </ul>
      </div>
    );
  }

  constructSelectedOptions() {
    return this.selectedOptions.map((selectedOption, index) => (
      <pwc-choices-2-option-bubble
        option={selectedOption}
        showCloseButton={this.showCloseButtons}
        indexInSelectedList={index}
      ></pwc-choices-2-option-bubble>
    ));
  }

  constructPlaceholder() {
    const selectedItemCount = this.selectedOptions.length;
    const shouldDisplay =
      this.placeholder && !(this.autoHidePlaceholder && selectedItemCount > 0);

    return (
      shouldDisplay && (
        <pwc-choices-2-option-bubble
          option={{ value: "placeholder", label: this.placeholder }}
          showCloseButton={false}
          indexInSelectedList={-1}
        ></pwc-choices-2-option-bubble>
      )
    );
  }

  constructDropdownOption(option: PwcChoices2.IOption): any {
    return (
      <li onClick={e => this.onDropdownOptionClick(option, e)}>
        {option.label}
      </li>
    );
  }

  onInputBarClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dropdownIsOpen = !this.dropdownIsOpen;
  }

  onDropdownOptionClick(
    option: PwcChoices2.IOption,
    clickEvent: MouseEvent
  ): void {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    this.selectedOptions = [...this.selectedOptions, option];
  }
}
