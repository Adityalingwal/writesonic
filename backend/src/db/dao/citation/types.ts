// Citation types
export interface Citation {
  id: string;
  responseId: string;
  sessionId: string;
  url: string;
  title?: string;
  domain?: string;
  createdAt: string;
}

export type DraftCitation = Omit<Citation, "id" | "createdAt">;
