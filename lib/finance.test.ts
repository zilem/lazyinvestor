import { computeTracker, normalizeTicker, priceFor } from "@/lib/finance";

describe("normalizeTicker", () => {
  it("uppercases and trims", () => {
    expect(normalizeTicker("  smh ")).toBe("SMH");
  });
});

describe("priceFor", () => {
  it("prefers adjclose when available", () => {
    expect(priceFor({ date: new Date(), close: 100, adjclose: 95 })).toBe(95);
  });

  it("falls back to close when adjclose is missing", () => {
    expect(priceFor({ date: new Date(), close: 100 })).toBe(100);
  });

  it("returns null when both are null or non-finite", () => {
    expect(priceFor({ date: new Date(), close: null, adjclose: null })).toBeNull();
    expect(priceFor({ date: new Date(), close: NaN })).toBeNull();
  });
});

describe("computeTracker", () => {
  const baseQuotes = [
    { date: new Date("2023-01-03"), close: 100, adjclose: 100 },
    { date: new Date("2023-01-04"), close: 110, adjclose: 110 },
    { date: new Date("2023-01-05"), close: 120, adjclose: 120 },
  ];

  it("computes fractional shares from the first usable price", () => {
    const result = computeTracker({
      ticker: "TEST",
      amount: 1000,
      currency: "USD",
      quotes: baseQuotes,
    });
    expect(result.summary.shares).toBeCloseTo(10);
  });

  it("computes current value at the last usable price", () => {
    const result = computeTracker({
      ticker: "TEST",
      amount: 1000,
      currency: "USD",
      quotes: baseQuotes,
    });
    expect(result.summary.currentValue).toBeCloseTo(1200);
    expect(result.summary.absoluteReturn).toBeCloseTo(200);
    expect(result.summary.percentReturn).toBeCloseTo(20);
  });

  it("produces one series point per usable quote in order", () => {
    const result = computeTracker({
      ticker: "TEST",
      amount: 1000,
      currency: "USD",
      quotes: baseQuotes,
    });
    expect(result.series).toHaveLength(3);
    expect(result.series[0]).toEqual({ date: "2023-01-03", value: 1000 });
    expect(result.series[2]).toEqual({ date: "2023-01-05", value: 1200 });
  });

  it("handles losses (negative return)", () => {
    const result = computeTracker({
      ticker: "TEST",
      amount: 1000,
      currency: "USD",
      quotes: [
        { date: new Date("2023-01-03"), close: 100, adjclose: 100 },
        { date: new Date("2023-01-04"), close: 80, adjclose: 80 },
      ],
    });
    expect(result.summary.currentValue).toBeCloseTo(800);
    expect(result.summary.absoluteReturn).toBeCloseTo(-200);
    expect(result.summary.percentReturn).toBeCloseTo(-20);
  });

  it("skips null-priced quotes when picking first/last", () => {
    const result = computeTracker({
      ticker: "TEST",
      amount: 500,
      currency: "USD",
      quotes: [
        { date: new Date("2023-01-03"), close: null, adjclose: null },
        { date: new Date("2023-01-04"), close: 50, adjclose: 50 },
        { date: new Date("2023-01-05"), close: null, adjclose: null },
        { date: new Date("2023-01-06"), close: 60, adjclose: 60 },
      ],
    });
    expect(result.summary.startDate).toBe("2023-01-04");
    expect(result.summary.endDate).toBe("2023-01-06");
    expect(result.summary.shares).toBeCloseTo(10);
    expect(result.summary.currentValue).toBeCloseTo(600);
    expect(result.series).toHaveLength(2);
  });

  it("throws when no usable quotes exist", () => {
    expect(() =>
      computeTracker({
        ticker: "TEST",
        amount: 1000,
        currency: "USD",
        quotes: [{ date: new Date("2023-01-03"), close: null, adjclose: null }],
      }),
    ).toThrow(/no price data/i);
  });

  it("passes through the ticker and currency to the summary", () => {
    const result = computeTracker({
      ticker: "SMH",
      amount: 1000,
      currency: "EUR",
      quotes: baseQuotes,
    });
    expect(result.summary.ticker).toBe("SMH");
    expect(result.summary.currency).toBe("EUR");
  });
});
