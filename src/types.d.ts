import { instance } from './serverMethods';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ResponseCode = 200 | 201 | 204 | 400 | 404;
type ResponseActionBasic = () => void;
type ResponseActionUser = (...data: string[]) => string;
type ResponseAction = ResponseActionBasic | ResponseActionUser;
type Response = { code: ResponseCode; result: ResponseAction };
type SchemaConditionBasic = () => boolean;
type SchemaConditionUser = (...data: string[]) => boolean;
type SchemaCondition = SchemaConditionBasic | SchemaConditionUser;
type Schema = {
  method: Methods;
  endpoint: string;
  case: SchemaCondition;
  variables: string[];
  values: string[];
  body?: string;
  response: Response;
};
type Http = ReturnType<typeof instance> | undefined;
type Search = <T>(array: T[], index: number, defaultIndex: number = 0) => T;
type ActionFunction = (_: http.IncomingMessage, response: http.ServerResponse) => void;
type Action = {
  name: string;
  action: ActionFunction;
};
type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export {
  User,
  Schema,
  Methods,
  Response,
  ResponseAction,
  SchemaCondition,
  Http,
  Search,
  Action,
  ActionFunction,
};
