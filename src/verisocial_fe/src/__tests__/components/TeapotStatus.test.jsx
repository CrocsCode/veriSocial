import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import TeapotComponent from "../../components/Teapot";
import api from "../../api";

vi.mock("../../api", () => ({
    default: {
        teapotService: {
            getStatus: vi.fn(),
        },
    },
}));

describe("TeapotComponent", () => {
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
