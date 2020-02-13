import { IIconOptions } from "./IconOptions";

export interface IOption {
  value: string;
  label: string;
  initialSelected?: boolean;
  icon?: IIconOptions;
}
