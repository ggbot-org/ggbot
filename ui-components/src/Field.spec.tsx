import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field } from "./Field";

describe("Field", () => {
  it("accepts user input", () => {
    render(<Field name="field" label="My Field" />);
    const input = screen.getByLabelText("My Field");
    userEvent.type(input, "value");
    expect(input).toHaveFocus();
    expect(input).toHaveValue("value");
  });
});
