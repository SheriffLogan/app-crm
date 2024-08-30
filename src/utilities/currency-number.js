export const currencyNumber = (
  value,
  options,
) => {
  if (
    typeof Intl === "object" &&
    Intl &&
    typeof Intl.NumberFormat === "function"
  ) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      ...options,
    }).format(value);
  }

  return value.toString();
};
