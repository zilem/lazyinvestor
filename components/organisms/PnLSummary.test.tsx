import { render, screen } from "@testing-library/react";
import { PnLSummary } from "@/components/organisms/PnLSummary";
import type { TrackerSummary } from "@/types";

const baseSummary: TrackerSummary = {
  ticker: "SMH",
  currency: "USD",
  startDate: "2020-01-02",
  endDate: "2024-01-02",
  shares: 10,
  initialValue: 1000,
  currentValue: 1500,
  absoluteReturn: 500,
  percentReturn: 50,
};

describe("PnLSummary", () => {
  it("renders ticker, date range, and formatted values on a gain", () => {
    render(<PnLSummary summary={baseSummary} />);

    expect(screen.getByRole("heading", { name: "SMH" })).toBeInTheDocument();
    expect(screen.getByText("2020-01-02 → 2024-01-02")).toBeInTheDocument();
    expect(screen.getByText("$1,000.00")).toBeInTheDocument();
    expect(screen.getByText("$1,500.00")).toBeInTheDocument();
    expect(screen.getByText(/\+50\.00%/)).toBeInTheDocument();
  });

  it("shows negative return formatting on a loss", () => {
    render(
      <PnLSummary
        summary={{
          ...baseSummary,
          currentValue: 800,
          absoluteReturn: -200,
          percentReturn: -20,
        }}
      />,
    );

    expect(screen.getByText(/-20\.00%/)).toBeInTheDocument();
    expect(screen.getByText(/-\$200\.00/)).toBeInTheDocument();
  });
});
