export const prettyCurrency = (num: number) =>
  (num / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
