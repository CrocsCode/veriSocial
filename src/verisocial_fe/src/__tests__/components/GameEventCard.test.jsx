import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import GameEventCard from "../../components/GameEventCard";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

const UnwrappedGameEventCard = GameEventCard.WrappedComponent || GameEventCard;

describe("GameEventCard Component", () => {
  const postId = 99;
  const botImage = "bot.png";
  const humanImage = "human.png";

  it("renders question with 2 images", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);

    renderProviders(
      <UnwrappedGameEventCard
        postId={postId}
        botImage={botImage}
        humanImage={humanImage}
        clearGameEvent={vi.fn()}
      />
    );

    expect(screen.getByText("Which one is AI generated?")).toBeDefined();
    const optionA = screen.getByAltText("Option A");
    const optionB = screen.getByAltText("Option B");
    expect(optionA.getAttribute("src")).toBe(botImage);
    expect(optionB.getAttribute("src")).toBe(humanImage);
  });

  it("call clearGameEvent after clicking option", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);
    const mockClear = vi.fn();
    vi.useFakeTimers(); // delay

    renderProviders(
      <UnwrappedGameEventCard
        postId={postId}
        botImage={botImage}
        humanImage={humanImage}
        clearGameEvent={mockClear}
      />
    );

    fireEvent.click(screen.getByAltText("Option A"));
    vi.advanceTimersByTime(1500);
    vi.advanceTimersByTime(300);
    expect(mockClear).toHaveBeenCalledWith(postId);
  });
});
