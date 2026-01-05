import { Router } from "express";
import {
  startTracking,
  getSessionStatus,
  stopTracking,
} from "../services/tracking/tracking-service";
import {
  StartTrackingRequest,
  StartTrackingResponse,
  GetSessionStatusRequest,
  GetSessionStatusResponse,
  StopTrackingRequest,
  StopTrackingResponse,
  RouteConfig,
} from "../api-types/api-types";
import { AppError } from "../middleware/routeHandler";

const trackingRouter = Router();

async function startTrackingHandler(
  req: StartTrackingRequest
): Promise<StartTrackingResponse> {
  const { category, myBrand, competitors, customPrompts } = req;

  if (!category) {
    throw AppError("category is required");
  }

  if (!myBrand) {
    throw AppError("myBrand is required");
  }

  if (!competitors || competitors.length === 0) {
    throw AppError("at least one competitor is required");
  }

  const result = await startTracking({
    category,
    myBrand,
    competitors,
    customPrompts,
  });

  return {
    sessionId: result.sessionId,
    status: "started",
    totalPrompts: result.totalPrompts,
    message: "Tracking session started successfully",
  };
}

async function getSessionStatusHandler(
  req: GetSessionStatusRequest
): Promise<GetSessionStatusResponse> {
  const { sessionId } = req;

  if (!sessionId) {
    throw AppError("sessionId is required");
  }

  const status = await getSessionStatus(sessionId);

  if (!status) {
    throw AppError("Session not found", 404);
  }

  return status;
}

async function stopTrackingHandler(
  req: StopTrackingRequest
): Promise<StopTrackingResponse> {
  const { sessionId } = req;

  if (!sessionId) {
    throw AppError("sessionId is required");
  }

  const session = await stopTracking(sessionId);

  if (!session) {
    throw AppError("Session not found", 404);
  }

  return {
    sessionId: session.id,
    status: "stopped",
    message: "Tracking session stopped",
  };
}

export const trackingRouterConfig: RouteConfig = {
  router: trackingRouter,
  endpoints: {
    "/start": {
      handler: startTrackingHandler,
      method: "post",
    },
    "/:sessionId/status": {
      handler: getSessionStatusHandler,
      method: "get",
    },
    "/:sessionId/stop": {
      handler: stopTrackingHandler,
      method: "post",
    },
  },
};
