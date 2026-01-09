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
    refresh
} from './authHandler';
import { getInterests } from './interestHandler';
import { extraInfo } from './userInfoHandler';

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
    extraInfo
];
export const worker = setupWorker(...handlers);
