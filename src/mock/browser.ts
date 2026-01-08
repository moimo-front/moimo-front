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
];
export const worker = setupWorker(...handlers);
