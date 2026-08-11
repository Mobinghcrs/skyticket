import api from './api';

export interface RevenueTierResponse {
  id: string;
  minQty: number;
  maxQty: number | null;
  pricePerTicket: number;
}

export interface RevenueConfigResponse {
  id: string;
  modelType: 'FIXED' | 'TIERED';
  fixedPrice: number;
  globalFreeLimit: number;
  tiers: RevenueTierResponse[];
}

export interface RevenueConfigPayload {
  modelType: 'FIXED' | 'TIERED';
  fixedPrice: number;
  globalFreeLimit: number;
  tiers: RevenueTierResponse[];
}

export class RevenueService {
  static async getConfig(): Promise<RevenueConfigResponse> {
    const response = await api.get('/revenue/config');
    return response.data.data;
  }

  static async updateConfig(payload: RevenueConfigPayload): Promise<RevenueConfigResponse> {
    const response = await api.put('/revenue/config', payload);
    return response.data.data;
  }
}
