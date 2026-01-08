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
    getInterests
];
export const worker = setupWorker(...handlers);
