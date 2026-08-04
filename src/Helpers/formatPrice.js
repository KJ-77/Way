// Prices are displayed bare — "200.00", not "$200" — with a single "All prices
// are in USD" note at the bottom of the page carrying the currency. Keeps the
// numbers scannable when a class has several packages side by side.
//
// Returns an em dash for null / non-numeric / non-positive values so a missing
// price never renders as "NaN" or "0.00".
export const formatPrice = (price) => {
  const n = Number(price);
  if (price == null || Number.isNaN(n) || n <= 0) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default formatPrice;
