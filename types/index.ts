export const SUPPORTED_CURRENCIES = ["USD", "EUR"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export type TrackerRequest = {
  ticker: string;
  startDate: string;
  amount: number;
  currency: Currency;
};

export type PricePoint = {
  date: string;
  value: number;
};

export type TrackerSummary = {
  ticker: string;
  currency: Currency;
  startDate: string;
  endDate: string;
  shares: number;
  initialValue: number;
  currentValue: number;
  absoluteReturn: number;
  percentReturn: number;
};

export type TrackerResult = {
  summary: TrackerSummary;
  series: PricePoint[];
};

export type TrackerErrorResponse = {
  error: string;
};
