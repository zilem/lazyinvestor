"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import {
  SUPPORTED_CURRENCIES,
  type Currency,
  type TrackerRequest,
} from "@/types";

type TickerFormProps = {
  onSubmit: (request: TrackerRequest) => void;
  isLoading?: boolean;
  initialValues?: Partial<TrackerRequest>;
};

const today = () => new Date().toISOString().slice(0, 10);
const isCurrency = (v: string): v is Currency =>
  (SUPPORTED_CURRENCIES as readonly string[]).includes(v);

const currencyOptions = SUPPORTED_CURRENCIES.map((c) => ({ value: c, label: c }));

export function TickerForm({
  onSubmit,
  isLoading = false,
  initialValues,
}: TickerFormProps) {
  const [ticker, setTicker] = useState(initialValues?.ticker ?? "SMH");
  const [startDate, setStartDate] = useState(
    initialValues?.startDate ?? "2020-01-02",
  );
  const [amount, setAmount] = useState(
    initialValues?.amount?.toString() ?? "1000",
  );
  const [currency, setCurrency] = useState<Currency>(
    initialValues?.currency ?? "USD",
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedTicker = ticker.trim().toUpperCase();
    const parsedAmount = Number(amount);

    if (!trimmedTicker) {
      setError("Ticker is required.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    if (!startDate) {
      setError("Start date is required.");
      return;
    }
    if (new Date(startDate) >= new Date(today())) {
      setError("Start date must be in the past.");
      return;
    }

    onSubmit({
      ticker: trimmedTicker,
      startDate,
      amount: parsedAmount,
      currency,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField
          id="ticker"
          label="Ticker"
          placeholder="SMH"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          autoComplete="off"
          disabled={isLoading}
        />
        <FormField
          id="startDate"
          label="Start date"
          type="date"
          value={startDate}
          max={today()}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={isLoading}
        />
        <FormField
          id="amount"
          label="Amount"
          type="number"
          inputMode="decimal"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
        />
        <SelectField
          id="currency"
          label="Currency"
          options={currencyOptions}
          value={currency}
          onChange={(e) => {
            const next = e.target.value;
            if (isCurrency(next)) setCurrency(next);
          }}
          disabled={isLoading}
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
      <div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading…" : "Track"}
        </Button>
      </div>
    </form>
  );
}
