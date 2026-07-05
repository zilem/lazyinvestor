"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PricePoint } from "@/types";
import { formatCurrency } from "@/lib/utils";

type ChartProps = {
  data: PricePoint[];
  currency: string;
};

export function Chart({ data, currency }: ChartProps) {
  const isGain =
    data.length > 1 && data[data.length - 1].value >= data[0].value;
  const stroke = isGain ? "#10b981" : "#ef4444";
  const fill = isGain ? "#10b98122" : "#ef444422";

  return (
    <div className="h-80 w-full rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.4} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            minTickGap={40}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={["auto", "auto"]}
            tickFormatter={(value: number) => formatCurrency(value, currency)}
            width={80}
          />
          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? formatCurrency(value, currency) : String(value)
            }
            labelFormatter={(label) => String(label)}
            contentStyle={{ fontSize: "12px" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            fill={fill}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
