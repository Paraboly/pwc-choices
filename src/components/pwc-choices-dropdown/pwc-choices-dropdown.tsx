import { Component, Prop, h, Element, State, Watch } from "@stencil/core";
import _ from "lodash";
import fuzzy, { FilterResult } from "fuzzy";
import { IOption } from "../pwc-choices/IOption";

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
  @Prop() selectionBehaviour: "remove" | "toggle" | "accumulate";
  @Prop() selectedOptions: IOption[];
  @Prop() toggleText: string;

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

  render() {
    const noItemOption: FilterResult<IOption> = {
      string: this.noOptionsString,
      score: 0,
      index: 0,
      original: null
    };

    return [
      <input
        type="text"
        class="pwc-choices___search"
        placeholder={this.searchBarPlaceholder || "Search by typing..."}
        ref={elm => (this.searchRef = elm)}
        onInput={this.onSearchInput.bind(this)}
      ></input>,
      <div id="pwc-choices___dropdown-item-container">
        {this.filteredOptions &&
          (this.filteredOptions.length === 0 ? (
            <pwc-choices-dropdown-item
              option={noItemOption}
              isNoOption={true}
              toggleText={this.toggleText}
            ></pwc-choices-dropdown-item>
          ) : (
            this.filteredOptions.map(option => (
              <pwc-choices-dropdown-item
                option={option}
                isNoOption={false}
                selectCount={_.sumBy(this.selectedOptions, so =>
                  so.value === option.original.value ? 1 : 0
                )}
                selectionBehaviour={this.selectionBehaviour}
                toggleText={this.toggleText}
              ></pwc-choices-dropdown-item>
            ))
          ))}
      </div>
    ];
  }
}
