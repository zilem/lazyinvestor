import { Badge } from "@/components/atoms/Badge";
import { StatCard } from "@/components/molecules/StatCard";
import type { TrackerSummary } from "@/types";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/utils";

type PnLSummaryProps = {
  summary: TrackerSummary;
};

export function PnLSummary({ summary }: PnLSummaryProps) {
  const isGain = summary.absoluteReturn >= 0;
  const tone = summary.absoluteReturn === 0 ? "neutral" : isGain ? "positive" : "negative";

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {summary.ticker}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {summary.startDate} → {summary.endDate}
          </p>
        </div>
        <Badge tone={tone}>
          {formatPercent(summary.percentReturn)} ({formatSignedCurrency(summary.absoluteReturn, summary.currency)})
        </Badge>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Invested"
          value={formatCurrency(summary.initialValue, summary.currency)}
        />
        <StatCard
          label="Current value"
          value={formatCurrency(summary.currentValue, summary.currency)}
        />
        <StatCard
          label="Shares"
          value={summary.shares.toFixed(4)}
          hint={`at ${formatCurrency(summary.initialValue / summary.shares, summary.currency)} on ${summary.startDate}`}
        />
      </div>
    </section>
  );
}
