export type SessionStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export interface TrackingSession {
  id: string;
  category: string;
  primaryBrand: string;
  competitors: string[];
  brands: string[]; // All brands (primaryBrand + competitors) for backward compatibility
  status: SessionStatus;
  createdAt: string;
  completedAt?: string;
  totalPrompts: number;
}

export type DraftSession = Omit<TrackingSession, "id" | "createdAt" | "status">;
