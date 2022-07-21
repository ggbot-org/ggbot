import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders label", () => {
    render(<Button>label</Button>);
    const button = screen.getByRole("button", { name: "label" });
    expect(button).toBeVisible();
  });

  it("can fire a click event", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>label</Button>);
    const button = screen.getByRole("button", { name: "label" });
    userEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("does not fire a click event when disabled", () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        label
      </Button>
    );
    const button = screen.getByRole("button", { name: "label" });
    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
