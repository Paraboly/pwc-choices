import { FilterResult } from "fuzzy";
import { IOption } from "../pwc-choices/IOption";

export interface IDropdownItemClickedEventPayload {
  originalEvent: MouseEvent;
  option: FilterResult<IOption>;
}
