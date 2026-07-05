import YahooFinance from "yahoo-finance2";
import type { PricePoint, TrackerResult, TrackerSummary } from "@/types";
import { toISODate } from "@/lib/utils";

type RawQuote = {
  date: Date;
  close: number | null;
  adjclose?: number | null;
};

const client = new YahooFinance();

export function normalizeTicker(input: string): string {
  return input.trim().toUpperCase();
}

export function priceFor(quote: RawQuote): number | null {
  const price = quote.adjclose ?? quote.close;
  return typeof price === "number" && Number.isFinite(price) ? price : null;
}

export function computeTracker(input: {
  ticker: string;
  amount: number;
  currency: string;
  quotes: RawQuote[];
}): TrackerResult {
  const usable = input.quotes
    .map((q) => ({ date: q.date, price: priceFor(q) }))
    .filter((q): q is { date: Date; price: number } => q.price !== null);

  if (usable.length === 0) {
    throw new Error("No price data available for the given period.");
  }

  const first = usable[0];
  const last = usable[usable.length - 1];
  const shares = input.amount / first.price;

  const series: PricePoint[] = usable.map((q) => ({
    date: toISODate(q.date),
    value: shares * q.price,
  }));

  const currentValue = shares * last.price;
  const absoluteReturn = currentValue - input.amount;
  const percentReturn = (absoluteReturn / input.amount) * 100;

  const summary: TrackerSummary = {
    ticker: input.ticker,
    currency: input.currency,
    startDate: toISODate(first.date),
    endDate: toISODate(last.date),
    shares,
    initialValue: input.amount,
    currentValue,
    absoluteReturn,
    percentReturn,
  };

  return { summary, series };
}

export async function fetchTracker(
  ticker: string,
  startDate: Date,
  amount: number,
): Promise<TrackerResult> {
  const normalized = normalizeTicker(ticker);
  const result = await client.chart(normalized, {
    period1: startDate,
    interval: "1d",
  });

  return computeTracker({
    ticker: normalized,
    amount,
    currency: result.meta.currency,
    quotes: result.quotes,
  });
}
