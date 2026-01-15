import { setupWorker } from "msw/browser";
import {
  login,
  join,
  checkEmail,
  checkNickname,
  findPassword,
  verifyResetCode,
  resetPassword,
  googleLogin,
  logout,
  refresh,
  verifyUser,
} from "./authHandler";
import { meetingHandler } from "./meetingHandler";
import { getInterests } from './interestHandler';
import { getUserInfo, userUpdate } from './userInfoHandler';
import { getMyMeetings } from './meHandler';

const handlers = [
  login,
  join,
  checkEmail,
  checkNickname,
  findPassword,
  verifyResetCode,
  resetPassword,
  googleLogin,
  logout,
  refresh,
  verifyUser,
  getInterests,
  getUserInfo,
  userUpdate,
  getMyMeetings,
  ...meetingHandler
];
export const worker = setupWorker(...handlers);
