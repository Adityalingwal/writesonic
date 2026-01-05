export interface BrandMention {
  id: string;
  responseId: string;
  sessionId: string;
  promptId: string;
  brandName: string;
  mentionCount: number;
  context?: string;
  createdAt: string;
}

export type DraftMention = Omit<BrandMention, "id" | "createdAt">;
