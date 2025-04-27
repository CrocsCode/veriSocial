import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import TeapotComponent from "../../components/Teapot";
import api from "../../api";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock("../../api", () => ({
  default: {
    teapotService: {
      getStatus: vi.fn(),
    },
  },
}));

describe("Teapot Component", () => {
  it("Test API Layer status via /teapot endpoint", async () => {
    api.teapotService.getStatus.mockResolvedValue({
      status: "success",
      message: "Stand proud for you are a teapot too.",
    });
    render(<TeapotComponent />);

    await waitFor(() => {
      expect(screen.getByText(/stand proud for you are a teapot too/i)).toBeDefined();
    });
  });
});
