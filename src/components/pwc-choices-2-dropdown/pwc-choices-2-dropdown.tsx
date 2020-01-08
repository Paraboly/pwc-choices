import {
  Component,
  Prop,
  h,
  Event,
  EventEmitter,
  Element,
  State
} from "@stencil/core";
import { PwcChoices2 } from "../../utils/PwcChoices2";
import _ from "lodash";
import fuzzy, { FilterResult } from "fuzzy";

@Component({
  tag: "pwc-choices-2-dropdown",
  styleUrl: "../styles.scss",
  shadow: true
})
export class PwcChoices2DropdownComponent {
  @Element() root: HTMLElement;

  @Prop() options: PwcChoices2.IOption[];
  @Prop() noOptionsString: string;

  @Event() dropdownOptionClicked: EventEmitter<
    PwcChoices2.IDropdownOptionClickedEventPayload
  >;

  @State() filteredOptions: Array<FilterResult<PwcChoices2.IOption>>;

  componentWillLoad() {
    this.filteredOptions = this.makeOptionsWholeFilterResult();
  }

  render() {
    return this.constructDropdown();
  }

  constructDropdown() {
    return (
      <div class="dropdown">
        <input
          type="text"
          class="search"
          placeholder="Search by typing..."
          onInput={e => this.onSearchInput(e)}
        ></input>
        <ul>
          {this.filteredOptions && this.filteredOptions.length === 0 ? (
            <li id="noOptionsListItem"> {this.noOptionsString}</li>
          ) : (
            this.filteredOptions.map(option =>
              this.constructDropdownOption(option)
            )
          )}
        </ul>
      </div>
    );
  }

  onSearchInput(e: Event): void {
    e.stopPropagation();
    const wholeSearchInput = this.getWholeSearchInput();

    if (wholeSearchInput.length === 0) {
      this.filteredOptions = this.makeOptionsWholeFilterResult();
      return;
    }

    this.filteredOptions = fuzzy.filter(wholeSearchInput, this.options, {
      pre: "<mark>",
      post: "</mark>",
      extract: el => el.label
    });
  }

  getWholeSearchInput(): string {
    const searchBar = this.root.shadowRoot.querySelector(
      ".search"
    ) as HTMLInputElement;
    return searchBar.value;
  }

  constructDropdownOption(option: FilterResult<PwcChoices2.IOption>): any {
    return (
      <li onClick={e => this.onDropdownOptionClick(option, e)}>
        <span innerHTML={option.string}></span>
      </li>
    );
  }

  onDropdownOptionClick(
    optionFilterResult: FilterResult<PwcChoices2.IOption>,
    clickEvent: MouseEvent
  ): void {
    const originalOption = optionFilterResult.original;

    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    this.dropdownOptionClicked.emit({
      originalEvent: clickEvent,
      option: originalOption
    });

    /* We need to remove them here if we want to keep the
     * dropdown open after a selection. A bit unplesant,
     * but we have to.
     */
    this.options.splice(this.options.indexOf(originalOption), 1);
    this.filteredOptions.splice(
      this.filteredOptions.indexOf(optionFilterResult),
      1
    );
  }

  makeOptionsWholeFilterResult() {
    return this.options.map(o => {
      return {
        string: o.label,
        score: 0,
        index: 0,
        original: o
      };
    });
  }
}
