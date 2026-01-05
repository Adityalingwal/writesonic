export interface Prompt {
  id: string;
  sessionId: string;
  promptText: string;
  createdAt: string;
}

export type DraftPrompt = Omit<Prompt, "id" | "createdAt">;
