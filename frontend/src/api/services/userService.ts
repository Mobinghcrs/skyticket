import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'ADMIN' | 'AGENT' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  credit: number;
  creditIrr?: number;
  creditUsd?: number;
  giftCredit?: number;
  giftCreditIrr?: number;
  giftCreditUsd?: number;
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
  creditIrr?: number;
  creditUsd?: number;
  giftCredit?: number;
  giftCreditIrr?: number;
  giftCreditUsd?: number;
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
  creditIrr?: number;
  creditUsd?: number;
  giftCredit?: number;
  giftCreditIrr?: number;
  giftCreditUsd?: number;
  isUnlimited?: boolean;
  bonusFreeTickets?: number;
}

function extractErrorMessage(error: any, fallback: string): string {
  if (error.response?.data) {
    const data = error.response.data;
    if (data.details && Array.isArray(data.details) && data.details.length > 0) {
      return data.details.map((d: any) => d.msg || `${d.path} is invalid`).join(' | ');
    }
    if (data.error) {
      return data.error;
    }
  }
  return error.message || fallback;
}

export class UserService {
  static async getUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users');
      return response.data.data;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, 'Failed to get users'));
    }
  }

  static async getUser(id: string): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, 'Failed to get user'));
    }
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await api.post('/users', userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, 'Failed to create user'));
    }
  }

  static async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, 'Failed to update user'));
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, 'Failed to delete user'));
    }
  }

  static async toggleUserStatus(id: string): Promise<User> {
    try {
      const response = await api.patch(`/users/${id}/status`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error, 'Failed to toggle user status'));
    }
  }
}
