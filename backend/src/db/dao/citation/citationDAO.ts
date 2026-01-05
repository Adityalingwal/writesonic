import { pool } from "../../dbClient";
import { Citation, DraftCitation } from "./types";

// Snake case type for DB rows
interface CitationRow {
  id: string;
  response_id: string;
  session_id: string;
  url: string;
  title?: string;
  domain?: string;
  created_at: string;
}

// Map DB row to TypeScript object
const mapRowToCitation = (row: CitationRow): Citation => ({
  id: row.id,
  responseId: row.response_id,
  sessionId: row.session_id,
  url: row.url,
  title: row.title,
  domain: row.domain,
  createdAt: row.created_at,
});

export const createCitationsBatch = async (
  citations: DraftCitation[]
): Promise<Citation[]> => {
  if (citations.length === 0) return [];

  const values: any[] = [];
  const placeholders: string[] = [];

  citations.forEach((citation, index) => {
    const offset = index * 5;
    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${
        offset + 5
      })`
    );
    values.push(
      citation.responseId,
      citation.sessionId,
      citation.url,
      citation.title || null,
      citation.domain || null
    );
  });

  const result = await pool.query<CitationRow>(
    `INSERT INTO citation (response_id, session_id, url, title, domain)
     VALUES ${placeholders.join(", ")}
     RETURNING *`,
    values
  );

  return result.rows.map(mapRowToCitation);
};

export const getCitationsBySessionId = async (
  sessionId: string
): Promise<Citation[]> => {
  const result = await pool.query<CitationRow>(
    `SELECT * FROM citation WHERE session_id = $1 ORDER BY created_at ASC`,
    [sessionId]
  );

  return result.rows.map(mapRowToCitation);
};
