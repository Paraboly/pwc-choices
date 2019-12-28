import { Component, Prop, h, Event, EventEmitter } from "@stencil/core";
import { PwcChoices2 } from "../../utils/PwcChoices2";
import _ from "lodash";

@Component({
  tag: "pwc-choices-2-dropdown",
  styleUrl: "../styles.scss",
  shadow: true
})
export class PwcChoices2DropdownComponent {
  @Prop() options: PwcChoices2.IOption[];
  @Prop() noOptionsString: string;

  @Event() dropdownOptionClicked: EventEmitter<
    PwcChoices2.IDropdownOptionClickedEventPayload
  >;

  render() {
    return this.constructDropdown();
  }

  constructDropdown() {
    return (
      <div class="dropdown">
        <ul>
          {this.options && this.options.length === 0 ? (
            <li id="noOptionsListItem"> {this.noOptionsString}</li>
          ) : (
            this.options.map(option => this.constructDropdownOption(option))
          )}
        </ul>
      </div>
    );
  }

  constructDropdownOption(option: PwcChoices2.IOption): any {
    return (
      <li onClick={e => this.onDropdownOptionClick(option, e)}>
        {option.label}
      </li>
    );
  }

  onDropdownOptionClick(
    option: PwcChoices2.IOption,
    clickEvent: MouseEvent
  ): void {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    this.dropdownOptionClicked.emit({
      originalEvent: clickEvent,
      option: option
    });
  }
}
