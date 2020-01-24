export function throwTypeLiteralNotSupported<T>(
  name: string,
  value: T,
  allValues: readonly T[]
) {
  throw new Error(`${name} value of "${value}" is invalid. 
    valid values are: ${allValues.join(", ")}`);
}
