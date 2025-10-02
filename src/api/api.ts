import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://localhost:7265/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    username: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  userId: string;
}

interface TaskCreateDto {
  title: string;
  description: string;
  createdAt: string;
}

interface TaskUpdateDto {
  title?: string;
  description?: string;
  updatedAt?: string;
  isCompleted?: boolean;
}

interface TaskStats {
  completed: number;
  pending: number;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<AuthResponse>("/Auth/login", credentials);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    sessionStorage.setItem("token", response.data.data.token);

    return {
      id: "",
      username: response.data.data.username,
      email: credentials.identifier,
      token: response.data.data.token,
    };
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<AuthResponse>("/Auth/register", data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    sessionStorage.setItem("token", response.data.data.token);

    return {
      id: "",
      username: response.data.data.username,
      email: data.email,
      token: response.data.data.token,
    };
  },

  logout: async (): Promise<void> => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete("/Auth/delete");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  },
};

export const tasksAPI = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<{ success: boolean; data: Task[] }>("/Task");
    return response.data.data;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await api.get<{ success: boolean; data: Task }>(
      `/Task/${id}`
    );
    return response.data.data;
  },

  createTask: async (task: TaskCreateDto): Promise<Task> => {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: Task;
    }>("/Task", task);
    return response.data.data;
  },

  updateTask: async (id: number, updates: TaskUpdateDto): Promise<Task> => {
    const response = await api.put<{
      success: boolean;
      message: string;
      data: Task;
    }>(`/Task/${id}`, updates);
    return response.data.data;
  },

  toggleTask: async (id: number): Promise<Task> => {
    const response = await api.patch<{ success: boolean; data: Task }>(
      `/Task/${id}/toggle`
    );
    return response.data.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/Task/${id}`);
  },

  getStats: async (): Promise<TaskStats> => {
    const response = await api.get<{ success: boolean; data: TaskStats }>(
      "/Task/stats"
    );
    return response.data.data;
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async (): Promise<AdminUser[]> => {
    const response = await api.get<{ success: boolean; data: AdminUser[] }>('/Auth/admin/users');
    return response.data.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/Auth/admin/users/${userId}`);
  },
};

export default {
  auth: authAPI,
  tasks: tasksAPI,
  admin: adminAPI,
};
