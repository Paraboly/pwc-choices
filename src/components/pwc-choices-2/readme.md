# pwc-choices-2

<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description                                                                      | Type                  | Default                        |
| --------------------- | ----------------------- | -------------------------------------------------------------------------------- | --------------------- | ------------------------------ |
| `autoHidePlaceholder` | `auto-hide-placeholder` | If true, the placeholder will be hidden if there are selected options.           | `boolean`             | `true`                         |
| `dropdownIsOpen`      | `dropdown-is-open`      |                                                                                  | `boolean`             | `false`                        |
| `noOptionsString`     | `no-options-string`     | This will be displayed in the dropdown when there are no options left to choose. | `string`              | `"No options to choose from."` |
| `options`             | `options`               |                                                                                  | `IOption[] \| string` | `undefined`                    |
| `placeholder`         | `placeholder`           |                                                                                  | `string`              | `undefined`                    |
| `showCloseButtons`    | `show-close-buttons`    | If true, selected option bubbles will have close buttons.                        | `boolean`             | `true`                         |
| `type`                | `type`                  |                                                                                  | `"multi" \| "single"` | `"multi"`                      |
| `uniqueSelections`    | `unique-selections`     | If true, the option will be removed from available options after selection.      | `boolean`             | `true`                         |


## Methods

### `getSelectedOption(mode?: "option" | "value" | "label") => Promise<string | PwcChoices2.IOption>`



#### Returns

Type: `Promise<string | IOption>`



### `getSelectedOptions(mode?: "option" | "value" | "label") => Promise<PwcChoices2.IOption[] | string[]>`



#### Returns

Type: `Promise<IOption[] | string[]>`




## Dependencies

### Depends on

- [pwc-choices-2-input-bar](../pwc-choices-2-input-bar)
- [pwc-choices-2-dropdown](../pwc-choices-2-dropdown)

### Graph
```mermaid
graph TD;
  pwc-choices-2 --> pwc-choices-2-input-bar
  pwc-choices-2 --> pwc-choices-2-dropdown
  pwc-choices-2-input-bar --> pwc-choices-2-option-bubble
  style pwc-choices-2 fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
