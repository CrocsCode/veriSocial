import { screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import Feed from "../../components/Feed";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const UnwrappedFeed = Feed.WrappedComponent || Feed;

describe("Feed Component", () => {
  const baseProps = {
    onSelectPost: vi.fn(),
    resetCreatePostForm: vi.fn(),
    loadCommentsRequest: vi.fn(),
  };

  it("call loadFeedPageRequest on mount", () => {
    const mockLoad = vi.fn();
    const feed = { posts: [], loading: false, isLastPage: false, currentPage: 0 };

    renderProviders(
      <UnwrappedFeed
        {...baseProps}
        loadFeedPageRequest={mockLoad}
        feed={feed}
      />
    );

    expect(mockLoad).toHaveBeenCalledWith(1, 8);
  });

  it("display end of feed message", () => {
    const mockLoad = vi.fn();
    const feed = { posts: [], loading: false, isLastPage: true, currentPage: 2 };

    renderProviders(
      <UnwrappedFeed
        {...baseProps}
        loadFeedPageRequest={mockLoad}
        feed={feed}
      />
    );

    expect(screen.getByText("You've reached the end of the feed.")).toBeDefined();
  });
});
