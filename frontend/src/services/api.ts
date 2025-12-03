import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  getMessage: () => apiClient.get('/api/auth/message'),
  sendVerificationEmail: (email: string) =>
    apiClient.post('/api/auth/send-email', { email }),
  verifyEmail: (email: string, code: string) =>
    apiClient.post('/api/auth/verify-email', { email, code }),
  login: (address: string, signature: string, message: string) =>
    apiClient.post('/api/auth/login', { address, signature, message }),
  refresh: () => apiClient.post('/api/auth/refresh'),
};

export const projectApi = {
  getProjects: (limit: number = 50) =>
    apiClient.get('/api/projects', { params: { limit } }),
  getProject: (projectId: number) =>
    apiClient.get(`/api/projects/${projectId}`),
  createProject: (data: any) => apiClient.post('/api/projects', data),
  updateProject: (projectId: number, data: any) =>
    apiClient.put(`/api/projects/${projectId}`, data),
};

export const disputeApi = {
  getDisputes: (limit: number = 50) =>
    apiClient.get('/api/disputes', { params: { limit } }),
  getDispute: (disputeId: number) =>
    apiClient.get(`/api/disputes/${disputeId}`),
  createDispute: (data: any) => apiClient.post('/api/disputes', data),
  getResolution: (disputeId: number) =>
    apiClient.get(`/api/disputes/${disputeId}/resolution`),
  vote: (disputeId: number, vote: string) =>
    apiClient.post(`/api/disputes/${disputeId}/vote`, { vote }),
};

export const storageApi = {
  upload: (fileName: string, fileData: string) =>
    apiClient.post('/api/storage/upload', { fileName, fileData }),
  download: (cid: string) => apiClient.get(`/api/storage/${cid}`),
};

export const aiApi = {
  analyzeText: (text: string) =>
    apiClient.post('/api/ai/analyze-text', { text }),
  verifySkills: (skillTest: string, submittedWork: string) =>
    apiClient.post('/api/ai/verify-skills', { skillTest, submittedWork }),
  analyzeDispute: (clientFeedback: string, freelancerResponse: string, projectDescription: string) =>
    apiClient.post('/api/ai/analyze-dispute', { clientFeedback, freelancerResponse, projectDescription }),
};

export const verificationApi = {
  initiateKYC: (data: any) => apiClient.post('/api/verification/kyc', data),
  verifyGST: (gstNumber: string) =>
    apiClient.post('/api/verification/gst', { gstNumber }),
  verifyPAN: (panNumber: string) =>
    apiClient.post('/api/verification/pan', { panNumber }),
};

export const userApi = {
  getUser: (address: string) => apiClient.get(`/api/users/${address}`),
  updateProfile: (address: string, data: any) =>
    apiClient.put(`/api/users/${address}`, data),
  getReputation: (address: string) =>
    apiClient.get(`/api/users/${address}/reputation`),
};

export default apiClient;
