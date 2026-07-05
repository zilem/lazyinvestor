export type TrackerRequest = {
  ticker: string;
  startDate: string;
  amount: number;
};

export type PricePoint = {
  date: string;
  value: number;
};

export type TrackerSummary = {
  ticker: string;
  currency: string;
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
