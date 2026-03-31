import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://raportti-api.pear-home.dedyn.io';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Types
export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Entry {
  id?: number;
  entry_date: string;
  shift_name: string;
  batch_code: string;
  line_name: string;
  notes?: string;
  payload: Record<string, unknown>;
  phase?: string;
  created_at?: string;
}

export interface DailyReport {
  phase: string;
  total_entries: number;
}

export interface WasteReport {
  entry_date: string;
  total_waste_kg: string;
}

// Health endpoints (no auth required)
export const checkHealth = () => api.get('/health');
export const checkDbHealth = () => api.get('/health/db');

// Auth endpoints (no auth required for login)
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { username, password });
  return response.data;
};

// Entries endpoints (auth required)
export const getEntries = async (): Promise<Entry[]> => {
  const response = await api.get<Entry[]>('/entries');
  return response.data;
};

export const createBoilingEntry = async (data: Omit<Entry, 'phase'>) => {
  const response = await api.post('/entries/boiling', data);
  return response.data;
};

export const createPackagingEntry = async (data: Omit<Entry, 'phase'>) => {
  const response = await api.post('/entries/packaging', data);
  return response.data;
};

export const createSeparationEntry = async (data: Omit<Entry, 'phase'>) => {
  const response = await api.post('/entries/separation', data);
  return response.data;
};

// Reports endpoints (auth required)
export const getDailyReport = async (date: string): Promise<DailyReport[]> => {
  const response = await api.get<DailyReport[]>(`/reports/daily?date=${date}`);
  return response.data;
};

export const getWasteReport = async (): Promise<WasteReport[]> => {
  const response = await api.get<WasteReport[]>('/reports/waste');
  return response.data;
};

// Export endpoint (auth required)
export const exportCsv = async (phase: string, from: string, to: string): Promise<Blob> => {
  const response = await api.get(`/exports/csv?phase=${phase}&from=${from}&to=${to}`, {
    responseType: 'blob',
  });
  return response.data;
};
