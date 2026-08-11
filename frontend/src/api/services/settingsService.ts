import api from './api';

export interface FooterConfigResponse {
  id?: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

export interface StaticPageResponse {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface StaticPagePayload {
  slug: string;
  title: string;
  content: string;
}

export class SettingsService {
  static async getFooter(): Promise<FooterConfigResponse> {
    const response = await api.get('/settings/footer');
    return response.data.data;
  }

  static async updateFooter(payload: Partial<FooterConfigResponse>): Promise<FooterConfigResponse> {
    const response = await api.put('/settings/footer', payload);
    return response.data.data;
  }

  static async getStaticPages(): Promise<StaticPageResponse[]> {
    const response = await api.get('/settings/static-pages');
    return response.data.data;
  }

  static async createStaticPage(payload: StaticPagePayload): Promise<StaticPageResponse> {
    const response = await api.post('/settings/static-pages', payload);
    return response.data.data;
  }

  static async updateStaticPage(id: string, payload: Partial<StaticPagePayload>): Promise<StaticPageResponse> {
    const response = await api.put(`/settings/static-pages/${id}`, payload);
    return response.data.data;
  }

  static async deleteStaticPage(id: string): Promise<void> {
    await api.delete(`/settings/static-pages/${id}`);
  }
}
