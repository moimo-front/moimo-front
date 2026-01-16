import { setupWorker } from "msw/browser";
import { authHandler } from "./authHandler";
import { meetingHandler } from "./meetingHandler";
import { getInterests } from './interestHandler';
import { userInfoHandler } from './userInfoHandler';

const handlers = [
  ...authHandler,
  getInterests,
  ...userInfoHandler,
  ...meetingHandler
];

export const worker = setupWorker(...handlers);
