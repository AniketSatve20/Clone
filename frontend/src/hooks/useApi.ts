import { useState, useCallback } from 'react';
import apiClient from '../services/api';

interface UseApiState {
  data: any;
  loading: boolean;
  error: string | null;
}

export const useApi = () => {
  const [state, setState] = useState<UseApiState>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (method: string, url: string, data?: any) => {
      setState({ data: null, loading: true, error: null });

      try {
        let response;
        if (method === 'get') {
          response = await apiClient.get(url);
        } else if (method === 'post') {
          response = await apiClient.post(url, data);
        } else if (method === 'put') {
          response = await apiClient.put(url, data);
        } else if (method === 'delete') {
          response = await apiClient.delete(url);
        }

        setState({ data: response?.data, loading: false, error: null });
        return response?.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        throw err;
      }
    },
    []
  );

  return { ...state, request };
};
