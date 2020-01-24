import _ from "lodash";
import { IOption } from "../components/pwc-choices/IOption";
import { DistinctMode } from "../components/pwc-choices/DistinctMode";
import { AllDistinctModeLiterals } from "../components/pwc-choices/AllDistinctModeLiterals";
import { throwTypeLiteralNotSupported } from "./throwTypeLiteralNotSupported";

export function distinctFilter(
  input: IOption[],
  mode: DistinctMode
): IOption[] {
  let output: IOption[];
  switch (mode) {
    case "none":
      output = input;
      break;
    case "all":
      output = _.chain(input)
        .uniqBy(a => a.value)
        .uniqBy(a => a.label)
        .value();
      break;
    case "any":
      output = _.uniqWith(
        input,
        (a, b) => a.label === b.label && a.value === b.value
      );
      break;
    case "label":
      output = _.uniqBy(input, a => a.label);
      break;
    case "value":
      output = _.uniqBy(input, a => a.value);
      break;
    default:
      throwTypeLiteralNotSupported(
        "distinctMode",
        mode,
        AllDistinctModeLiterals
      );
  }
  return output;
}
