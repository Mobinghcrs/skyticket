import api from './api';

export interface Airline {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Airport {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedFlight {
  id: string;
  flightNumber: string;
  airlineId: string;
  airline: Airline;
  originCode: string;
  originAirport: Airport;
  destCode: string;
  destAirport: Airport;
  departureTime: string;
  arrivalTime: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAirlineData {
  name: string;
  code: string;
  logoUrl?: string;
}

export interface CreateAirportData {
  name: string;
  code: string;
  city: string;
  country: string;
}

export interface CreateFlightData {
  flightNumber: string;
  airlineId: string;
  originCode: string;
  destCode: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
}

export class BaseDataService {
  // Airlines
  static async getAirlines(): Promise<Airline[]> {
    try {
      const response = await api.get('/base-data/airlines');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get airlines');
    }
  }

  static async createAirline(airlineData: CreateAirlineData): Promise<Airline> {
    try {
      const response = await api.post('/base-data/airlines', airlineData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create airline');
    }
  }

  static async updateAirline(id: string, airlineData: Partial<CreateAirlineData>): Promise<Airline> {
    try {
      const response = await api.put(`/base-data/airlines/${id}`, airlineData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update airline');
    }
  }

  static async deleteAirline(id: string): Promise<void> {
    try {
      await api.delete(`/base-data/airlines/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete airline');
    }
  }

  // Airports
  static async getAirports(): Promise<Airport[]> {
    try {
      const response = await api.get('/base-data/airports');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get airports');
    }
  }

  static async createAirport(airportData: CreateAirportData): Promise<Airport> {
    try {
      const response = await api.post('/base-data/airports', airportData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create airport');
    }
  }

  static async updateAirport(id: string, airportData: Partial<CreateAirportData>): Promise<Airport> {
    try {
      const response = await api.put(`/base-data/airports/${id}`, airportData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update airport');
    }
  }

  static async deleteAirport(id: string): Promise<void> {
    try {
      await api.delete(`/base-data/airports/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete airport');
    }
  }

  // Flights
  static async getFlights(): Promise<SavedFlight[]> {
    try {
      const response = await api.get('/base-data/flights');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get flights');
    }
  }

  static async createFlight(flightData: CreateFlightData): Promise<SavedFlight> {
    try {
      const response = await api.post('/base-data/flights', flightData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create flight');
    }
  }

  static async updateFlight(id: string, flightData: Partial<CreateFlightData>): Promise<SavedFlight> {
    try {
      const response = await api.put(`/base-data/flights/${id}`, flightData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update flight');
    }
  }

  static async deleteFlight(id: string): Promise<void> {
    try {
      await api.delete(`/base-data/flights/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete flight');
    }
  }
}


