import { setupWorker } from "msw/browser";
import {
  login,
  join,
  checkEmail,
  checkNickname,
  findPassword,
  resetPassword,
  googleLogin,
  logout,
  refresh,
} from "./authHandler";
import { meetingHandler } from "./meetingHandler";
import { getInterests } from "./interestHandler";
import { userUpdate } from "./userInfoHandler";

const handlers = [
  login,
  join,
  checkEmail,
  checkNickname,
  findPassword,
  resetPassword,
  googleLogin,
  logout,
  refresh,
  getInterests,
  userUpdate,
  ...meetingHandler,
];
export const worker = setupWorker(...handlers);
