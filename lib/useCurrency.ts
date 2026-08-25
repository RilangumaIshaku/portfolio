"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCurrencyFromTimezone,
  convertPrice,
  formatPrice,
  fallbackRates,
} from "@/lib/currencies";

interface UseCurrencyReturn {
  currency: string;
  formatPrice: (ngnAmount: number) => string;
  convertPrice: (ngnAmount: number) => number;
  isLoading: boolean;
}

export function useCurrency(): UseCurrencyReturn {
  const [currency, setCurrency] = useState<string>("NGN");
  const [rates, setRates] = useState<Record<string, number>>(fallbackRates);
  const [isLoading, setIsLoading] = useState(true);

  // Detect currency from timezone
  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const detectedCurrency = getCurrencyFromTimezone(timezone);
      setCurrency(detectedCurrency);
    } catch {
      // Fallback to NGN if timezone detection fails
      setCurrency("NGN");
    }
  }, []);

  // Fetch live exchange rates
  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch(
          "https://open.er-api.com/v6/latest/NGN"
        );
        if (response.ok) {
          const data = await response.json();
          if (data.rates) {
            setRates(data.rates);
          }
        }
      } catch {
        // Use fallback rates if API fails
      } finally {
        setIsLoading(false);
      }
    }

    fetchRates();
  }, []);

  const format = useCallback(
    (ngnAmount: number): string => {
      const converted = convertPrice(ngnAmount, currency, rates);
      return formatPrice(converted, currency);
    },
    [currency, rates]
  );

  const convert = useCallback(
    (ngnAmount: number): number => {
      return convertPrice(ngnAmount, currency, rates);
    },
    [currency, rates]
  );

  return {
    currency,
    formatPrice: format,
    convertPrice: convert,
    isLoading,
  };
}
