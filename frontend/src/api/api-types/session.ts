export type SessionStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export interface TrackingSession {
  id: string;
  category: string;
  primaryBrand: string;
  competitors: string[];
  brands: string[]; // All brands for backward compatibility
  status: SessionStatus;
  createdAt: string;
  completedAt?: string;
}

export interface MetricsSummary {
  overallVisibility: number;
  citationShare: Record<string, number>;
  totalResponses: number;
}

export interface SessionResults {
  session: TrackingSession;
  metrics: MetricsSummary;
  prompts: PromptResult[];
  responses: AIResponse[];
  mentions: BrandMention[];
  citations: Citation[];
}

export interface PromptResult {
  id: string;
  sessionId: string;
  promptText: string;
  createdAt: string;
}

export interface AIResponse {
  id: string;
  promptId: string;
  sessionId: string;
  rawResponse: string;
  platform: string;
  createdAt: string;
}

export interface BrandMention {
  id: string;
  responseId: string;
  sessionId: string;
  promptId: string;
  brandName: string;
  mentionCount: number;
  context: string | null;
}

export interface Citation {
  id: string;
  responseId: string;
  sessionId: string;
  url: string;
  title: string | null;
  domain: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  brand: string;
  visibilityScore: number;
  citationShare: number;
  mentionCount: number;
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
