import { createContext, useContext, useState, ReactNode } from "react";

type Currency = 'USD' | 'PHP' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');

  const formatPrice = (priceUsd: number) => {
    if (currency === 'PHP') return `₱${(priceUsd * 55.5).toFixed(0)}`;
    if (currency === 'EUR') return `€${(priceUsd * 0.92).toFixed(2)}`;
    return `$${priceUsd.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
