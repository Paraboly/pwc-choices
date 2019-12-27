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
}
