import userEvent from "@testing-library/user-event";
import { text } from "express";

import { render, screen } from "../../../test-utils/testing-library-utils";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update topping subtotal when toppings change", async () => {
  render(<Options optionType="toppings" />);

  // make sure total starts out $0.00
  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  // update M&Ms topping to 1 and check subtotal
  const toppingMM = await screen.findByRole("checkbox", { name: "M&Ms" });
  userEvent.click(toppingMM);
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // add Hot fudge and check the total
  const toppingHotfudge = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  userEvent.click(toppingHotfudge);
  expect(toppingsSubtotal).toHaveTextContent("3.00");

  // remove hot fudge
  userEvent.click(toppingHotfudge);
  expect(toppingsSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("Grand total update when adding a scoop", async () => {
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", {
      name: /grand total: \$/i,
    });

    // make sure grand total starts at $0.00
    expect(grandTotal).toHaveTextContent("0.00");

    // adding two scoop of vanilla
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "2");

    // adding M&Ms topping
    const toppingMM = await screen.findByRole("checkbox", { name: "M&Ms" });
    userEvent.click(toppingMM);

    expect(grandTotal).toHaveTextContent("5.50");
  });

  // text("Grand total update when adding a topping", async () => {
  //   const grandTotal = screen.getByRole("heading", {
  //     name: /grand total: \$/i,
  //   });

  //   // update M&Ms topping to 1 and check subtotal
  //   const toppingMM = await screen.findByRole("checkbox", { name: "M&Ms" });
  //   userEvent.click(toppingMM);
  //   expect(grandTotal).toHaveTextContent("1.50");
  // });
});
