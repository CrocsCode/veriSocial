export const getBotScoreLevel = (score) =>
    score != null ? Math.max(1, Math.ceil(score * 5)) : 1;

export const getFormattedBotScore = (score) =>
    score != null ? score.toFixed(3) : "N/A";

export const botScoreColors = {
    1: "#7ABD7E",
    2: "#b6d7a8",
    3: "#F8D66D",
    4: "#FFB54C",
    5: "#e06666",
};
