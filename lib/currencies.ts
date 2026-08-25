export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  decimals: number;
}

export const currencies: Record<string, CurrencyInfo> = {
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira", locale: "en-NG", decimals: 0 },
  USD: { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US", decimals: 0 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB", decimals: 0 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", locale: "en-IE", decimals: 0 },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA", decimals: 0 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU", decimals: 0 },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN", decimals: 0 },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA", decimals: 0 },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR", decimals: 0 },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP", decimals: 0 },
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", locale: "en-KE", decimals: 0 },
  GHS: { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi", locale: "en-GH", decimals: 0 },
};

// Approximate exchange rates FROM NGN (1 NGN = X target currency)
// Used as fallback when live rates can't be fetched
export const fallbackRates: Record<string, number> = {
  NGN: 1,
  USD: 1 / 1550,
  GBP: 1 / 1950,
  EUR: 1 / 1700,
  CAD: 1 / 1150,
  AUD: 1 / 1000,
  INR: 1 / 18,
  ZAR: 1 / 85,
  BRL: 1 / 300,
  JPY: 1 / 10,
  KES: 1 / 12,
  GHS: 1 / 12,
};

// Timezone to currency mapping
const timezoneCurrencyMap: Record<string, string> = {
  // North America
  "America/New_York": "USD",
  "America/Chicago": "USD",
  "America/Denver": "USD",
  "America/Los_Angeles": "USD",
  "America/Anchorage": "USD",
  "America/Phoenix": "USD",
  "America/Detroit": "USD",
  "America/Indiana/Indianapolis": "USD",
  "America/Toronto": "CAD",
  "America/Vancouver": "CAD",
  "America/Edmonton": "CAD",
  "America/Winnipeg": "CAD",
  "America/Halifax": "CAD",
  "America/Montreal": "CAD",
  "America/Mexico_City": "USD",
  "America/Cancun": "USD",

  // Europe
  "Europe/London": "GBP",
  "Europe/Paris": "EUR",
  "Europe/Berlin": "EUR",
  "Europe/Rome": "EUR",
  "Europe/Madrid": "EUR",
  "Europe/Amsterdam": "EUR",
  "Europe/Brussels": "EUR",
  "Europe/Vienna": "EUR",
  "Europe/Zurich": "EUR",
  "Europe/Dublin": "EUR",
  "Europe/Lisbon": "EUR",
  "Europe/Athens": "EUR",
  "Europe/Warsaw": "EUR",
  "Europe/Prague": "EUR",
  "Europe/Budapest": "EUR",
  "Europe/Bucharest": "EUR",
  "Europe/Sofia": "EUR",
  "Europe/Copenhagen": "EUR",
  "Europe/Stockholm": "EUR",
  "Europe/Oslo": "EUR",
  "Europe/Helsinki": "EUR",
  "Europe/Moscow": "USD",
  "Europe/Istanbul": "USD",
  "Europe/Kiev": "EUR",
  "Europe/Kyiv": "EUR",

  // Asia
  "Asia/Kolkata": "INR",
  "Asia/Calcutta": "INR",
  "Asia/Mumbai": "INR",
  "Asia/Dubai": "USD",
  "Asia/Singapore": "USD",
  "Asia/Hong_Kong": "USD",
  "Asia/Tokyo": "JPY",
  "Asia/Seoul": "USD",
  "Asia/Shanghai": "USD",
  "Asia/Chongqing": "USD",
  "Asia/Taipei": "USD",
  "Asia/Bangkok": "USD",
  "Asia/Jakarta": "USD",
  "Asia/Kuala_Lumpur": "USD",
  "Asia/Manila": "USD",

  // Africa
  "Africa/Lagos": "NGN",
  "Africa/Niger": "NGN",
  "Africa/Accra": "GHS",
  "Africa/Nairobi": "KES",
  "Africa/Johannesburg": "ZAR",
  "Africa/Cairo": "USD",
  "Africa/Casablanca": "EUR",

  // Oceania
  "Australia/Sydney": "AUD",
  "Australia/Melbourne": "AUD",
  "Australia/Brisbane": "AUD",
  "Australia/Perth": "AUD",
  "Australia/Adelaide": "AUD",
  "Pacific/Auckland": "AUD",
  "Pacific/Fiji": "AUD",

  // South America
  "America/Sao_Paulo": "BRL",
  "America/Brazil": "BRL",
  "America/Buenos_Aires": "USD",
  "America/Santiago": "USD",
  "America/Bogota": "USD",
  "America/Lima": "USD",
};

export function getCurrencyFromTimezone(timezone: string): string {
  // Direct lookup
  if (timezoneCurrencyMap[timezone]) {
    return timezoneCurrencyMap[timezone];
  }

  // Try prefix matching
  for (const [tz, currency] of Object.entries(timezoneCurrencyMap)) {
    if (timezone.startsWith(tz)) {
      return currency;
    }
  }

  // Region-based fallback
  if (timezone.startsWith("America/")) return "USD";
  if (timezone.startsWith("Europe/")) return "EUR";
  if (timezone.startsWith("Asia/")) return "USD";
  if (timezone.startsWith("Africa/")) return "USD";
  if (timezone.startsWith("Australia/")) return "AUD";
  if (timezone.startsWith("Pacific/")) return "AUD";

  return "USD";
}

export function formatPrice(amount: number, currencyCode: string): string {
  const currency = currencies[currencyCode];
  if (!currency) return `₦${amount.toLocaleString()}`;

  // Use Intl.NumberFormat for proper formatting
  const formatted = new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(amount);

  return formatted;
}

export function convertPrice(
  ngnAmount: number,
  targetCurrency: string,
  rates: Record<string, number>
): number {
  const rate = rates[targetCurrency];
  if (!rate || targetCurrency === "NGN") return ngnAmount;

  // Convert NGN to target currency
  const converted = ngnAmount * rate;

  // Round to nearest whole number
  return Math.round(converted);
}
