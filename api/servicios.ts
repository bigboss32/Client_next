// services/api.ts
import axios, { AxiosRequestConfig } from 'axios';

export const fetchData = async <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
  try {
    const response = await axios.get<T>(url, config);
    return response.data;
  } catch (error) {
    console.error('Error al hacer la petición:', error);
    throw error;
  }
};