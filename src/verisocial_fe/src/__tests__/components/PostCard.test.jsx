import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import PostCard from "../../components/PostCard";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const UnwrappedPostCard = PostCard.WrappedComponent || PostCard;

describe("PostCard Component", () => {
  const post = { // MOCK POST OBJECT
    post_id: 123,
    "full-name": "Full Name Test",
    username: "usernametest",
    content: "content test",
    "likes-count": 5,
    "is-liked": 0, // false
    "created-at": new Date().toISOString(),
    base64_image: "",
    "bot-score": 0,
    "user_bot_score": 0,
  };

  it("renders basic post info", () => {
    renderProviders(
      <UnwrappedPostCard
        post={post}
        onClick={vi.fn()}
        likePostRequest={vi.fn()} />
    );

    expect(screen.getByText(post["full-name"]).textContent).toBe("Full Name Test");
    expect(screen.getByText(`@${post.username}`).textContent).toBe("@usernametest");
    expect(screen.getByText(post.content).textContent).toBe("content test");
    expect(screen.getByText(String(post["likes-count"]))).toBeDefined();
  });

  it("calls onClick when the card is clicked", () => {
    const mockOnClick = vi.fn();
    renderProviders(
      <UnwrappedPostCard
        post={post}
        onClick={mockOnClick}
        likePostRequest={vi.fn()} />
    );

    fireEvent.click(screen.getByText(post.content));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("calls likePostRequest when like icon is clicked", () => {
    const mockLike = vi.fn();
    renderProviders(
      <UnwrappedPostCard
        post={post}
        onClick={vi.fn()}
        likePostRequest={mockLike} />
    );

    const [likeGroup] = screen.getAllByRole("group");
    fireEvent.click(likeGroup);
    expect(mockLike).toHaveBeenCalledWith(post.post_id);
  });
});