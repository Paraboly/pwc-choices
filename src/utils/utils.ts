import { PwcChoicesInterfaces } from "../interfaces/pwc-choices-interfaces";
import _ from "lodash";

export function resolveJson<TReturnType>(
  input: string | TReturnType
): TReturnType {
  return typeof input === "string" ? JSON.parse(input) : input;
}

export function distinctFilter(
  input: PwcChoicesInterfaces.IOption[],
  mode: PwcChoicesInterfaces.DistinctMode
): PwcChoicesInterfaces.IOption[] {
  let output: PwcChoicesInterfaces.IOption[];

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
        PwcChoicesInterfaces.AllDistinctModeLiterals
      );
  }

  return output;
}

export function throwTypeLiteralNotSupported<T>(
  name: string,
  value: T,
  allValues: readonly T[]
) {
  throw new Error(
    `${name} value of "${value}" is invalid. 
    valid values are: ${allValues.join(", ")}`
  );
}
