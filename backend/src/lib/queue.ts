import { Queue, Worker, Job } from "bullmq";
import redis from "./redis";

export interface AuditJobData {
  sessionId: string;
  prompts: string[];
  brands: string[];
  platforms: string[];
}

export const auditQueue = new Queue("audit", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export async function addAuditJob(
  data: AuditJobData
): Promise<Job<AuditJobData>> {
  return auditQueue.add("audit", data, {
    jobId: `audit-${data.sessionId}`,
  });
}
