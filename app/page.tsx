"use client";

import { useState } from "react";
import { Chart } from "@/components/organisms/Chart";
import { PnLSummary } from "@/components/organisms/PnLSummary";
import { TickerForm } from "@/components/organisms/TickerForm";
import { TrackerLayout } from "@/components/templates/TrackerLayout";
import type { TrackerRequest, TrackerResult } from "@/types";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: TrackerResult }
  | { status: "error"; message: string };

export default function Home() {
  const [state, setState] = useState<FetchState>({ status: "idle" });

  async function handleSubmit(request: TrackerRequest) {
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Request failed.";
        setState({ status: "error", message });
        return;
      }
      setState({ status: "success", data: payload as TrackerResult });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error.";
      setState({ status: "error", message });
    }
  }

  return (
    <TrackerLayout
      form={
        <TickerForm
          onSubmit={handleSubmit}
          isLoading={state.status === "loading"}
        />
      }
      results={
        state.status === "error" ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.message}
          </p>
        ) : state.status === "success" ? (
          <div className="flex flex-col gap-6">
            <PnLSummary summary={state.data.summary} />
            <Chart
              data={state.data.series}
              currency={state.data.summary.currency}
            />
          </div>
        ) : null
      }
    />
  );
}
