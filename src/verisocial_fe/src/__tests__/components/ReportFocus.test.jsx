import { screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import ReportFocus from "../../components/ReportFocus";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const Unwrapped = ReportFocus.WrappedComponent || ReportFocus;

describe("ReportFocus Component", () => {
  it("show fallback when no report", () => {
    renderProviders(<Unwrapped report={null} postFocus={null} loadingFocus={false} />);
    expect(screen.getByText("No report selected.")).toBeDefined();
  });

  it("shows Reported Post heading when loading focus", () => {
    const fakeReport = {
      report_id: 1,
      reportee_id: 2,
      reported_id: 3,
      post_id: 4,
      ai_content: false,
      bot_behaviour: false,
      other: false,
      created_at: new Date().toISOString()
    };
    renderProviders(<Unwrapped report={fakeReport} postFocus={null} loadingFocus={true} />);
    expect(screen.getByText("Reported Post:")).toBeDefined();
  });

  it("render details if report provided", () => {
    const fakeReport = {
      report_id: 5,
      reportee_id: 6,
      reported_id: 7,
      post_id: 8,
      ai_content: true,
      bot_behaviour: false,
      other: false,
      additional_details: "Details here",
      created_at: "2025-05-01T10:00:00Z"
    };
    const fakePost = {
      post_id: 8,
      username: "joe",
      "full-name": "Joe Bloggs",
      content: "Post content",
      base64_image: "url.png",
      "bot-score": 1
    };
    renderProviders(<Unwrapped report={fakeReport} postFocus={fakePost} loadingFocus={false} />);
    expect(screen.getByText("Report ID:")).toBeDefined();
    expect(screen.getByText("Categories:")).toBeDefined();
    expect(screen.getByText("Details here")).toBeDefined();
    expect(screen.getByText("Post content")).toBeDefined();
  });
});
