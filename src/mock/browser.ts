import { setupWorker } from 'msw/browser';
import { login, join, checkEmail, checkNickname, findPassword, resetPassword, googleLogin } from './authHandler';

const handlers = [
    login,
    join,
    checkEmail,
    checkNickname,
    findPassword,
    resetPassword,
    googleLogin,
];
export const worker = setupWorker(...handlers);
