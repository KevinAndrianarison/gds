import axios from 'axios';
import { UrlContext } from './contexte/useUrl';

export const createApiInstance = (url) => {
  const instance = axios.create({
    baseURL: `${url}`
  });

  return instance;
};

export const apiRequest = async (context, method, endpoint, data = null) => {
  const { url } = context;
  const axiosInstance = createApiInstance(url);

  try {
    const response = await axiosInstance[method](endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
