export namespace PwcChoices2 {
  export interface IOption {
    value: string;
    label: string;
  }

  export interface ISelectedItemBubbleCloseClickedEventPayload {
    originalEvent: MouseEvent;
    option: IOption;
    bubbleElement: HTMLPwcChoices2SelectedItemBubbleElement;
    index: number;
  }
}
