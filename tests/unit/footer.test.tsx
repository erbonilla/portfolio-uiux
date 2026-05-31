import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/layout/SiteFooter";

describe("SiteFooter", () => {
  it("renders the footer nav with section links", () => {
    render(<SiteFooter />);
    const nav = screen.getByRole("navigation", { name: /footer/i });
    expect(nav).toBeInTheDocument();
  });

  it("never renders a dead link (no href='#' or 'TODO')", () => {
    const { container } = render(<SiteFooter />);
    const anchors = Array.from(container.querySelectorAll("a"));
    for (const a of anchors) {
      const href = a.getAttribute("href");
      expect(href).not.toBe("#");
      expect(href).not.toBe("TODO");
    }
  });

  it("omits the social row entirely while URLs are placeholders (B1)", () => {
    render(<SiteFooter />);
    expect(screen.queryByLabelText(/social links/i)).not.toBeInTheDocument();
  });
});
