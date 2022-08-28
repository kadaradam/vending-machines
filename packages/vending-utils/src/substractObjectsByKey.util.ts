import { ObjectNumberOnly } from "@vending/types";

export const substractObjectsByKey = (
  from: ObjectNumberOnly,
  to: ObjectNumberOnly
) => {
  return Object.keys(from).reduce(
    (previousValue: ObjectNumberOnly, currentValue) => {
      const coinType = parseInt(currentValue);

      previousValue[coinType] = to[coinType]
        ? from[coinType] - to[coinType]
        : from[coinType];
      return previousValue;
    },
    {}
  );
};
