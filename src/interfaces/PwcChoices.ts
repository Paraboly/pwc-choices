export namespace PwcChoices {
  export const AllDistinctModeLiterals = [
    "value",
    "label",
    "all",
    "any",
    "none"
  ] as const;
  export type DistinctMode = typeof AllDistinctModeLiterals[number];

  export const AllRetreiveModeLiterals = ["option", "value", "label"] as const;
  export type RetreiveMode = typeof AllRetreiveModeLiterals[number];

  export const AllTypeLiterals = ["single", "multi"] as const;
  export type Type = typeof AllTypeLiterals[number];

  export interface IOption {
    value: string;
    label: string;
  }

  export interface IOptionBubbleCloseClickedEventPayload {
    originalEvent: MouseEvent;
    option: IOption;
    bubbleElement: HTMLPwcChoicesOptionBubbleElement;
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
