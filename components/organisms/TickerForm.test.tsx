import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TickerForm } from "@/components/organisms/TickerForm";

describe("TickerForm", () => {
  it("submits normalized values with default currency on Track click", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <TickerForm
        onSubmit={onSubmit}
        initialValues={{ ticker: "aapl", startDate: "2020-01-02", amount: 500 }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /track/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      ticker: "AAPL",
      startDate: "2020-01-02",
      amount: 500,
      currency: "USD",
    });
  });

  it("submits the selected currency", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <TickerForm
        onSubmit={onSubmit}
        initialValues={{ ticker: "AAPL", startDate: "2020-01-02", amount: 500 }}
      />,
    );

    await user.selectOptions(screen.getByLabelText(/currency/i), "EUR");
    await user.click(screen.getByRole("button", { name: /track/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ currency: "EUR" }),
    );
  });

  it("respects an EUR initialValues currency", () => {
    render(
      <TickerForm
        onSubmit={jest.fn()}
        initialValues={{
          ticker: "AAPL",
          startDate: "2020-01-02",
          amount: 500,
          currency: "EUR",
        }}
      />,
    );
    expect(screen.getByLabelText(/currency/i)).toHaveValue("EUR");
  });

  it("does not label the amount field with a hardcoded currency", () => {
    render(<TickerForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/^amount$/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/amount \(usd\)/i)).not.toBeInTheDocument();
  });

  it("blocks submit and shows error when amount is zero", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <TickerForm
        onSubmit={onSubmit}
        initialValues={{ ticker: "AAPL", startDate: "2020-01-02", amount: 0 }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /track/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/amount/i);
  });

  it("blocks submit when ticker is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <TickerForm
        onSubmit={onSubmit}
        initialValues={{ ticker: "", startDate: "2020-01-02", amount: 500 }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /track/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/ticker/i);
  });

  it("disables submit while loading", () => {
    render(<TickerForm onSubmit={jest.fn()} isLoading />);
    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
  });
});
