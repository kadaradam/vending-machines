import { ObjectNumberOnly } from "@vending/types";

export const sumObjectsByKey = (...objs: ObjectNumberOnly[]) => {
  return objs.reduce((a, b) => {
    for (const k in b) {
      if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
};
