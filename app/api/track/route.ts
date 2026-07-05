import { NextResponse } from "next/server";
import { fetchTracker } from "@/lib/finance";
import type { TrackerErrorResponse, TrackerRequest } from "@/types";

function isTrackerRequest(value: unknown): value is TrackerRequest {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.ticker === "string" &&
    typeof v.startDate === "string" &&
    typeof v.amount === "number"
  );
}

function badRequest(message: string) {
  return NextResponse.json<TrackerErrorResponse>({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  if (!isTrackerRequest(payload)) {
    return badRequest("Missing or invalid ticker, startDate, or amount.");
  }

  const startDate = new Date(payload.startDate);
  if (Number.isNaN(startDate.getTime())) {
    return badRequest("startDate is not a valid date.");
  }
  if (startDate >= new Date()) {
    return badRequest("startDate must be in the past.");
  }
  if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
    return badRequest("amount must be greater than 0.");
  }
  if (!payload.ticker.trim()) {
    return badRequest("ticker is required.");
  }

  try {
    const result = await fetchTracker(payload.ticker, startDate, payload.amount);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch tracker data.";
    return NextResponse.json<TrackerErrorResponse>(
      { error: message },
      { status: 502 },
    );
  }
}
