import { IOption } from "../pwc-choices/IOption";

export interface IOptionBubbleCloseClickedEventPayload {
  originalEvent: MouseEvent;
  option: IOption;
  bubbleElement: HTMLPwcChoicesOptionBubbleElement;
  index: number;
}
