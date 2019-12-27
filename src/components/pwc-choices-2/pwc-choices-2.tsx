import { Component, Prop, h, State, Watch, Listen } from "@stencil/core";
import { PwcChoices2 } from "../../utils/PwcChoices2";
import { resolveJson } from "../../utils/utils";
import _ from "lodash";

@Component({
  tag: "pwc-choices-2",
  styleUrl: "../styles.scss",
  shadow: true
})
export class PwcChoices2Component {
  @Prop() type: "single" | "multi";

  @State() resolvedOptions: PwcChoices2.IOption[];
  @Prop() options: PwcChoices2.IOption[] | string;
  @Watch("options")
  optionsWatchHandler(newValue: PwcChoices2.IOption[] | string) {
    this.resolvedOptions = resolveJson(newValue);
    console.log(this.resolvedOptions);
  }

  @Prop() isDropDownOpen: boolean = false;
  @Prop() currentSelectedOptions: PwcChoices2.IOption[];
  @Prop() placeholder: string;
  @Prop() autoHidePlaceholder: boolean;

  @Listen("closeClicked")
  optionBubbleCloseClickedHandler(
    event: CustomEvent<PwcChoices2.IOptionBubbleCloseClickedEventPayload>
  ) {
    const payload = event.detail;
    console.log("closeClicked");
    console.log(payload);

    const newSelectedItems = [...this.currentSelectedOptions];
    newSelectedItems.splice(payload.index, 1);

    this.currentSelectedOptions = newSelectedItems;
  }

  componentWillLoad() {
    this.optionsWatchHandler(this.options);
    this.currentSelectedOptions = [];
  }

  render() {
    return (
      <div class="container">
        {this.generateInputBar()}
        {this.isDropDownOpen && this.generateDropdown()}
      </div>
    );
  }

  generateInputBar() {
    return (
      <div class="input-bar" onClick={e => this.onInputBarClick(e)}>
        {this.generateSelectedOptions()}
        {this.generatePlaceholder()}
      </div>
    );
  }
  generatePlaceholder() {
    const selectedItemCount = this.currentSelectedOptions.length;
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

  generateSelectedOptions() {
    return this.currentSelectedOptions.map((selectedOption, index) => (
      <pwc-choices-2-option-bubble
        option={selectedOption}
        showCloseButton={true}
        indexInSelectedList={index}
      ></pwc-choices-2-option-bubble>
    ));
  }

  onInputBarClick(e: MouseEvent): void {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  generateDropdown() {
    return (
      <div class="dropdown">
        <ul>
          {this.resolvedOptions &&
            this.resolvedOptions.map(option => this.generateOption(option))}
        </ul>
      </div>
    );
  }

  generateOption(option: PwcChoices2.IOption): any {
    return <li onClick={e => this.onOptionClick(option, e)}>{option.label}</li>;
  }

  onOptionClick(option: PwcChoices2.IOption, clickEvent: MouseEvent): void {
    console.log("option clicked");
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    console.log(option);
    this.currentSelectedOptions = [...this.currentSelectedOptions, option];
  }
}
