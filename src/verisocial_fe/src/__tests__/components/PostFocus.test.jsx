import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import PostFocus from "../../components/PostFocus";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const UnwrappedPostFocus = PostFocus.WrappedComponent || PostFocus;

describe("PostFocus Component", () => {
  const basePost = {
    post_id: 42,
    "full-name": "Full Name Test",
    username: "usernametest",
    content: "focused content test",
    "likes-count": 3,
    "is-liked": 0,
    "created-at": new Date().toISOString(),
    base64_image: "",
    "bot-score": 0,
    "user_bot_score": 0,
    comments: [],
    "comment-count": 0,
  };

  it("shows loading state when loadingFocus is true", () => {
    renderProviders(
      <UnwrappedPostFocus
        post={null}
        loadingFocus={true}
        likePostRequest={vi.fn()} />
    );
    expect(screen.getByText("Loading post...")).toBeDefined();
  });

  it("shows no post message when post is null", () => {
    renderProviders(
      <UnwrappedPostFocus
        post={null}
        loadingFocus={false}
        likePostRequest={vi.fn()} />
    );
    expect(screen.getByText("No post selected.")).toBeDefined();
  });

  it("renders post details when there is post", () => {
    renderProviders(
      <UnwrappedPostFocus
        post={basePost}
        loadingFocus={false}
        likePostRequest={vi.fn()} />
    );

    expect(screen.getByText(basePost["full-name"])).toBeDefined();
    expect(screen.getByText(`@${basePost.username}`)).toBeDefined();
    expect(screen.getByText(basePost.content)).toBeDefined();
    expect(screen.getByText(String(basePost["comment-count"]))).toBeDefined();
    expect(screen.getByText("Comments")).toBeDefined();
  });

  it("calls likePostRequest when like icon is clicked", () => {
    const mockLike = vi.fn();
    renderProviders(
      <UnwrappedPostFocus
        post={basePost}
        loadingFocus={false}
        likePostRequest={mockLike} />
    );

    const [likeGroup] = screen.getAllByRole("group");
    fireEvent.click(likeGroup);
    expect(mockLike).toHaveBeenCalledWith(basePost.post_id);
  });
});
