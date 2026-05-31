import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ViewModeProvider } from "@/components/recruiter-hub/useViewMode";
import { MainView } from "@/components/layout/MainView";
import { ViewModePanel } from "@/components/recruiter-hub/ViewModePanel";

function harness() {
  return render(
    <ViewModeProvider>
      <MainView>
        <p>content</p>
      </MainView>
      <ViewModePanel />
    </ViewModeProvider>,
  );
}

describe("view-mode switch (Quick Scan ↔ Deep Dive)", () => {
  it("defaults to deep and switches to quick, driving data-view-mode on <main>", async () => {
    const user = userEvent.setup();
    const { container } = harness();
    const main = container.querySelector("main")!;
    expect(main).toHaveAttribute("data-view-mode", "deep");

    await user.click(screen.getByRole("radio", { name: /quick scan/i }));
    expect(main).toHaveAttribute("data-view-mode", "quick");

    await user.click(screen.getByRole("radio", { name: /deep dive/i }));
    expect(main).toHaveAttribute("data-view-mode", "deep");
  });

  it("uses a radiogroup with two options (icons are decorative, labels carry the name)", () => {
    harness();
    expect(screen.getByRole("radiogroup", { name: /view mode/i })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });
});
