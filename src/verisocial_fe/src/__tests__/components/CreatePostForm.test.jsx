import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import CreatePostForm from "../../components/CreatePostForm";
import { updateCreatePostForm, submitCreatePostFormRequest, submitCreatePostFormSuccess } from "../../redux/actionCreators/createPostActionCreators";

describe("Create Post Form", () => {
  it("Text Input and Submit test", async () => {
    const preloadedState = {
      createPost: { postText: "", image: null, isLoading: false },
    };
    const mockOnClose = vi.fn();
    const { store } = renderProviders(
      <CreatePostForm onClose={mockOnClose} />,
      { preloadedState }
    );

    const textArea = screen.getByPlaceholderText("What's on your mind?");
    expect(textArea).toBeDefined();

    fireEvent.change(textArea, { target: { value: "Test Post" } });
    store.dispatch(updateCreatePostForm("postText", "Test Post"));
    expect(store.getState().createPost.postText).toBe("Test Post");

    const postButton = screen.getByText("Post");
    fireEvent.click(postButton);

    store.dispatch(submitCreatePostFormRequest());
    store.dispatch(submitCreatePostFormSuccess({ postText: "Test Post", image: null }));

    await waitFor(() => {
      expect(store.getState().createPost.postText).toBe("");
    });
  });
});
