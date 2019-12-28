export namespace PwcChoices2 {
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
