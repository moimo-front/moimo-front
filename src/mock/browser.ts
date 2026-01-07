import { setupWorker } from 'msw/browser';
import { login, join, checkEmail, checkNickname, findPassword, resetPassword, googleLogin, logout } from './authHandler';

const handlers = [
    login,
    join,
    checkEmail,
    checkNickname,
    findPassword,
    resetPassword,
    googleLogin,
    logout,
];
export const worker = setupWorker(...handlers);
