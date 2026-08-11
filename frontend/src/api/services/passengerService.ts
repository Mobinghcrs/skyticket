import api from './api';

export interface SavedPassenger {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  passportNumber: string;
  nationality: string;
  totalFlights: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePassengerData {
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  passportNumber: string;
  nationality: string;
  totalFlights?: number;
}

export interface UpdatePassengerData {
  firstName?: string;
  lastName?: string;
  gender?: 'Male' | 'Female';
  passportNumber?: string;
  nationality?: string;
  totalFlights?: number;
}

export class PassengerService {
  static async getPassengers(search?: string): Promise<SavedPassenger[]> {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await api.get(`/passengers${params}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get passengers');
    }
  }

  static async getPassenger(id: string): Promise<SavedPassenger> {
    try {
      const response = await api.get(`/passengers/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get passenger');
    }
  }

  static async createPassenger(passengerData: CreatePassengerData): Promise<SavedPassenger> {
    try {
      const response = await api.post('/passengers', passengerData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create passenger');
    }
  }

  static async updatePassenger(id: string, passengerData: UpdatePassengerData): Promise<SavedPassenger> {
    try {
      const response = await api.put(`/passengers/${id}`, passengerData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update passenger');
    }
  }

  static async deletePassenger(id: string): Promise<void> {
    try {
      await api.delete(`/passengers/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete passenger');
    }
  }
}


