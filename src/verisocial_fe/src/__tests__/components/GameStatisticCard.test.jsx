import { screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import GameStatisticCard from "../../components/GameStatisticCard";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const UnwrappedGameStatisticCard = GameStatisticCard.WrappedComponent || GameStatisticCard;

describe("GameStatisticCard Component", () => {
  it("call loadGameEventListRequest on mount", () => {
    const mockLoad = vi.fn();
    renderProviders(
      <UnwrappedGameStatisticCard events={[]} loadGameEventListRequest={mockLoad} />
    );
    expect(mockLoad).toHaveBeenCalledTimes(1);
  });

  it("render correct percentage", () => {
    const events = [
      { event_id: 1, is_correct: true },
      { event_id: 2, is_correct: false },
      { event_id: 3, is_correct: true },
    ];
    renderProviders(
      <UnwrappedGameStatisticCard
        events={events}
        loadGameEventListRequest={vi.fn()}
      />
    );

    expect(screen.getByText("67%"));
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined();
  });
});
