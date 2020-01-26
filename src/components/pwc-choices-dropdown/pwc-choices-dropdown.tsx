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
import _ from "lodash";
import fuzzy, { FilterResult } from "fuzzy";
import { IOption } from "../pwc-choices/IOption";
import { IDropdownOptionClickedEventPayload } from "./IDropdownOptionClickedEventPayload";

@Component({
  tag: "pwc-choices-dropdown",
  styleUrl: "pwc-choices-dropdown.scss",
  shadow: false
})
export class PwcChoicesDropdown {
  @Element() root: HTMLPwcChoicesDropdownElement;

  @Prop() options: IOption[];
  @Watch("options")
  optionsWatchHandler(newValue: IOption[]) {
    this.filteredOptions = this.doFilter(this.getWholeSearchInput(), newValue);
  }

  @Prop() noOptionsString: string;

  @Event() dropdownOptionClicked: EventEmitter<
    IDropdownOptionClickedEventPayload
  >;

  @State() filteredOptions: FilterResult<IOption>[];

  componentWillLoad() {
    this.filteredOptions = this.convertOptionsToFilterResultsAsIs(this.options);
  }

  constructDropdown() {
    return [
      <input
        type="text"
        class="search"
        placeholder="Search by typing..."
        onInput={e => this.onSearchInput(e)}
      ></input>,
      <ul>
        {this.filteredOptions && this.filteredOptions.length === 0 ? (
          <li id="noOptionsListItem"> {this.noOptionsString}</li>
        ) : (
          this.filteredOptions.map(option =>
            this.constructDropdownOption(option)
          )
        )}
      </ul>
    ];
  }

  doFilter(phrase: string, rawOptions: IOption[]): FilterResult<IOption>[] {
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

  constructDropdownOption(option: FilterResult<IOption>): any {
    return (
      <li onClick={e => this.onDropdownOptionClick(option, e)}>
        <span innerHTML={option.string}></span>
      </li>
    );
  }

  onDropdownOptionClick(
    optionFilterResult: FilterResult<IOption>,
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

  convertOptionsToFilterResultsAsIs(rawOptions: IOption[]) {
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
