// Shopify store is set to Albanian Lek (ALL)
// Convert to USD for display
const ALL_TO_USD = 0.01087; // 1 ALL ≈ 0.01087 USD (1 USD ≈ 92 ALL)

export function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  const usd = currencyCode === 'ALL' ? num * ALL_TO_USD : num;
  return `$${Math.round(usd)}`;
}
