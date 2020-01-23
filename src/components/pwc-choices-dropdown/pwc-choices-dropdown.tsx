import {
  Component,
  Prop,
  h,
  Event,
  EventEmitter,
  Element,
  State,
  Watch
} from "@stencil/core";
import { PwcChoicesInterfaces } from "../../interfaces/pwc-choices-interfaces";
import _ from "lodash";
import fuzzy, { FilterResult } from "fuzzy";

@Component({
  tag: "pwc-choices-dropdown",
  styleUrl: "../styles.scss",
  shadow: false
})
export class PwcChoicesDropdown {
  @Element() root: HTMLElement;

  @Prop() options: PwcChoicesInterfaces.IOption[];
  @Watch("options")
  optionsWatchHandler(newValue: PwcChoicesInterfaces.IOption[]) {
    this.filteredOptions = this.doFilter(this.getWholeSearchInput(), newValue);
  }

  @Prop() noOptionsString: string;

  @Event() dropdownOptionClicked: EventEmitter<
    PwcChoicesInterfaces.IDropdownOptionClickedEventPayload
  >;

  @State() filteredOptions: FilterResult<PwcChoicesInterfaces.IOption>[];

  componentWillLoad() {
    this.filteredOptions = this.convertOptionsToFilterResultsAsIs(this.options);
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

  doFilter(
    phrase: string,
    rawOptions: PwcChoicesInterfaces.IOption[]
  ): FilterResult<PwcChoicesInterfaces.IOption>[] {
    if (phrase.length === 0) {
      return this.convertOptionsToFilterResultsAsIs(rawOptions);
    }

    return fuzzy.filter(phrase, rawOptions, {
      pre: "<mark>",
      post: "</mark>",
      extract: el => el.label
    });
  }

  onSearchInput(e: Event): void {
    e.stopPropagation();
    this.filteredOptions = this.doFilter(
      this.getWholeSearchInput(),
      this.options
    );
  }

  getWholeSearchInput(): string {
    const searchBar = this.root.querySelector(".search") as HTMLInputElement;
    return searchBar.value;
  }

  constructDropdownOption(
    option: FilterResult<PwcChoicesInterfaces.IOption>
  ): any {
    return (
      <li onClick={e => this.onDropdownOptionClick(option, e)}>
        <span innerHTML={option.string}></span>
      </li>
    );
  }

  onDropdownOptionClick(
    optionFilterResult: FilterResult<PwcChoicesInterfaces.IOption>,
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

  convertOptionsToFilterResultsAsIs(
    rawOptions: PwcChoicesInterfaces.IOption[]
  ) {
    return rawOptions.map(o => {
      return {
        string: o.label,
        score: 0,
        index: 0,
        original: o
      };
    });
  }

  render() {
    return this.constructDropdown();
  }
}
