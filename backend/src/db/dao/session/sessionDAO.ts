import { pool } from "../../dbClient";
import { TrackingSession, DraftSession, SessionStatus } from "./types";

interface SessionRow {
  id: string;
  category: string;
  primary_brand: string;
  competitors: string[];
  brands: string[];
  status: SessionStatus;
  created_at: string;
  completed_at?: string;
  total_prompts: number;
}

const mapRowToSession = (row: SessionRow): TrackingSession => ({
  id: row.id,
  category: row.category,
  primaryBrand: row.primary_brand,
  competitors: row.competitors || [],
  brands: row.brands,
  status: row.status,
  createdAt: row.created_at,
  completedAt: row.completed_at,
  totalPrompts: row.total_prompts,
});

export const createSession = async (
  session: DraftSession
): Promise<TrackingSession> => {
  const { category, primaryBrand, competitors, brands, totalPrompts } = session;

  const result = await pool.query<SessionRow>(
    `INSERT INTO tracking_session (category, primary_brand, competitors, brands, total_prompts)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [category, primaryBrand, competitors, brands, totalPrompts || 0]
  );

  return mapRowToSession(result.rows[0]);
};

export const getSessionById = async (
  id: string
): Promise<TrackingSession | undefined> => {
  const result = await pool.query<SessionRow>(
    `SELECT * FROM tracking_session WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  return mapRowToSession(result.rows[0]);
};

export const updateSessionStatus = async (
  id: string,
  status: SessionStatus,
  completedAt?: string
): Promise<TrackingSession | undefined> => {
  const result = await pool.query<SessionRow>(
    `UPDATE tracking_session
     SET status = $1, completed_at = $2
     WHERE id = $3
     RETURNING *`,
    [status, completedAt, id]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  return mapRowToSession(result.rows[0]);
};

export const deleteSession = async (id: string): Promise<void> => {
  await pool.query(`DELETE FROM tracking_session WHERE id = $1`, [id]);
};

export const getSessionWithResponseCount = async (
  id: string
): Promise<
  | {
      session: TrackingSession;
      responseCount: number;
    }
  | undefined
> => {
  const result = await pool.query<SessionRow & { response_count: string }>(
    `SELECT s.*, COUNT(r.id) as response_count
     FROM tracking_session s
     LEFT JOIN ai_response r ON s.id = r.session_id
     WHERE s.id = $1
     GROUP BY s.id`,
    [id]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  return {
    session: mapRowToSession(result.rows[0]),
    responseCount: parseInt(result.rows[0].response_count) || 0,
  };
};

export const getRecentSessions = async (
  limit: number = 10
): Promise<TrackingSession[]> => {
  const result = await pool.query<SessionRow>(
    `SELECT * FROM tracking_session
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map(mapRowToSession);
};
