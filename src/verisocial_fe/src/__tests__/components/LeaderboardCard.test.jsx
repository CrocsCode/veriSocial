import { screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderProviders } from "../../utils/renderProviders";
import LeaderboardCard from "../../components/LeaderboardCard";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const Unwrapped = LeaderboardCard.WrappedComponent || LeaderboardCard;

describe("LeaderboardCard Component", () => {
  it("call loadLeaderboardListRequest on load", () => {
    const mockLoad = vi.fn();
    renderProviders(
      <Unwrapped
        leaderboardList={[]}
        userRank={null}
        loadLeaderboardListRequest={mockLoad} />
    );
    expect(mockLoad).toHaveBeenCalled();
  });

  it("shows N/A when no userRank", () => {
    renderProviders(
      <Unwrapped
        leaderboardList={[]}
        userRank={null}
        loadLeaderboardListRequest={vi.fn()} />
    );
    expect(screen.getByText("Your rank:")).toBeDefined();
    expect(screen.getByText("N/A")).toBeDefined();
  });

  it("renders top 3 users and display user rank", () => {
    const list = [
      { position: 2, correct_count: 2, user_id: 22, username: 'user2' },
      { position: 1, correct_count: 3, user_id: 11, username: 'user1' },
      { position: 3, correct_count: 1, user_id: 33, username: 'user3' },
    ];
    const userRank = { position: 2, correct_count: 2, user_id: 22 };

    renderProviders(
      <Unwrapped leaderboardList={list} userRank={userRank} loadLeaderboardListRequest={vi.fn()} />
    );

    expect(screen.getByText('user1')).toBeDefined();
    expect(screen.getByText('user2')).toBeDefined();
    expect(screen.getByText('user3')).toBeDefined();
    expect(screen.getByText('#2')).toBeDefined();
  });
});
