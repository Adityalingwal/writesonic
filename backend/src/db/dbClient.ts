import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

interface DBVariables {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

function getDBVariables(): DBVariables {
  return {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "ai_visibility_tracker",
    password: process.env.DB_PASSWORD || "password",
    port: parseInt(process.env.DB_PORT || "5432"),
  };
}

const getPoolConfig = (): PoolConfig => {
  const dbVariables = getDBVariables();

  const isProduction = process.env.NODE_ENV === "production";

  return {
    ...dbVariables,
    ...(isProduction && {
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
};

export const pool = new Pool(getPoolConfig());

pool.on("connect", () => {});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err);
});

export const getClient = () => pool.connect();

export default pool;
