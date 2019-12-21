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

  render() {
    return (
      <div>
        {this.generateInputBar()}
        {this.generateDropdown()}
      </div>
    );
  }

  generateInputBar() {
    return <div>Input Bar</div>;
  }

  generateDropdown() {
    return <div>Dropdown</div>;
  }
}
