import { setupWorker } from "msw/browser";
import {
  login,
  join,
  checkEmail,
  checkNickname,
  findPassword,
  resetPassword,
  googleLogin,
} from "./authHandler";
import { meetingHandler } from "./meetingHandler";

const handlers = [
  login,
  join,
  checkEmail,
  checkNickname,
  findPassword,
  resetPassword,
  googleLogin,
  ...meetingHandler,
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
    verifyUser
} from './authHandler';
import { getInterests } from './interestHandler';
import { userUpdate } from './userInfoHandler';

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
    userUpdate
];
export const worker = setupWorker(...handlers);
