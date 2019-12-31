export namespace PwcChoices2 {
  export const AllDistinctModeLiterals = [
    "value",
    "label",
    "all",
    "any",
    "none"
  ] as const; // TS 3.4
  export type DistinctMode = typeof AllDistinctModeLiterals[number]; // union type

  export interface IOption {
    value: string;
    label: string;
  }

  export interface IOptionBubbleCloseClickedEventPayload {
    originalEvent: MouseEvent;
    option: IOption;
    bubbleElement: HTMLPwcChoices2OptionBubbleElement;
    index: number;
  }

  export interface IDropdownOptionClickedEventPayload {
    originalEvent: MouseEvent;
    option: IOption;
  }

  export interface IOptionDiscardedEventPayload {
    originalEvent: CustomEvent<IOptionBubbleCloseClickedEventPayload>;
    option: IOption;
    index: number;
  }

  export interface IInputBarClickedEventPayload {
    originalEvent: MouseEvent;
  }
}
