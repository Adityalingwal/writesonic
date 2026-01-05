import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { trackingRouterConfig } from "./routes/tracking";
import { resultsRouterConfig } from "./routes/results";

import { restRouteHandler, isAppError } from "./middleware/routeHandler";
import { RouteConfig } from "./api-types/api-types";
import { initWorkers } from "./workers/worker";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use("/api/tracking", trackingRouterConfig.router);
app.use("/api/results", resultsRouterConfig.router);

const routeConfigs: RouteConfig[] = [trackingRouterConfig, resultsRouterConfig];

routeConfigs.forEach((routeConfig) => {
  Object.entries(routeConfig.endpoints).forEach(([route, endpointConfig]) => {
    const { method } = endpointConfig;
    if (method === "get") {
      routeConfig.router.get(route, restRouteHandler(endpointConfig));
    } else if (method === "delete") {
      routeConfig.router.delete(route, restRouteHandler(endpointConfig));
    } else {
      routeConfig.router.post(route, restRouteHandler(endpointConfig));
    }
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  const statusCode = isAppError(err) ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Resource not found" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  initWorkers();
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason);
});
