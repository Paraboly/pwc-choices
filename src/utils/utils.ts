import { PwcChoices2 } from "./PwcChoices2";
import _ from "lodash";

export function resolveJson<TReturnType>(
  input: string | TReturnType
): TReturnType {
  return typeof input === "string" ? JSON.parse(input) : input;
}

export function distinctFilter(
  input: PwcChoices2.IOption[],
  mode: PwcChoices2.DistinctMode
): PwcChoices2.IOption[] {
  let output: PwcChoices2.IOption[];

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
      throw new Error(
        `distinctMode value of "${mode}" is invalid. 
        valid values are: ${PwcChoices2.AllDistinctModeLiterals.join(", ")}`
      );
  }

  return output;
}
