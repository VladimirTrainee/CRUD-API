import cluster from 'node:cluster';
import http from 'node:http';
import { getThreadsToFork } from './threads';
import { serverProcess } from './serverMethods';

const countWorkers = Object.keys(cluster.workers ?? {}).length;
const { port } = getThreadsToFork(countWorkers);

if (cluster.isPrimary) {
  const callback = (req: http.IncomingMessage, res: http.ServerResponse) => {
    let body: string = '';
    req.on('data', (data) => {
      body += String(data);
    });
    req.on('end', () => {
      serverProcess(req, res, body);
    });
  };
  http.createServer(callback).listen(port);
}
