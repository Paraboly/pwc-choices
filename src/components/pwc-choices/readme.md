# pwc-choices

<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description                                                                      | Type                                             | Default                        |
| --------------------- | ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------ |
| `autoHidePlaceholder` | `auto-hide-placeholder` | If true, the placeholder will be hidden if there are selected options.           | `boolean`                                        | `true`                         |
| `distinctMode`        | `distinct-mode`         | This is the mode of filtering we use to make given option objects distinct.      | `"all" \| "any" \| "label" \| "none" \| "value"` | `"none"`                       |
| `dropdownIsOpen`      | `dropdown-is-open`      |                                                                                  | `boolean`                                        | `false`                        |
| `name`                | `name`                  |                                                                                  | `string`                                         | `undefined`                    |
| `noOptionsString`     | `no-options-string`     | This will be displayed in the dropdown when there are no options left to choose. | `string`                                         | `"No options to choose from."` |
| `options`             | `options`               |                                                                                  | `IOption[] \| string`                            | `undefined`                    |
| `placeholder`         | `placeholder`           |                                                                                  | `string`                                         | `undefined`                    |
| `showCloseButtons`    | `show-close-buttons`    | If true, selected option bubbles will have close buttons.                        | `boolean`                                        | `true`                         |
| `type`                | `type`                  |                                                                                  | `"multi" \| "single"`                            | `"multi"`                      |
| `uniqueSelections`    | `unique-selections`     | If true, the option will be removed from available options after selection.      | `boolean`                                        | `true`                         |


## Events

| Event                    | Description | Type                     |
| ------------------------ | ----------- | ------------------------ |
| `selectedOptionsChanged` |             | `CustomEvent<IOption[]>` |


## Methods

### `getSelectedOptions(mode?: "value" | "label" | "option") => Promise<PwcChoices.IOption[] | string[]>`



#### Returns

Type: `Promise<IOption[] | string[]>`




## Dependencies

### Depends on

- [pwc-choices-input-bar](../pwc-choices-input-bar)
- [pwc-choices-dropdown](../pwc-choices-dropdown)

### Graph
```mermaid
graph TD;
  pwc-choices --> pwc-choices-input-bar
  pwc-choices --> pwc-choices-dropdown
  pwc-choices-input-bar --> pwc-choices-option-bubble
  style pwc-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
