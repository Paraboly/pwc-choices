import { IOption } from "../pwc-choices/IOption";
export interface IDropdownOptionClickedEventPayload {
  originalEvent: MouseEvent;
  option: IOption;
}
