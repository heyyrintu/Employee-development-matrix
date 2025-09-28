// API service for communicating with the backend
import axios from 'axios';
import type {
  Employee,
  TrainingColumn,
  Score,
  MatrixData,
  AnalyticsData,
  AppSettings,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  CreateTrainingColumnRequest,
  UpdateTrainingColumnRequest,
  CreateScoreRequest,
  UpdateScoreRequest,
  FilterOptions,
  ExportOptions
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Employee API
export const employeeApi = {
  getAll: async (filters?: FilterOptions): Promise<Employee[]> => {
    const params = new URLSearchParams();
    if (filters?.department) params.append('department', filters.department);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.active_only !== undefined) params.append('active_only', filters.active_only.toString());
    
    const response = await api.get(`/employees?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const response = await api.post('/employees/', data);
    return response.data;
  },

  update: async (id: number, data: UpdateEmployeeRequest): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  getDepartments: async (): Promise<string[]> => {
    const response = await api.get('/employees/departments/list');
    return response.data;
  },

  getRoles: async (): Promise<string[]> => {
    const response = await api.get('/employees/roles/list');
    return response.data;
  },
};

// Training Column API
export const columnApi = {
  getAll: async (filters?: { category?: string; active_only?: boolean }): Promise<TrainingColumn[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.active_only !== undefined) params.append('active_only', filters.active_only.toString());
    
    const response = await api.get(`/columns?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<TrainingColumn> => {
    const response = await api.get(`/columns/${id}`);
    return response.data;
  },

  create: async (data: CreateTrainingColumnRequest): Promise<TrainingColumn> => {
    const response = await api.post('/columns/', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTrainingColumnRequest): Promise<TrainingColumn> => {
    const response = await api.put(`/columns/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/columns/${id}`);
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/columns/categories/list');
    return response.data;
  },

  reorder: async (id: string, newOrder: number): Promise<void> => {
    await api.put(`/columns/${id}/reorder`, { new_order: newOrder });
  },
};

// Score API
export const scoreApi = {
  getAll: async (filters?: { employee_id?: number; column_id?: string }): Promise<Score[]> => {
    const params = new URLSearchParams();
    if (filters?.employee_id) params.append('employee_id', filters.employee_id.toString());
    if (filters?.column_id) params.append('column_id', filters.column_id);
    
    const response = await api.get(`/scores?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Score> => {
    const response = await api.get(`/scores/${id}`);
    return response.data;
  },

  createOrUpdate: async (data: CreateScoreRequest): Promise<Score> => {
    const response = await api.post('/scores/', data);
    return response.data;
  },

  update: async (id: number, data: UpdateScoreRequest): Promise<Score> => {
    const response = await api.put(`/scores/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/scores/${id}`);
  },

  getEmployeeSummary: async (employeeId: number) => {
    const response = await api.get(`/scores/employee/${employeeId}/summary`);
    return response.data;
  },

  getColumnSummary: async (columnId: string) => {
    const response = await api.get(`/scores/column/${columnId}/summary`);
    return response.data;
  },
};

// Matrix API
export const matrixApi = {
  getMatrix: async (filters?: FilterOptions): Promise<MatrixData> => {
    const params = new URLSearchParams();
    if (filters?.department) params.append('department', filters.department);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.active_only !== undefined) params.append('active_only', filters.active_only.toString());
    
    const response = await api.get(`/matrix/?${params.toString()}`);
    return response.data;
  },

  getAnalytics: async (department?: string): Promise<AnalyticsData> => {
    const params = new URLSearchParams();
    if (department) params.append('department', department);
    
    const response = await api.get(`/matrix/analytics?${params.toString()}`);
    return response.data;
  },

  exportCsv: async (options?: ExportOptions): Promise<Blob> => {
    const params = new URLSearchParams();
    if (options?.department) params.append('department', options.department);
    if (options?.role) params.append('role', options.role);
    
    const response = await api.get(`/matrix/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportJson: async (options?: ExportOptions): Promise<MatrixData> => {
    const params = new URLSearchParams();
    if (options?.department) params.append('department', options.department);
    if (options?.role) params.append('role', options.role);
    
    const response = await api.get(`/matrix/export/json?${params.toString()}`);
    return response.data;
  },
};

// Settings API
export const settingsApi = {
  getSettings: async (): Promise<AppSettings> => {
    const response = await api.get('/settings/');
    return response.data;
  },

  updateSettings: async (settings: Partial<AppSettings>): Promise<AppSettings> => {
    const response = await api.put('/settings/', settings);
    return response.data;
  },

  getLevels: async (): Promise<AppSettings['levels']> => {
    const response = await api.get('/settings/levels');
    return response.data;
  },

  updateLevels: async (levels: AppSettings['levels']): Promise<void> => {
    await api.put('/settings/levels', levels);
  },

  getTheme: async (): Promise<string> => {
    const response = await api.get('/settings/theme');
    return response.data;
  },

  updateTheme: async (theme: string): Promise<void> => {
    await api.put('/settings/theme/', { theme });
  },
};

export default api;
