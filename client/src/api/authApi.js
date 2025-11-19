import axiosClient from './axiosClient';

/**
 * Auth API for signup/login calls.
 */
export const signup = (payload) => axiosClient.post('/auth/signup', payload);
export const login = (payload) => axiosClient.post('/auth/login', payload);
