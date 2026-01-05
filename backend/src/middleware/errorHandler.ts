import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  const response: Record<string, unknown> = { error: message };

  if (process.env.NODE_ENV === "development" && err.stack) {
    response.stack = err.stack;
  }

  if (err.details) {
    response.details = err.details;
  }

  return res.status(statusCode).json(response);
}

export function notFoundHandler(_req: Request, res: Response): Response {
  return res.status(404).json({ error: "Resource not found" });
}
