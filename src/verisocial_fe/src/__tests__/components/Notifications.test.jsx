import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import { showNotificationRequest } from "../../redux/actionCreators/notificationCreators";
import Notification from "../../components/Notification";

describe("Notification Test fire", () => {
    it("- Display Notification when redux action is dispatched", async () => {
        const preloadedState = {
            notification: { message: "Test Notification", status: "success" }
        };

        const { store } = renderProviders(<Notification />, { preloadedState });
        store.dispatch(showNotificationRequest("Test Notification", "success"));
        await waitFor(() => expect(screen.getByText("Test Notification")).toBeDefined());
    });
});
