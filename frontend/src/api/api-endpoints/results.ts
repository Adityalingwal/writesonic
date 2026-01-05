import { apiClient } from "../client";
import {
  SessionResults,
  GetLeaderboardResponse,
  GetPromptsResponse,
  GetPromptDetailResponse,
  CompetitiveMatrixResponse,
} from "../api-types";

export const resultsApi = {
  getResults: async (sessionId: string): Promise<SessionResults> => {
    return apiClient.get(`/api/results/${sessionId}`);
  },

  getLeaderboard: async (
    sessionId: string
  ): Promise<GetLeaderboardResponse> => {
    return apiClient.get(`/api/results/${sessionId}/leaderboard`);
  },

  getPrompts: async (sessionId: string): Promise<GetPromptsResponse> => {
    return apiClient.get(`/api/results/${sessionId}/prompts`);
  },

  getPromptDetail: async (
    sessionId: string,
    promptId: string
  ): Promise<GetPromptDetailResponse> => {
    return apiClient.get(`/api/results/${sessionId}/prompt/${promptId}`);
  },

  getRecent: async (): Promise<{ sessions: any[] }> => {
    return apiClient.get("/api/results/recent");
  },

  deleteSession: async (sessionId: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/api/results/${sessionId}/delete`);
  },

  getCompetitiveMatrix: async (
    sessionId: string
  ): Promise<CompetitiveMatrixResponse> => {
    return apiClient.get(`/api/results/${sessionId}/competitive-matrix`);
  },
};
