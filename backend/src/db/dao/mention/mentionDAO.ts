import { pool } from "../../dbClient";
import { BrandMention, DraftMention } from "./types";

interface MentionRow {
  id: string;
  response_id: string;
  session_id: string;
  prompt_id: string;
  brand_name: string;
  mention_count: number;
  context?: string;
  created_at: string;
}

const mapRowToMention = (row: MentionRow): BrandMention => ({
  id: row.id,
  responseId: row.response_id,
  sessionId: row.session_id,
  promptId: row.prompt_id,
  brandName: row.brand_name,
  mentionCount: row.mention_count,
  context: row.context,
  createdAt: row.created_at,
});

export const createMentionsBatch = async (
  mentions: DraftMention[]
): Promise<BrandMention[]> => {
  if (mentions.length === 0) return [];

  const values: any[] = [];
  const placeholders: string[] = [];

  mentions.forEach((mention, index) => {
    const offset = index * 6;
    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${
        offset + 5
      }, $${offset + 6})`
    );
    values.push(
      mention.responseId,
      mention.sessionId,
      mention.promptId,
      mention.brandName,
      mention.mentionCount,
      mention.context || null
    );
  });

  const result = await pool.query<MentionRow>(
    `INSERT INTO brand_mention (response_id, session_id, prompt_id, brand_name, mention_count, context)
     VALUES ${placeholders.join(", ")}
     RETURNING *`,
    values
  );

  return result.rows.map(mapRowToMention);
};

export const getMentionsBySessionId = async (
  sessionId: string
): Promise<BrandMention[]> => {
  const result = await pool.query<MentionRow>(
    `SELECT * FROM brand_mention WHERE session_id = $1 ORDER BY created_at ASC`,
    [sessionId]
  );

  return result.rows.map(mapRowToMention);
};

export const getMentionsByResponseId = async (
  responseId: string
): Promise<BrandMention[]> => {
  const result = await pool.query<MentionRow>(
    `SELECT * FROM brand_mention WHERE response_id = $1`,
    [responseId]
  );

  return result.rows.map(mapRowToMention);
};
