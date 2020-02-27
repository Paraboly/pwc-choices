import {
  Component,
  Prop,
  h,
  State,
  Watch,
  Listen,
  Method,
  Event,
  EventEmitter,
  Element
} from "@stencil/core";
import { resolveJson } from "../../utils/resolveJson";
import { throwTypeLiteralNotSupported } from "../../utils/throwTypeLiteralNotSupported";
import { distinctFilter } from "../../utils/distinctFilter";
import _ from "lodash";
import { Type } from "./Type";
import { AllTypeLiterals } from "./AllTypeLiterals";
import { IOption } from "./IOption";
import { DistinctMode } from "./DistinctMode";
import { AllDistinctModeLiterals } from "./AllDistinctModeLiterals";
import { IOptionDiscardedEventPayload } from "../pwc-choices-input-bar/IOptionDiscardedEventPayload";
import { IDropdownItemClickedEventPayload } from "../pwc-choices-dropdown-item/IDropdownItemClickedEventPayload";
import { createPopper, Instance, Options } from "@popperjs/core";

@Component({
  tag: "pwc-choices",
  styleUrl: "pwc-choices.scss",
  shadow: false
})
export class PwcChoices {
  form: HTMLFormElement;

  @Element() root: HTMLPwcChoicesElement;

  /**
   * HTML name attribute. This is implemented for compatibility with HTML forms, it has no internal usage.
   */
  @Prop() name: string;

  /**
   * The selection behaviour.
   * "multi" allows selection of multiple options.
   * "single" allows selection of only a single option (just like the native HTML select element).
   */
  @Prop() type: Type = "multi";
  @Watch("type")
  typeWatchHandler(newValue: Type) {
    if (!AllTypeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported("type", newValue, AllTypeLiterals);
    }
  }

  /**
   * The options available to this component. An option must have a label and a value property.
   */
  @Prop() options: IOption[] | string;
  @Watch("options")
  optionsWatchHandler(newValue: IOption[] | string) {
    const newOptions = distinctFilter(resolveJson(newValue), this.distinctMode);
    const goneOptions = _.differenceBy(
      this.resolvedOptions,
      newOptions,
      o => o.value
    );

    if (
      this.selectedOptions &&
      this.selectedOptions.length > 0 &&
      this.selectedOptions.some(o =>
        goneOptions.some(go => go.value === o.value)
      )
    ) {
      _.remove(this.selectedOptions, o =>
        goneOptions.some(go => go.value === o.value)
      );
      this.selectedOptions = [...this.selectedOptions];
    }

    this.resolvedOptions = newOptions || [];
  }
  private resolvedOptions: IOption[];

  /**
   * This will appear in the search bar when there is no input.
   */
  @Prop() searchBarPlaceholder: string;

  /**
   * This will be displayed in the input bar after the selected options.
   */
  @Prop() placeholder: string;

  /**
   * If true, the placeholder will be hidden if there are selected options.
   */
  @Prop() autoHidePlaceholder: boolean = true;

  /**
   * This determines wheter the dropdown is open or not.
   */
  @Prop({ mutable: true, reflect: true }) dropdownIsOpen: boolean = false;

  /**
   * If true, selected option bubbles will have close buttons.
   */
  @Prop() showCloseButtons: boolean = true;

  /**
   * This determines what happens to dropdown items after they are selected.
   *
   * * `remove`: remove the selected item from the dropdown.
   * * `toggle`: dropdown items become toggles, that is, they remain in the dropdown and remove themself from the input bar when clicked again.
   * * `accumulate`: a click on a dropdown item is always a select command, and the item always stays in the dropdown.
   *
   * Both `remove` and `toggle` ensures the uniqueness of the selections, while `accumulate` allows for multiple selections of the same option.
   */
  @Prop() dropdownSelectionBehaviour: "remove" | "toggle" | "accumulate" =
    "remove";

  /**
   * This will be displayed in the dropdown when there are no options left to choose.
   */
  @Prop() noOptionsString: string = "No options to choose from.";

  /**
   * This is the mode of filtering we use to make given option objects distinct.
   * "none" disables the distinct filtering behaviour.
   */
  @Prop() distinctMode: DistinctMode = "none";
  @Watch("distinctMode")
  distinctModeWatchHandler(newValue: DistinctMode) {
    if (!AllDistinctModeLiterals.includes(newValue)) {
      throwTypeLiteralNotSupported(
        "distinctMode",
        newValue,
        AllDistinctModeLiterals
      );
    }
  }

  /**
   * If true, option icons will be displayed on the input bar as well.
   */
  @Prop() displayIconsOnInputBar: boolean;

  /**
   * (multi select mode only) Maximum number of option bubbles to display in the input bar.
   *
   * * `countOnly`: display only the selected option count.
   * * `dynamic`: display the option bubbles if they fit. when they overflow, switch to selected option count.
   * * `bubblesOnly`: display only the option bubbles.
   */
  @Prop() inputBarDisplayMode:
    | "countOnly"
    | "dynamic"
    | "bubblesOnly" = `bubblesOnly`;

  /**
   * Use this function to provide the text for the count display. It is invoked with the current selected option count.
   */
  @Prop() countTextProvider: (count: number) => string;

  /**
   * This is the text in the indicator of the options when they are in toggle mode.
   */
  @Prop() dropdownToggleText: string = "\u2713";

  /**
   * The options to pass to the prop.js constructor, which handles the dropdown placement.
   */
  @Prop() popperjsOptionsForDropdown?: Partial<Options>;

  /**
   * This is raised when the selected options change.
   */
  @Event() selectedOptionsChanged: EventEmitter<IOption[]>;

  private doNotEmitChangeEvent: boolean = false;
  @State() selectedOptions: IOption[] = [];
  @Watch("selectedOptions")
  selectedOptionsWatchHandler(newValue: IOption[]) {
    if (!this.doNotEmitChangeEvent) {
      this.selectedOptionsChanged.emit(newValue);
    }
    this.doNotEmitChangeEvent = false;
  }

  /**
   * Select an option by value.
   * @param value The value of the option to select.
   * @param force If false, runs the command through internal selection logic which adheres to config. Otherwise, bypasses all the internal logic and forcefully appends the option to the selected options list.
   */
  @Method()
  async select(value: string, force: boolean = false) {
    const option = _.find(this.resolvedOptions, { value });

    if (force) {
      switch (this.type) {
        case "single":
          this.selectedOptions = [option];
          break;
        case "multi":
          this.selectedOptions = [...this.selectedOptions, option];
          break;
      }
    } else {
      this.selectOption(option);
    }
  }

  /**
   * Deselect an option by value.
   * @param value The value of the option to deselect.
   */
  @Method()
  async deselect(value: string) {
    _.remove(this.selectedOptions, { value });
    this.selectedOptions = [...this.selectedOptions];
  }

  /**
   * Returns the values of currently selected options.
   */
  @Method()
  async getSelectedOptionsAsValues(): Promise<string[]> {
    return this.selectedOptions.map(o => o.value);
  }

  /**
   * Returns the labels of currently selected options.
   */
  @Method()
  async getSelectedOptionsAsLabels(): Promise<string[]> {
    return this.selectedOptions.map(o => o.label);
  }

  /**
   * Returns the selected options as objects (as passed in to this component).
   */
  @Method()
  async getSelectedOptionsAsObjects(): Promise<IOption[]> {
    return this.selectedOptions;
  }

  @Listen("optionDiscarded")
  optionDiscardedHandler(event: CustomEvent<IOptionDiscardedEventPayload>) {
    const payload = event.detail;
    const newSelectedItems = [...this.selectedOptions];
    newSelectedItems.splice(payload.index, 1);
    this.selectedOptions = newSelectedItems;
  }

  @Listen("inputBarClicked")
  inputBarClickedHandler() // event: CustomEvent<PwcChoices.IInputBarClickedEventPayload>
  {
    this.dropdownIsOpen = !this.dropdownIsOpen;
  }

  @Listen("dropdownItemClicked")
  dropdownItemClickedHandler(
    event: CustomEvent<IDropdownItemClickedEventPayload>
  ) {
    const option = event.detail.option.original;

    this.selectOption(option);
  }

  private selectOption(option: IOption) {
    switch (this.type) {
      case "multi":
        switch (this.dropdownSelectionBehaviour) {
          case "accumulate":
          case "remove":
            this.selectedOptions = [...this.selectedOptions, option];
            break;
          case "toggle":
            if (this.selectedOptions.some(o => o.value === option.value)) {
              _.remove(this.selectedOptions, o => o.value === option.value);
              this.selectedOptions = [...this.selectedOptions];
            } else {
              this.selectedOptions = [...this.selectedOptions, option];
            }
            break;
        }
        break;
      case "single":
        this.selectedOptions = [option];
        this.dropdownIsOpen = false;
        break;
    }
  }

  @Listen("click", {
    target: "window"
  })
  windowClickHandler(event: MouseEvent) {
    const eventTarget = event.target as HTMLElement;
    const closestChoicesIsMe = eventTarget.closest("pwc-choices") === this.root;
    if (!closestChoicesIsMe) {
      this.dropdownIsOpen = false;
    }
  }

  @Listen("click")
  selfClickHandler() {
    // stop propagation so windowClickHandler doesn't capture it.
    // event.stopPropagation();
  }

  componentWillLoad() {
    this.selectedOptions = this.selectedOptions || [];
    this.optionsWatchHandler(this.options);
    this.typeWatchHandler(this.type);
    this.distinctModeWatchHandler(this.distinctMode);

    this.doNotEmitChangeEvent = true;
    this.selectInitialSelectedOptions();
  }

  private selectInitialSelectedOptions() {
    const initialSelections = _.filter(
      this.resolvedOptions,
      o => o.initialSelected && o.initialSelected === true
    );
    if (this.type === "single" && initialSelections.length > 1) {
      throw new Error(
        "You have multiple initial selected options, but the type is `single`!"
      );
    }
    this.selectedOptions = [...initialSelections];
  }

  componentDidLoad() {
    this.form = this.root.closest("form");

    if (this.form) {
      this.form.addEventListener("reset", this.handleFormReset.bind(this));
    }
  }

  componentDidUnload() {
    if (this.form) {
      this.form.removeEventListener("reset", this.handleFormReset.bind(this));
    }
  }

  handleFormReset() {
    this.doNotEmitChangeEvent = true;
    this.selectInitialSelectedOptions();
  }

  constructInputBar() {
    return (
      <pwc-choices-input-bar
        options={this.selectedOptions}
        showCloseButtons={this.showCloseButtons}
        placeholder={this.placeholder}
        autoHidePlaceholder={this.autoHidePlaceholder}
        type={this.type}
        displayMode={this.inputBarDisplayMode}
        displayIcons={this.displayIconsOnInputBar}
        countTextProvider={this.countTextProvider}
      ></pwc-choices-input-bar>
    );
  }

  constructDropdown() {
    const dropdownOptions =
      this.dropdownSelectionBehaviour === "remove"
        ? _.differenceBy(
            this.resolvedOptions,
            this.selectedOptions,
            o => o.value
          )
        : this.resolvedOptions;

    return (
      <pwc-choices-dropdown
        noOptionsString={this.noOptionsString}
        options={dropdownOptions}
        searchBarPlaceholder={this.searchBarPlaceholder}
        selectionBehaviour={this.dropdownSelectionBehaviour}
        selectedOptions={this.selectedOptions}
        toggleText={this.dropdownToggleText}
      ></pwc-choices-dropdown>
    );
  }

  private popperInstance: Instance;

  render() {
    return [
      this.constructInputBar(),
      this.dropdownIsOpen && this.constructDropdown()
    ];
  }

  componentDidRender() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }

    const dropdown = this.root.querySelector("pwc-choices-dropdown");
    const inputBar = this.root.querySelector("pwc-choices-input-bar");

    if (dropdown && inputBar) {
      const opts = this.popperjsOptionsForDropdown || {
        placement: "bottom",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 6]
            }
          },
          {
            name: "preventOverflow",
            options: {
              mainAxis: true,
              altAxis: false
            }
          },
          {
            name: "arrow"
          },
          {
            name: "flip",
            options: {
              fallbackPlacements: ["top", "right", "left"]
            }
          }
        ]
      };

      this.popperInstance = createPopper(inputBar, dropdown, opts);
    }
  }
}
