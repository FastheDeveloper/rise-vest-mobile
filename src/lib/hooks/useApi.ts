// useApi.ts

import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios'
import { Schema } from 'zod'

import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs'
import { useAuth } from '~/providers/AuthProvider'
import { API_ROUTES } from '~/core/constants/apiRoutes';

interface Mutation<T> {
  key: string
  path: string
  onSuccess?: (val: T) => void
  schema?: Schema<T>
  onError?: (e: any) => void
  onSettled?: () => void
  options?: any
}

// Define a base URL for the API
export const baseURL = 'https://rise-rn-test-api-gb2v6.ondigitalocean.app/api/v1'

export const createApiInstance = (
  baseURL: string,
  getAuthState: () => {
    isAuthenticated: boolean;
    getAccessToken: () => string;
    refreshToken: () => Promise<string>;
  },
  headers?: Record<string, string>
) => {
  const instance = axios.create({ baseURL });
  console.log('instance', instance)

  instance.interceptors.request.use(async (config) => {
    const { isAuthenticated, getAccessToken } = getAuthState();
    if (!config.headers) {
      console.log('config.headers', config.headers)
      config.headers = {} as AxiosRequestHeaders;
    }

    if (isAuthenticated) {
      console.log('isAuthenticated refres', isAuthenticated)
      const accessToken = getAccessToken();
      console.log('accessToken ', accessToken)

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  if (headers) {
    instance.defaults.headers = {
      ...instance.defaults.headers,
      ...headers,
    }
  }

  return instance
}
