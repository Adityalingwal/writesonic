export interface StartTrackingRequest {
  category: string;
  myBrand: string;
  competitors: string[];
  customPrompts?: string[];
}

export interface StartTrackingResponse {
  sessionId: string;
  status: "started";
  totalPrompts: number;
  message: string;
}

export interface GetSessionStatusResponse {
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  progress: number;
  totalPrompts: number;
  completedResponses: number;
  createdAt: string;
  completedAt?: string;
}

export interface StopTrackingResponse {
  sessionId: string;
  status: string;
  message: string;
}
