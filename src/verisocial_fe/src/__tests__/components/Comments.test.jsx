import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import Comments from "../../components/Comments";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const UnwrappedComments = Comments.WrappedComponent || Comments;

describe("Comments Component", () => {
  it("displays message with no comments", () => {
    renderProviders(
      <UnwrappedComments
        initialComments={[]}
        postFocusId={1}
        likePostRequest={vi.fn()}
        createCommentRequest={vi.fn()}
      />
    );
    expect(screen.getByText("No comments yet. Be the first to comment!")).toBeDefined();
  });

  it("render comment and like click handling", () => {
    const mockLike = vi.fn();
    const mockCreate = vi.fn();
    const comment = {
      id: "1",
      postId: 1,
      user: "user",
      content: "Test comment",
      createdAt: new Date().toISOString(),
      liked: false,
      likeCount: 2,
    };
    
    renderProviders(
      <UnwrappedComments
        initialComments={[comment]}
        postFocusId={1}
        likePostRequest={mockLike}
        createCommentRequest={mockCreate}
      />
    );

    expect(screen.getByText("@user")).toBeDefined();
    expect(screen.getByText("Test comment")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    fireEvent.click(screen.getByRole("group"));
    expect(mockLike).toHaveBeenCalledWith(1, "1");
  });

  it("submit new comment", () => {
    const mockLike = vi.fn();
    const mockCreate = vi.fn();
    renderProviders(
      <UnwrappedComments
        initialComments={[]}
        postFocusId={5}
        likePostRequest={mockLike}
        createCommentRequest={mockCreate}
      />
    );

    const input = screen.getAllByPlaceholderText("Add a comment...")[0];
    fireEvent.change(input, { target: { value: "New comment test" } });
    expect(input.value).toBe("New comment test");

    const sendBtn = screen.getAllByRole("button", { name: /send comment/i })[0];
    fireEvent.click(sendBtn);

    expect(mockCreate).toHaveBeenCalledWith({ post_id: 5, content: "New comment test" });
    expect(input.value).toBe("");
  });
});