import { pool } from "../../dbClient";
import { Prompt, DraftPrompt } from "./types";

interface PromptRow {
  id: string;
  session_id: string;
  prompt_text: string;
  created_at: string;
}

const mapRowToPrompt = (row: PromptRow): Prompt => ({
  id: row.id,
  sessionId: row.session_id,
  promptText: row.prompt_text,
  createdAt: row.created_at,
});

export const createPrompt = async (prompt: DraftPrompt): Promise<Prompt> => {
  const { sessionId, promptText } = prompt;

  const result = await pool.query<PromptRow>(
    `INSERT INTO prompt (session_id, prompt_text)
     VALUES ($1, $2)
     RETURNING *`,
    [sessionId, promptText]
  );

  return mapRowToPrompt(result.rows[0]);
};

export const createPromptsBatch = async (
  prompts: DraftPrompt[]
): Promise<Prompt[]> => {
  if (prompts.length === 0) return [];

  const values: any[] = [];
  const placeholders: string[] = [];

  prompts.forEach((prompt, index) => {
    const offset = index * 2;
    placeholders.push(`($${offset + 1}, $${offset + 2})`);
    values.push(prompt.sessionId, prompt.promptText);
  });

  const result = await pool.query<PromptRow>(
    `INSERT INTO prompt (session_id, prompt_text)
     VALUES ${placeholders.join(", ")}
     RETURNING *`,
    values
  );

  return result.rows.map(mapRowToPrompt);
};

export const getPromptById = async (
  id: string
): Promise<Prompt | undefined> => {
  const result = await pool.query<PromptRow>(
    `SELECT * FROM prompt WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  return mapRowToPrompt(result.rows[0]);
};

export const getPromptsBySessionId = async (
  sessionId: string
): Promise<Prompt[]> => {
  const result = await pool.query<PromptRow>(
    `SELECT * FROM prompt WHERE session_id = $1 ORDER BY created_at ASC`,
    [sessionId]
  );

  return result.rows.map(mapRowToPrompt);
};
