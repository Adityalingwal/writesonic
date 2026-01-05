import { Router } from "express";

export interface StartTrackingRequest {
  category: string;
  myBrand: string;
  competitors: string[];
  customPrompts?: string[];
}

export interface StartTrackingResponse {
  sessionId: string;
  status: string;
  totalPrompts: number;
  message: string;
}

export interface GetSessionStatusRequest {
  sessionId: string;
}

export interface GetSessionStatusResponse {
  status: string;
  progress: number;
  totalPrompts: number;
  completedResponses: number;
  createdAt: string;
  completedAt?: string;
}

export interface StopTrackingRequest {
  sessionId: string;
}

export interface StopTrackingResponse {
  sessionId: string;
  status: string;
  message: string;
}

export interface GetResultsRequest {
  sessionId: string;
}

export interface GetLeaderboardRequest {
  sessionId: string;
}

export interface LeaderboardEntry {
  rank: number;
  brand: string;
  visibilityScore: number;
  citationShare: number;
  mentionCount: number;
}

export interface GetLeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

export interface BrandPerformance {
  mentionCount: number;
  isPresent: boolean;
  isWinner: boolean;
  context: string | null;
}

export interface PromptMatrixEntry {
  promptId: string;
  promptText: string;
  brandPerformance: Record<string, BrandPerformance>;
  winner: string | null;
}

export interface BrandAggregatedStats {
  totalMentions: number;
  promptsWon: number;
  promptsPresent: number;
  promptsMissed: number;
  citationShare: number;
}

export interface CompetitiveMatrixResponse {
  matrix: PromptMatrixEntry[];
  aggregatedStats: Record<string, BrandAggregatedStats>;
  brands: string[];
  totalPrompts: number;
}

export interface GetCompetitiveMatrixRequest {
  sessionId: string;
}

export interface RestEndpointConfig {
  handler: (body: any) => Promise<any>;
  method?: "get" | "post" | "delete";
}

export interface RouteConfig {
  router: Router;
  endpoints: {
    [index: string]: RestEndpointConfig;
  };
}
