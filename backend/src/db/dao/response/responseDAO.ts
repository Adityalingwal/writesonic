import { pool } from "../../dbClient";
import { AIResponse, DraftResponse, Platform } from "./types";

interface ResponseRow {
  id: string;
  prompt_id: string;
  session_id: string;
  raw_response: string;
  platform: Platform;
  created_at: string;
}

const mapRowToResponse = (row: ResponseRow): AIResponse => ({
  id: row.id,
  promptId: row.prompt_id,
  sessionId: row.session_id,
  rawResponse: row.raw_response,
  platform: row.platform,
  createdAt: row.created_at,
});

export const createResponse = async (
  response: DraftResponse
): Promise<AIResponse> => {
  const { promptId, sessionId, rawResponse, platform } = response;

  const result = await pool.query<ResponseRow>(
    `INSERT INTO ai_response (prompt_id, session_id, raw_response, platform)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [promptId, sessionId, rawResponse, platform]
  );

  return mapRowToResponse(result.rows[0]);
};

export const getResponsesBySessionId = async (
  sessionId: string
): Promise<AIResponse[]> => {
  const result = await pool.query<ResponseRow>(
    `SELECT * FROM ai_response WHERE session_id = $1 ORDER BY created_at ASC`,
    [sessionId]
  );

  return result.rows.map(mapRowToResponse);
};

export const getResponsesByPromptId = async (
  promptId: string
): Promise<AIResponse[]> => {
  const result = await pool.query<ResponseRow>(
    `SELECT * FROM ai_response WHERE prompt_id = $1`,
    [promptId]
  );

  return result.rows.map(mapRowToResponse);
};

export const getResponseCountBySession = async (
  sessionId: string
): Promise<number> => {
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*) as count FROM ai_response WHERE session_id = $1`,
    [sessionId]
  );

  return parseInt(result.rows[0].count) || 0;
};
