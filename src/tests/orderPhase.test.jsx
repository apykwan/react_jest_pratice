import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

test("order phases for happy path", async () => {
  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "2");

  const cherryTopping = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  userEvent.click(cherryTopping);

  const grandTotal = screen.getByRole("heading", {
    name: /grand total: \$/i,
  });

  expect(grandTotal).toHaveTextContent("5.50");

  // find and click order button
  const orderBtn = screen.getByRole("button", {
    name: "Order Sundae!",
  });

  userEvent.click(orderBtn);
  // check summary information based on order
  const scoopsSummary = screen.getByRole("heading", {
    name: /Scoops: \$/i,
  });

  expect(scoopsSummary).toHaveTextContent("$4.00");

  const toppingsSummary = screen.getByRole("heading", {
    name: /Toppings: \$/i,
  });

  expect(toppingsSummary).toHaveTextContent("$1.50");

  // accept terms and conditions and click button to confirm order
  const confirmCheck = screen.getByRole("checkbox", {
    name: "I agree to Terms and Conditions",
  });
  userEvent.click(confirmCheck);

  const confirmBtn = screen.getByRole("button", {
    name: "Confirm order",
  });
  userEvent.click(confirmBtn);

  // Eexpect loading to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // confirm order number on confirmation page
  const thankyouHeader = await screen.findByText(/thank you/i);
  expect(thankyouHeader).toBeInTheDocument();

  const confirmationNum = await screen.findByText(/order number/i);
  expect(confirmationNum).toHaveTextContent("123456789");
  // click "new order" button on confirmation page"
  const newOrderBtn = screen.getByRole("button", {
    name: "Create new order",
  });
  userEvent.click(newOrderBtn);

  // check that scoops and toppings subtotals have been reset
  const scoopSubtotal = screen.getByText(/scoops total: \$/i);
  expect(scoopSubtotal).toHaveTextContent("0.00");

  const toppingSubtotal = screen.getByText(/toppings total: \$/i);
  expect(toppingSubtotal).toHaveTextContent("0.00");
  // do we need to await anything to avoid test error?

  await screen.findByRole("spinbutton", { name: "Vanilla" });
  await screen.findByRole("checkbox", { name: "Cherries" });
});

test("Topping header is not on summary page if no toppings ordered", async () => {
  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "2");

  const grandTotal = screen.getByRole("heading", {
    name: /grand total: \$/i,
  });

  expect(grandTotal).toHaveTextContent("4.00");

  // find and click order button
  const orderBtn = screen.getByRole("button", {
    name: "Order Sundae!",
  });

  userEvent.click(orderBtn);
  // check summary information based on order
  const scoopsSummary = screen.getByRole("heading", {
    name: /Scoops: \$/i,
  });

  expect(scoopsSummary).toHaveTextContent("$4.00");

  const toppingsSummary = screen.queryByRole("heading", {
    name: /Toppings: \$/i,
  });

  expect(toppingsSummary).not.toBeInTheDocument();
});
