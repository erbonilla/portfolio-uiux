import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/actions/button/Button";
import { IconButton } from "@/components/actions/icon-button/IconButton";
import { Badge } from "@/components/feedback/badge/Badge";
import { FormField } from "@/components/forms/form-field/FormField";

describe("Button", () => {
  it("renders its label and variant/size data attributes", () => {
    render(
      <Button variant="primary" size="lg">
        Contact
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Contact" });
    expect(btn).toHaveAttribute("data-variant", "primary");
    expect(btn).toHaveAttribute("data-size", "lg");
  });

  it("exposes aria-busy and disables while loading", () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
  });
});

describe("IconButton", () => {
  it("requires and applies an accessible name", () => {
    render(<IconButton ariaLabel="Open menu" icon={<svg />} />);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });
});

describe("Badge", () => {
  it("renders text content (status not by color alone)", () => {
    render(<Badge tone="success">PASS</Badge>);
    expect(screen.getByText("PASS")).toBeInTheDocument();
  });
});

describe("FormField", () => {
  it("associates the label with the control and links error text", () => {
    render(
      <FormField label="Email" error="Required">
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid}
          />
        )}
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    const msg = screen.getByText("Required");
    expect(input).toHaveAttribute("aria-describedby", msg.id);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(msg).toHaveAttribute("role", "alert");
  });
});
