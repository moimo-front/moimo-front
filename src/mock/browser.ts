import { setupWorker } from "msw/browser";
import { authHandler } from "./authHandler";
import { meetingHandler } from "./meetingHandler";
import { getInterests } from './interestHandler';
import { getMyMeetings } from './meHandler';
import { userInfoHandler } from './userInfoHandler';

const handlers = [
  ...authHandler,
  getInterests,
  getMyMeetings,
  ...userInfoHandler,
  ...meetingHandler
];

export const worker = setupWorker(...handlers);
