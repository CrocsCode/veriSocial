import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent, cleanup } from "@testing-library/react";
import { renderProviders } from "../../utils/renderProviders";
import ReportForm from "../../components/ReportForm";
import T from "../../constants/text";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const UnwrappedReportForm = ReportForm.WrappedComponent || ReportForm;

describe("ReportForm Component", () => {
  const baseProps = {
    postId: 10,
    onClose: vi.fn(),
    reportPostRequest: vi.fn(),
    showNotificationRequest: vi.fn(),
  };

  it("show error when no reason selected", () => {
    renderProviders(
      <UnwrappedReportForm {...baseProps} />
    );
    const submitBtn = screen.getByRole("button", { name: /submit report/i });
    fireEvent.click(submitBtn);

    expect(baseProps.showNotificationRequest).toHaveBeenCalledWith(
      T.REPORT.FORM.SELECT_ERROR_NOTIFICATION
    );
    expect(screen.getByText(T.REPORT.FORM.SELECT_ERROR_DISPLAY)).toBeDefined();
    expect(baseProps.reportPostRequest).not.toHaveBeenCalled();
  });

  it("submit report when 1 reason selected", () => {
    renderProviders(
      <UnwrappedReportForm {...baseProps} />
    );
    const aiCheckbox = screen.getByRole("checkbox", { name: /ai content/i });
    fireEvent.click(aiCheckbox);

    const submitBtn = screen.getByRole("button", { name: /submit report/i });
    fireEvent.click(submitBtn);

    expect(baseProps.reportPostRequest).toHaveBeenCalledWith({
      post_id: 10,
      ai_content: true,
      bot_behaviour: false,
      other: false,
      additional_details: "",
    });
    expect(baseProps.onClose).toHaveBeenCalled();
  });
});
