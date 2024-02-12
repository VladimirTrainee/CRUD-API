import http from 'node:http';
import type { Schema } from './types.d';
import { schema } from './schema';

const filterRequest = (
  request: http.IncomingMessage,
  body = '',
  level: number = 3
): Schema[] | undefined => {
  const result = schema.filter((entity: Schema, index: number) => {
    const methodMatch = entity.method === request.method;
    const urlElements = request.url?.split('/');
    const endpointElements = entity.endpoint.split('/');
    Object(schema[index]).body = JSON.parse(body || '{}');
    schema[index].values = entity.variables.map((variable: string) => {
      const getValue = () => {
        const index = endpointElements.indexOf(`{${variable}}`);
        if (index > -1 && urlElements) {
          const value = urlElements[index];
          if (index > -1 && index < urlElements.length) urlElements[index] = '';
          if (index > -1 && index < endpointElements.length) endpointElements[index] = '';
          return value;
        }
        return '';
      };
      return getValue();
    });
    const endpointResult = endpointElements?.join('/');
    const urlResult = urlElements?.join('/');
    const endpointMatch = endpointResult === urlResult;

    const args = entity.values.slice(0, 1).concat(body);
    const caseMatch = entity.case(...args);

    const levels = [methodMatch, endpointMatch, caseMatch];
    let result = true;
    for (let index = 0; index < Math.min(level, levels.length) && result === true; index++) {
      result = result && levels[index];
    }
    return result;
  });

  return result;
};
const serverProcess = (request: http.IncomingMessage, response: http.ServerResponse, body = '') => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8;');
  const requestSchema = filterRequest(request, body);

  const result = requestSchema ? requestSchema[0] : undefined;
  if (result) {
    const value = [result.values[0], body];
    response.statusCode = result.response.code;
    response.write(result.response.result(...value) ?? `Error: ${result.response.code}`);
  } else {
    response.statusCode = 404;
    response.write('Endpoint not found');
  }
  response.end();
};

const instance = http.createServer;
const newInstance = http.createServer(serverProcess);
const search = <T>(array: T[], index: number, defaultIndex: number = 0): T => {
  if (index > -1 && index < array.length) return array[index];
  return array[defaultIndex];
};
export { search, serverProcess, instance, newInstance };
