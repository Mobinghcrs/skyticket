import api from './api';

export interface LoginData {
  identifier: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role?: 'ADMIN' | 'AGENT' | 'USER';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}

export class AuthService {
  static async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', loginData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  }

  static async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', registerData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  }

  static async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get user');
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Logout on client side regardless of server response
    }
  }
}

