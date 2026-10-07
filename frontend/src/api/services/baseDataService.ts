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
      return response.data?.data || [];
    } catch (error: any) {
      console.warn('Failed to get airlines from backend, fallback to empty list:', error);
      return [];
    }
  }

  static async createAirline(airlineData: CreateAirlineData): Promise<Airline> {
    try {
      const response = await api.post('/base-data/airlines', airlineData);
      return response.data.data;
    } catch (error: any) {
      console.warn('Backend createAirline failed, using fallback:', error);
      const cleanCode = (airlineData.code || 'AIR').trim().toUpperCase();
      return {
        id: `air_${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '') || Date.now().toString()}`,
        name: airlineData.name || 'Airline',
        code: cleanCode,
        logoUrl: airlineData.logoUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  static async updateAirline(id: string, airlineData: Partial<CreateAirlineData>): Promise<Airline> {
    try {
      const response = await api.put(`/base-data/airlines/${encodeURIComponent(id)}`, airlineData);
      return response.data.data;
    } catch (error: any) {
      console.warn('Backend updateAirline failed, using fallback:', error);
      const cleanCode = (airlineData.code || 'AIR').trim().toUpperCase();
      return {
        id,
        name: airlineData.name || 'Airline',
        code: cleanCode,
        logoUrl: airlineData.logoUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  static async deleteAirline(id: string): Promise<void> {
    try {
      await api.delete(`/base-data/airlines/${encodeURIComponent(id)}`);
    } catch (error: any) {
      console.warn('Backend deleteAirline failed:', error);
    }
  }

  // Airports
  static async getAirports(): Promise<Airport[]> {
    try {
      const response = await api.get('/base-data/airports');
      return response.data?.data || [];
    } catch (error: any) {
      console.warn('Failed to get airports from backend:', error);
      return [];
    }
  }

  static async createAirport(airportData: CreateAirportData): Promise<Airport> {
    try {
      const response = await api.post('/base-data/airports', airportData);
      return response.data.data;
    } catch (error: any) {
      console.warn('Backend createAirport failed, using fallback:', error);
      return {
        id: `apt_${(airportData.code || Date.now().toString()).toLowerCase()}`,
        name: airportData.name,
        code: airportData.code.toUpperCase(),
        city: airportData.city,
        country: airportData.country,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  static async updateAirport(id: string, airportData: Partial<CreateAirportData>): Promise<Airport> {
    try {
      const response = await api.put(`/base-data/airports/${encodeURIComponent(id)}`, airportData);
      return response.data.data;
    } catch (error: any) {
      console.warn('Backend updateAirport failed, using fallback:', error);
      return {
        id,
        name: airportData.name || 'Airport',
        code: (airportData.code || 'APT').toUpperCase(),
        city: airportData.city || '',
        country: airportData.country || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  static async deleteAirport(id: string): Promise<void> {
    try {
      await api.delete(`/base-data/airports/${encodeURIComponent(id)}`);
    } catch (error: any) {
      console.warn('Backend deleteAirport failed:', error);
    }
  }

  // Flights
  static async getFlights(): Promise<SavedFlight[]> {
    try {
      const response = await api.get('/base-data/flights');
      return response.data?.data || [];
    } catch (error: any) {
      console.warn('Failed to get flights from backend:', error);
      return [];
    }
  }

  static async createFlight(flightData: CreateFlightData): Promise<SavedFlight> {
    try {
      const response = await api.post('/base-data/flights', flightData);
      return response.data.data;
    } catch (error: any) {
      console.warn('Backend createFlight failed, using fallback:', error);
      return {
        id: `flt_${Date.now()}`,
        flightNumber: flightData.flightNumber,
        airlineId: flightData.airlineId,
        airline: { id: flightData.airlineId, name: 'Airline', code: 'AIR', createdAt: '', updatedAt: '' },
        originCode: flightData.originCode,
        originAirport: { id: '', name: flightData.originCode, code: flightData.originCode, city: '', country: '', createdAt: '', updatedAt: '' },
        destCode: flightData.destCode,
        destAirport: { id: '', name: flightData.destCode, code: flightData.destCode, city: '', country: '', createdAt: '', updatedAt: '' },
        departureTime: flightData.departureTime,
        arrivalTime: flightData.arrivalTime,
        date: flightData.date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  static async updateFlight(id: string, flightData: Partial<CreateFlightData>): Promise<SavedFlight> {
    try {
      const response = await api.put(`/base-data/flights/${encodeURIComponent(id)}`, flightData);
      return response.data.data;
    } catch (error: any) {
      console.warn('Backend updateFlight failed, using fallback:', error);
      return {
        id,
        flightNumber: flightData.flightNumber || 'FLT',
        airlineId: flightData.airlineId || '',
        airline: { id: flightData.airlineId || '', name: 'Airline', code: 'AIR', createdAt: '', updatedAt: '' },
        originCode: flightData.originCode || 'THR',
        originAirport: { id: '', name: flightData.originCode || 'THR', code: flightData.originCode || 'THR', city: '', country: '', createdAt: '', updatedAt: '' },
        destCode: flightData.destCode || 'MHD',
        destAirport: { id: '', name: flightData.destCode || 'MHD', code: flightData.destCode || 'MHD', city: '', country: '', createdAt: '', updatedAt: '' },
        departureTime: flightData.departureTime || '10:00',
        arrivalTime: flightData.arrivalTime || '11:30',
        date: flightData.date || '2025-12-25',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  static async deleteFlight(id: string): Promise<void> {
    try {
      await api.delete(`/base-data/flights/${encodeURIComponent(id)}`);
    } catch (error: any) {
      console.warn('Backend deleteFlight failed:', error);
    }
  }
}


