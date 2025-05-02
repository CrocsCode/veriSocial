import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import AdminDataTable from "../../components/AdminDataTable";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const Unwrapped = AdminDataTable.WrappedComponent || AdminDataTable;

describe("AdminDataTable Component", () => {
  it("fetch report list on load", () => {
    const mockList = vi.fn();
    renderProviders(
      <Unwrapped
        userId={1}
        reports={[]}
        loading={false}
        error={null}
        reportListRequest={mockList}
        fetchPostFocusRequest={vi.fn()}
        resetPostFocus={vi.fn()}
      />
    );
    expect(mockList).toHaveBeenCalled();
  });

  it("shows table and click for detailed view", () => {
    const mockFetch = vi.fn();
    const reports = [
      {
        report_id: 42,
        reportee_id: 30,
        reported_id: 10,
        post_id: 99,
        ai_content: true,
        bot_behaviour: false,
        other: false,
        additional_details: "X",
        created_at: "2025-05-01T00:00:00Z"
      }
    ];
    renderProviders(
      <Unwrapped
        userId={123}
        reports={reports}
        loading={false}
        error={null}
        reportListRequest={vi.fn()}
        fetchPostFocusRequest={mockFetch}
        resetPostFocus={vi.fn()}
      />
    );

    expect(screen.getByText("42")).toBeDefined();
    fireEvent.click(screen.getByText("42"));
    expect(mockFetch).toHaveBeenCalledWith(123, 99);
  });
});
