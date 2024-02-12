import dotenv from 'dotenv';
import { availableParallelism } from 'node:os';

const getThreadsToFork = (availThreads: number) => {
  const env = process.env.NODE_ENV;
  dotenv.config({ path: `.env.${env}` });
  const basePort = Number(process.env.PORT || 2000);

  const maxThreads = process.env.MAX_THREADS;
  const limitThreads = availableParallelism();

  const countThreads: number = Number(maxThreads) || limitThreads;
  const maxThread = countThreads - 1;
  const nextPort = (
    currentPort: number = basePort,
    maxWorkerPorts: number = maxThread,
    base = basePort
  ) => {
    return base + ((currentPort + 1 - base) % maxWorkerPorts);
  };
  return { port: basePort, current: availThreads, max: maxThread, nextPort };
};

export { getThreadsToFork };
