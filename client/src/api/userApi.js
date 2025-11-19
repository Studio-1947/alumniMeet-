import axiosClient from './axiosClient';

export const fetchMe = () => axiosClient.get('/users/me');
export const updateMe = (payload) => axiosClient.put('/users/me', payload);
export const fetchUsers = (params) => axiosClient.get('/users', { params });
export const fetchUserById = (id) => axiosClient.get(`/users/${id}`);
