# pwc-choices

<!-- Auto Generated Below -->


## Properties

| Property     | Attribute      | Description | Type                    | Default     |
| ------------ | -------------- | ----------- | ----------------------- | ----------- |
| `isNoOption` | `is-no-option` |             | `boolean`               | `undefined` |
| `option`     | --             |             | `FilterResult<IOption>` | `undefined` |


## Events

| Event                 | Description | Type                                            |
| --------------------- | ----------- | ----------------------------------------------- |
| `dropdownItemClicked` |             | `CustomEvent<IDropdownItemClickedEventPayload>` |


## Dependencies

### Used by

 - [pwc-choices-dropdown](../pwc-choices-dropdown)

### Graph
```mermaid
graph TD;
  pwc-choices-dropdown --> pwc-choices-dropdown-item
  style pwc-choices-dropdown-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
