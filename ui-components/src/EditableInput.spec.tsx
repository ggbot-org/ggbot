import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { EditableInput } from "./EditableInput";

function EditableInputWithLabel({ label: labelText }: { label: string }) {
  const [value, setValue] = useState("");
  return (
    <>
      <label>
        <span>{labelText}</span>
        <EditableInput value={value} setValue={setValue} />
      </label>
    </>
  );
}

describe("EditableInput", () => {
  it("accepts user input after click", () => {
    render(<EditableInputWithLabel label="Label" />);
    const input = screen.getByLabelText("Label");
    userEvent.click(input);
    expect(input).toHaveFocus();
    userEvent.type(input, "value");
    expect(input).toHaveValue("value");
  });
});
