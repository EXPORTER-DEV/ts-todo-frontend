import axios, { type AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { config } from '../config';
import { constants } from '../constants';
import { AuthRepository } from './auth/auth';

const instance = axios.create({
    baseURL: config.API_URL,
    timeout: config.REQUEST_TIMEOUT,
});

instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const access = Cookies.get(constants.ACCESS_TOKEN);
    // Add Authorization header if cookie with access token exists:
    if(access !== undefined){
        headers['Authorization'] = 'Bearer ' + access;
    }
    config.headers = {
        ...config.headers,
        ...headers,
    };
    return config;
    }, function (error) {
    // Do something with request error
    return Promise.reject(error);
    });

instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if(error.response?.status === 401){
        const refresh = Cookies.get('refresh_token');
        if(refresh !== undefined){
            const repository = new AuthRepository();
            const result = await repository.refresh(refresh);
            if(result === true){
                return instance(error.config);
            }
        }
    }
    return Promise.reject(error);
});


export const api = instance;