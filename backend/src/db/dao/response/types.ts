export type Platform = "CHATGPT";

export interface AIResponse {
  id: string;
  promptId: string;
  sessionId: string;
  rawResponse: string;
  platform: Platform;
  createdAt: string;
}

export type DraftResponse = Omit<AIResponse, "id" | "createdAt">;
