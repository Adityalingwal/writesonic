import { apiClient } from "../client";
import {
  StartTrackingRequest,
  StartTrackingResponse,
  GetSessionStatusResponse,
  StopTrackingResponse,
} from "../api-types";

export const trackingApi = {
  start: async (data: StartTrackingRequest): Promise<StartTrackingResponse> => {
    return apiClient.post("/api/tracking/start", data);
  },

  getStatus: async (sessionId: string): Promise<GetSessionStatusResponse> => {
    return apiClient.get(`/api/tracking/${sessionId}/status`);
  },

  stop: async (sessionId: string): Promise<StopTrackingResponse> => {
    return apiClient.post(`/api/tracking/${sessionId}/stop`);
  },
};
