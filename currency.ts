/**
 * Currency Utilities
 * Centralized currency formatting for Pakistani Rupees
 */

// Currency formatter for Pakistani Rupees
export const currencyFormatter = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
});

/**
 * Format price in Pakistani Rupees with proper symbol
 */
export function formatPrice(amount: number): string {
  try {
    // Use Intl.NumberFormat for proper localization
    const formatted = currencyFormatter.format(amount);
    // If the formatter doesn't show PKR properly, use fallback
    if (!formatted.includes('PKR') && !formatted.includes('Rs')) {
      return `Rs ${Number(amount).toLocaleString('en-PK')}`;
    }
    return formatted;
  } catch (err) {
    // Fallback: use Rs prefix with proper number formatting
    return `Rs ${Number(amount).toLocaleString('en-PK')}`;
  }
}

/**
 * Format price in a compact way for mobile displays
 */
export function formatPriceCompact(amount: number): string {
  if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(1)}M PKR`;
  }
  if (amount >= 1e3) {
    return `${(amount / 1e3).toFixed(1)}K PKR`;
  }
  return `${amount} PKR`;
}

/**
 * Format price for display in lists (shorter format)
 */
export function formatPriceShort(amount: number): string {
  if (amount >= 1e6) {
    return `Rs ${(amount / 1e6).toFixed(1)}M`;
  }
  if (amount >= 1e3) {
    return `Rs ${(amount / 1e3).toFixed(0)}K`;
  }
  return `Rs ${amount}`;
}

/**
 * Parse price string back to number
 */
export function parsePrice(priceString: string): number {
  // Remove currency symbols and parse
  const cleanString = priceString.replace(/[Rs,PKR\s]/g, '');
  return parseFloat(cleanString) || 0;
}

/**
 * Format price range for filters
 */
export function formatPriceRange(min: number, max: number): string {
  if (min === 0) {
    return `Under ${formatPriceShort(max)}`;
  }
  if (max >= 5000000) {
    return `${formatPriceShort(min)}+`;
  }
  return `${formatPriceShort(min)} - ${formatPriceShort(max)}`;
}
