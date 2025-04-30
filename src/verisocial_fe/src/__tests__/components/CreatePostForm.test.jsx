import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import CreatePostForm from "../../components/CreatePostForm";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const UnwrappedCreatePostForm = CreatePostForm.WrappedComponent || CreatePostForm;

describe("CreatePostForm Component", () => {
  const baseProps = {
    postText: "",
    onClose: vi.fn(),
    isLoading: false,
    isSuccess: false,
    submitCreatePostFormRequest: vi.fn(),
    resetCreatePostForm: vi.fn(),
  };

  it("enable post button when there is content", () => {
    renderProviders(<UnwrappedCreatePostForm {...baseProps} />);

    const postButton = screen.getByRole("button", { name: /post/i });
    const textarea = screen.getByRole("textbox");
    expect(postButton.disabled).toBe(true);

    fireEvent.change(textarea, { target: { value: "Hello World" } });
    expect(postButton.disabled).toBe(false);

    fireEvent.click(postButton);
    expect(baseProps.submitCreatePostFormRequest).toHaveBeenCalledWith("Hello World", null);
  });

  it("closes when cancel is clicked", () => {
    renderProviders(<UnwrappedCreatePostForm {...baseProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(baseProps.resetCreatePostForm).toHaveBeenCalled();
    expect(baseProps.onClose).toHaveBeenCalled();
  });
});
