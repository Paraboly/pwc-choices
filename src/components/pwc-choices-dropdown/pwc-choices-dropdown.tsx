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
  searchRef: HTMLInputElement;

  @Element() root: HTMLPwcChoicesDropdownElement;

  @Prop() options: IOption[];
  @Watch("options")
  optionsWatchHandler(newValue: IOption[]) {
    this.filteredOptions = this.doFilter(this.searchRef.value, newValue);
  }

  @Prop() noOptionsString: string;

  @Prop() searchBarPlaceholder: string;

  @Event() dropdownOptionClicked: EventEmitter<
    IDropdownOptionClickedEventPayload
  >;

  @State() filteredOptions: FilterResult<IOption>[];

  componentWillLoad() {
    this.filteredOptions = this.convertOptionsToFilterResultsAsIs(this.options);
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

  onSearchInput(): void {
    this.filteredOptions = this.doFilter(this.searchRef.value, this.options);
  }

  onDropdownOptionClick(
    optionFilterResult: FilterResult<IOption>,
    clickEvent: MouseEvent
  ): void {
    const originalOption = optionFilterResult.original;
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
    return rawOptions.map((o, i) => {
      return {
        string: o.label,
        score: 0,
        index: i,
        original: o
      };
    });
  }

  constructDropdownOption(option: FilterResult<IOption>) {
    return (
      <li onClick={this.onDropdownOptionClick.bind(this, option)}>
        <span innerHTML={option.string}></span>
      </li>
    );
  }

  render() {
    return [
      <input
        type="text"
        class="pwc-choices___search"
        placeholder={this.searchBarPlaceholder || "Search by typing..."}
        ref={elm => (this.searchRef = elm)}
        onInput={this.onSearchInput.bind(this)}
      ></input>,
      <ul>
        {this.filteredOptions &&
          (this.filteredOptions.length === 0 ? (
            <li id="pwc-choices___no-options-list-item">
              {" "}
              {this.noOptionsString}
            </li>
          ) : (
            this.filteredOptions.map(option =>
              this.constructDropdownOption(option)
            )
          ))}
      </ul>
    ];
  }
}
