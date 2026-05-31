import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ViewModeProvider } from "@/components/recruiter-hub/useViewMode";
import { RecruiterHub } from "@/components/recruiter-hub/RecruiterHub";
import { SystemAuditPanel } from "@/components/recruiter-hub/SystemAuditPanel";

describe("Recruiter Hub open/close", () => {
  it("opens the drawer from the trigger and closes it", async () => {
    const user = userEvent.setup();
    render(
      <ViewModeProvider>
        <RecruiterHub />
      </ViewModeProvider>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /recruiter hub/i }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /hiring manager hub/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close panel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("System audit honesty (count matches rows)", () => {
  it("the ready count in the label equals the number of PASS rows", () => {
    render(<SystemAuditPanel />);
    const rows = document.querySelectorAll("[data-status]");
    const passRows = document.querySelectorAll('[data-status="pass"]');

    const label = screen.getByText(/launch checks ready/i).textContent ?? "";
    const match = label.match(/(\d+)\s*\/\s*(\d+)/);
    expect(match).not.toBeNull();
    const [, passing, total] = match!.map(Number) as unknown as [
      string,
      number,
      number,
    ];

    expect(passing).toBe(passRows.length);
    expect(total).toBe(rows.length);
  });
});
