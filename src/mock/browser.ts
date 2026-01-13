import { setupWorker } from 'msw/browser';
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
    resetPassword,
    googleLogin,
    logout,
    refresh,
    verifyUser,
    getInterests,
    userUpdate
];
export const worker = setupWorker(...handlers);
