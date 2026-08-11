import api from './api';

export interface Ad {
  id: string;
  location: 'SPOT_1' | 'SPOT_2' | 'SPOT_3' | 'SPOT_4' | 'SPOT_POPUP' | 'SPOT_BOTTOM_1' | 'SPOT_BOTTOM_2' | 'SPOT_BOTTOM_3';
  title: string;
  description: string;
  ctaText: string;
  linkUrl: string;
  imageUrl?: string;
  colorFrom?: string;
  colorTo?: string;
  iconName: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdData {
  location: Ad['location'];
  title: string;
  description: string;
  ctaText?: string;
  linkUrl?: string;
  imageUrl?: string;
  colorFrom?: string;
  colorTo?: string;
  iconName?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export class AdService {
  static async getAds(): Promise<Ad[]> {
    try {
      const response = await api.get('/ads');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get ads');
    }
  }

  static async getAd(id: string): Promise<Ad> {
    try {
      const response = await api.get(`/ads/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get ad');
    }
  }

  static async createAd(adData: CreateAdData, imageFile?: File): Promise<Ad> {
    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(adData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post('/ads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create ad');
    }
  }

  static async updateAd(id: string, adData: Partial<CreateAdData>, imageFile?: File): Promise<Ad> {
    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(adData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.put(`/ads/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update ad');
    }
  }

  static async deleteAd(id: string): Promise<void> {
    try {
      await api.delete(`/ads/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete ad');
    }
  }

  static async toggleAdStatus(id: string): Promise<Ad> {
    try {
      const response = await api.patch(`/ads/${id}/toggle`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to toggle ad status');
    }
  }
}


