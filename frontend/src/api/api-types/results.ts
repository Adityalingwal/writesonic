import {
  SessionResults,
  PromptResult,
  AIResponse,
  LeaderboardEntry,
} from "./session";

export interface GetResultsResponse extends SessionResults {}

export interface GetLeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

export interface GetPromptsResponse {
  prompts: PromptResult[];
}

export interface GetPromptDetailResponse {
  prompt: PromptResult;
  responses: AIResponse[];
}
