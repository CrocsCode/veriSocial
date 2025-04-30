import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import GlobalModal from "../../components/Modal";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("GlobalModal Component", () => {
  it("render children content when opened", () => {
    renderProviders(
      <GlobalModal isOpen={true} onClose={vi.fn()}>
        <div>Test Content</div>
      </GlobalModal>
    );

    expect(screen.getByText("Test Content")).toBeDefined();
  });

  it("call resetForm when closed", () => {
    const mockClose = vi.fn();
    const mockReset = vi.fn();

    renderProviders(
      <GlobalModal isOpen={true} onClose={mockClose} resetForm={mockReset}>
        <div>Content</div>
      </GlobalModal>
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockReset).toHaveBeenCalled();
    expect(mockClose).toHaveBeenCalled();
  });

  it("only calls onClose when resetForm is not provided", () => {
    const mockClose = vi.fn();

    renderProviders(
      <GlobalModal isOpen={true} onClose={mockClose}>
        <span>Other</span>
      </GlobalModal>
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalled();
  });
});
