import { Router } from "express";
import {
  getTrackingResults,
  getLeaderboard,
  getCompetitiveMatrix,
  CompetitiveMatrixResult,
} from "../services/tracking/tracking-service";
import { getPromptsBySessionId } from "../db/dao/prompt/promptDAO";
import { getPromptById } from "../db/dao/prompt/promptDAO";
import { getMentionsByResponseId } from "../db/dao/mention/mentionDAO";
import { getResponsesByPromptId } from "../db/dao/response/responseDAO";
import { getRecentSessions, deleteSession } from "../db/dao/session/sessionDAO";
import {
  GetResultsRequest,
  GetLeaderboardRequest,
  GetLeaderboardResponse,
  GetCompetitiveMatrixRequest,
  CompetitiveMatrixResponse,
  RouteConfig,
} from "../api-types/api-types";
import { AppError } from "../middleware/routeHandler";

const resultsRouter = Router();

async function getResultsHandler(req: GetResultsRequest): Promise<any> {
  const { sessionId } = req;

  if (!sessionId) {
    throw AppError("sessionId is required");
  }

  const results = await getTrackingResults(sessionId);

  if (!results) {
    throw AppError("Session not found", 404);
  }

  return {
    session: {
      id: results.session.id,
      category: results.session.category,
      brands: results.session.brands,
      status: results.session.status,
      createdAt: results.session.createdAt,
      completedAt: results.session.completedAt,
    },
    metrics: results.metrics,
    prompts: results.prompts,
    responses: results.responses,
    mentions: results.mentions,
    citations: results.citations,
  };
}

async function getLeaderboardHandler(
  req: GetLeaderboardRequest
): Promise<GetLeaderboardResponse> {
  const { sessionId } = req;

  if (!sessionId) {
    throw AppError("sessionId is required");
  }

  const leaderboard = await getLeaderboard(sessionId);

  return { leaderboard };
}

async function getPromptsHandler(req: {
  sessionId: string;
  brand?: string;
}): Promise<any> {
  const { sessionId } = req;

  if (!sessionId) {
    throw AppError("sessionId is required");
  }

  const prompts = await getPromptsBySessionId(sessionId);

  return { prompts };
}

async function getPromptDetailHandler(req: {
  sessionId: string;
  promptId: string;
}): Promise<any> {
  const { promptId } = req;

  if (!promptId) {
    throw AppError("promptId is required");
  }

  const prompt = await getPromptById(promptId);

  if (!prompt) {
    throw AppError("Prompt not found", 404);
  }

  const responses = await getResponsesByPromptId(promptId);

  const responsesWithMentions = await Promise.all(
    responses.map(async (response) => ({
      ...response,
      mentions: await getMentionsByResponseId(response.id),
    }))
  );

  return {
    prompt,
    responses: responsesWithMentions,
  };
}

async function getRecentSessionsHandler(): Promise<any> {
  const sessions = await getRecentSessions(10);
  return { sessions };
}

async function deleteSessionHandler(req: { sessionId: string }): Promise<any> {
  const { sessionId } = req;

  if (!sessionId) {
    throw AppError("sessionId is required");
  }

  await deleteSession(sessionId);
  return { success: true, message: "Session deleted successfully" };
}

async function getCompetitiveMatrixHandler(
  req: GetCompetitiveMatrixRequest
): Promise<CompetitiveMatrixResponse> {
  const { sessionId } = req;

  if (!sessionId) {
    throw AppError("sessionId is required");
  }

  const result = await getCompetitiveMatrix(sessionId);

  if (!result) {
    throw AppError("Session not found", 404);
  }

  return result;
}

export const resultsRouterConfig: RouteConfig = {
  router: resultsRouter,
  endpoints: {
    "/recent": {
      handler: getRecentSessionsHandler,
      method: "get",
    },
    "/:sessionId": {
      handler: getResultsHandler,
      method: "get",
    },
    "/:sessionId/leaderboard": {
      handler: getLeaderboardHandler,
      method: "get",
    },
    "/:sessionId/prompts": {
      handler: getPromptsHandler,
      method: "get",
    },
    "/:sessionId/prompt/:promptId": {
      handler: getPromptDetailHandler,
      method: "get",
    },
    "/:sessionId/delete": {
      handler: deleteSessionHandler,
      method: "delete",
    },
    "/:sessionId/competitive-matrix": {
      handler: getCompetitiveMatrixHandler,
      method: "get",
    },
  },
};
