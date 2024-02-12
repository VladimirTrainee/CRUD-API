import { Schema, User } from './types.d';
import crypto from 'node:crypto';

const users: User[] = [];

const isValidUser = (user: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(user);
};
const isNotValidUser = (user: string) => !isValidUser(user);
const isExistedUser = (user: string) => users.find(({ id }) => id === user);
const isNotExistedUser = (user: string) => !isExistedUser(user);
const isValidExistedUser = (user: string) => !!isValidUser(user) && !!isExistedUser(user);
const isNotValidExistedUser = (user: string) => !isValidExistedUser(user);

const isValidExistedBody = (body: string) => {
  try {
    const bodyObject = JSON.parse(body);
    const { username, age, hobbies } = bodyObject;
    if (!username || !age || !hobbies || !Array.isArray(hobbies)) return false;
  } catch (error) {
    return false;
  }
  return true;
};
const isNotValidExistedBody = (body: string): boolean => {
  return !isValidExistedBody(body);
};

const getAllUsers = () => {
  return JSON.stringify(users);
};

const getUser = (user: string) => {
  const [result] = users.filter(({ id }) => id === user);
  return JSON.stringify(result);
};

const addUser = (user: string, body: string) => {
  const userObject = JSON.parse(body || '{}');
  const index = users.push({ ...userObject, id: crypto.randomUUID() });
  return JSON.stringify(users[index - 1]);
};

const updateUser = (user: string, body: string) => {
  const userObject = JSON.parse(body || '{}');
  const { username, age, hobbies } = userObject;
  const [result] = users.filter(({ id }) => id === user);
  Object.assign(result, { username, age, hobbies });
  return JSON.stringify(result);
};

const deleteUser = (user: string) => {
  const [result] = users.filter(({ id }) => id === user);
  const index = users.indexOf(result);
  users.splice(index, 1);
  return JSON.stringify(result);
};

const userGetError = () => console.log('user get error');
const userAddError = () => console.log('user add error');
const userUpdateError = () => console.log('user update error');
const userDeleteError = () => console.log('user delete error');

export const schema: Schema[] = [
  {
    method: 'GET',
    endpoint: '/api/users',
    case: () => true,
    variables: [],
    values: [],
    response: { code: 200, result: getAllUsers },
  },
  {
    method: 'GET',
    endpoint: '/api/users/{userId}',
    variables: ['userId'],
    values: [],
    case: isValidExistedUser,
    response: { code: 200, result: getUser },
  },
  {
    method: 'GET',
    endpoint: '/api/users/{userId}',
    variables: ['userId'],
    values: [],
    case: isNotValidUser,
    response: { code: 400, result: userGetError },
  },
  {
    method: 'GET',
    endpoint: '/api/users/{userId}',
    variables: ['userId'],
    values: [],
    case: isNotExistedUser,
    response: { code: 404, result: userGetError },
  },
  {
    method: 'POST',
    endpoint: '/api/users',
    variables: [],
    values: [],
    case: isValidExistedBody,
    response: { code: 201, result: addUser },
  },
  {
    method: 'POST',
    endpoint: '/api/users',
    variables: [],
    values: [],
    case: isNotValidExistedBody,
    response: { code: 400, result: userAddError },
  },
  {
    method: 'PUT',
    endpoint: '/api/users/{userId}',
    variables: ['userId'],
    values: [],
    case: isValidExistedUser,
    response: { code: 200, result: updateUser },
  },
  {
    method: 'PUT',
    endpoint: '/api/users/{userId}',
    variables: ['userId'],
    values: [],
    case: isNotValidUser,
    response: { code: 400, result: userGetError },
  },
  {
    method: 'PUT',
    endpoint: '/api/users/{userId}',
    variables: ['userId'],
    values: [],
    case: isNotValidExistedUser,
    response: { code: 404, result: userUpdateError },
  },
  {
    method: 'DELETE',
    endpoint: '/api/users/{userId}',
    variables: ['userId'],
    values: [],
    case: isValidExistedUser,
    response: { code: 204, result: deleteUser },
  },
  {
    method: 'DELETE',
    endpoint: '/api/users/{userId}',
    variables: ['userId'],
    values: [],
    case: isNotValidUser,
    response: { code: 400, result: userGetError },
  },
  {
    method: 'DELETE',
    endpoint: '/api/users/{userId}',
    variables: ['userId'],
    values: [],
    case: isNotExistedUser,
    response: { code: 404, result: userDeleteError },
  },
];
