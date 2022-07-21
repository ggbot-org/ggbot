import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("accepts user input", () => {
    render(
      <>
        <label>
          <span>Field</span>
          <Input />
        </label>
      </>
    );
    const input = screen.getByLabelText("Field");
    userEvent.type(input, "value");
    expect(input).toHaveFocus();
    expect(input).toHaveValue("value");
  });
});
