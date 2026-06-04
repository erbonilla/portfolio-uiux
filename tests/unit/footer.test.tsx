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

  it("renders the social row with real links only", () => {
    render(<SiteFooter />);
    expect(screen.getByLabelText(/social links/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/on linkedin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/on github/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/on facebook/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/on instagram/i)).toBeInTheDocument();
  });
});
