import { screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import ProfileCard from "../../components/ProfileCard";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const UnwrappedProfileCard = ProfileCard.WrappedComponent || ProfileCard;

describe("ProfileCard Component", () => {
  const user = {
    user_id: 1,
    full_name: "FullName test",
    username: "usernametest",
    bot_score: 0,
  };

  it("render full name and username", () => {
    renderProviders(
      <UnwrappedProfileCard user={user} userRequest={vi.fn()} />
    );

    expect(screen.getByText(user.full_name)).toBeDefined();
    expect(screen.getByText(`@${user.username}`)).toBeDefined();
  });

  it("calls userRequest if userID", () => {
    const mockRequest = vi.fn();
    renderProviders(
      <UnwrappedProfileCard
        user={user}
        userRequest={mockRequest} />
    );

    expect(mockRequest).toHaveBeenCalledWith(user.user_id);
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });
});
