import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'ADMIN' | 'AGENT' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  credit: number;
  isUnlimited: boolean;
  bonusFreeTickets: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role?: 'ADMIN' | 'AGENT' | 'USER';
  status?: 'ACTIVE' | 'INACTIVE';
  credit?: number;
  isUnlimited?: boolean;
  bonusFreeTickets?: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  role?: 'ADMIN' | 'AGENT' | 'USER';
  status?: 'ACTIVE' | 'INACTIVE';
  credit?: number;
  isUnlimited?: boolean;
  bonusFreeTickets?: number;
}

export class UserService {
  static async getUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get users');
    }
  }

  static async getUser(id: string): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get user');
    }
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await api.post('/users', userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create user');
    }
  }

  static async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update user');
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  }

  static async toggleUserStatus(id: string): Promise<User> {
    try {
      const response = await api.patch(`/users/${id}/status`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to toggle user status');
    }
  }
}
