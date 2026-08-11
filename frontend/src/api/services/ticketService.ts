import api from './api';

export interface TicketHistoryItem {
  id: string;
  ticketId: string;
  pnr: string;
  passengerName: string;
  route: string;
  date: string;
  issuedBy: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  price: string;
  paymentMethod: string;
  notes?: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketData {
  ticketId: string;
  pnr: string;
  passengerName: string;
  route: string;
  date: string;
  price: string;
  paymentMethod: string;
  status?: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  notes?: string;
}

export interface TicketStats {
  totalTickets: number;
  confirmedTickets: number;
  cancelledTickets: number;
  pendingTickets: number;
  totalRevenue: number;
}

export interface TicketFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class TicketService {
  static async getTickets(filters?: TicketFilters): Promise<TicketHistoryItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const response = await api.get(`/tickets?${params.toString()}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get tickets');
    }
  }

  static async getTicket(id: string): Promise<TicketHistoryItem> {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get ticket');
    }
  }

  static async createTicket(ticketData: CreateTicketData): Promise<TicketHistoryItem> {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create ticket');
    }
  }

  static async updateTicket(id: string, ticketData: Partial<CreateTicketData>): Promise<TicketHistoryItem> {
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update ticket');
    }
  }

  static async deleteTicket(id: string): Promise<void> {
    try {
      await api.delete(`/tickets/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete ticket');
    }
  }

  static async getTicketStats(): Promise<TicketStats> {
    try {
      const response = await api.get('/tickets/stats/overview');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get ticket stats');
    }
  }
}


