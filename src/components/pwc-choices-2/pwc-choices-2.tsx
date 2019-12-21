import { Component, Prop, h, State, Watch } from "@stencil/core";
import { PwcChoices2 } from "../../utils/PwcChoices2";
import { resolveJson } from "../../utils/utils";

@Component({
  tag: "pwc-choices-2",
  styleUrl: "pwc-choices-2.scss",
  shadow: true
})
export class PwcChoices2Component {
  @Prop() type: "single" | "multi";

  @State() resolvedOptions: PwcChoices2.Option[];
  @Prop() options: PwcChoices2.Option[] | string;
  @Watch("options")
  watchHandler(newValue: PwcChoices2.Option[] | string) {
    this.resolvedOptions = resolveJson(newValue);
  }

  @State() isDropDownOpen: boolean = false;

  render() {
    return (
      <div>
        {this.generateInputBar()}
        {this.isDropDownOpen && this.generateDropdown()}
      </div>
    );
  }

  generateInputBar() {
    return (
      <div class="input-bar" onClick={e => this.onInputBarClick(e)}>
        Input Bar
      </div>
    );
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

  generateOption(option: PwcChoices2.Option): any {
    return <li onClick={e => this.onOptionClick(option, e)}>{option.label}</li>;
  }

  onOptionClick(option: PwcChoices2.Option, clickEvent: MouseEvent): void {
    clickEvent.preventDefault();
    console.log("option clicked");
    console.log(option);
  }
}
