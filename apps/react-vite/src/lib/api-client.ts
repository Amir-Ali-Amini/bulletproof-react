// @ts-nocheck
import Axios, { InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { paths } from '@/config/paths';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  config.headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'ngrok-skip-browser-warning': 'true',
    Pragma: 'no-cache',
    ...config.headers,
  };
  // config.headers.Accept = 'application/json';

  // const token = window.localStorage.getItem('token');
  const TOEKN =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2NjA2ODE4NiwiZXhwIjoxNzY4NjYwMTg2LCJpc3MiOiJhemtpLWRlbW8ifQ.ShB_rxKCdrG4dqK4u856j-K9BlwdX_hOF5gD0a0q1cA';
  if (TOEKN) {
    config.headers.Authorization = `Bearer ${TOEKN}`;
  }

  config.withCredentials = true;
  return config;
}

// export const DEFAULT_BASE_URL = 'http://192.168.110.135:8000/api/v1';
export const DEFAULT_BASE_URL =
  'https://unprepossessingly-undazed-grey.ngrok-free.dev/api/v1';

export const api = Axios.create({
  baseURL: DEFAULT_BASE_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = paths.app.payment.getHref();
    }

    return Promise.reject(error);
  },
);
