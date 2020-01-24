import { IOption } from "../pwc-choices/IOption";
import { IOptionBubbleCloseClickedEventPayload } from "../pwc-choices-option-bubble/IOptionBubbleCloseClickedEventPayload";
export interface IOptionDiscardedEventPayload {
  originalEvent: CustomEvent<IOptionBubbleCloseClickedEventPayload>;
  option: IOption;
  index: number;
}
