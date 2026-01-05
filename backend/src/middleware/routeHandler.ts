import { Request, Response, NextFunction } from "express";
import { RestEndpointConfig } from "../api-types/api-types";

export interface AppErrorType extends Error {
  statusCode: number;
}

export const createAppError = (
  message: string,
  statusCode: number = 400
): AppErrorType => {
  const error = new Error(message) as AppErrorType;
  error.statusCode = statusCode;
  error.name = "AppError";
  return error;
};

export const isAppError = (error: unknown): error is AppErrorType => {
  return error instanceof Error && "statusCode" in error;
};

export const AppError = createAppError;

export const restRouteHandler = (endpointConfig: RestEndpointConfig) => [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = {
        ...req.body,
        ...req.params,
        ...req.query,
      };

      const response = await endpointConfig.handler(body);
      res.json(response);
    } catch (e) {
      next(e);
    }
  },
];
