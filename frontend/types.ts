
export type Language = 'en' | 'fa' | 'ar';

export enum TripType {
  ONE_WAY = 'ONE_WAY',
  ROUND_TRIP = 'ROUND_TRIP',
}

export interface AgencyData {
  name: string;
  phone: string;
  logoUrl: string | null;
  showLogo?: boolean;
  address?: string;
}

export interface Flight {
  flightNumber: string;
  date: string; // Display date e.g., 18/Nov/2025
  isoDate?: string; // Input value e.g., 2025-11-18
  originTime: string; // e.g., 05:45
  destTime: string; // e.g., 07:55
  originCode: string; // e.g., MHD
  originName: string; // e.g., Masshad
  destCode: string; // e.g., NJF
  destName: string; // e.g., Najaf
  airline: string;
  airlineLogo?: string;
  aircraft?: string; // e.g., Boeing 737
  baggage: string; // e.g., 20 kg
  handBaggage?: string; // e.g. 5 Kg (Specific to Sepehr)
  flightClass?: string; // e.g. YYSFF (Specific to Sepehr)
  type: 'Go Flight' | 'Return Flight';
  airlineLogoColor?: string; // For UI variety
}

export interface Passenger {
  ticketId: string;
  gender: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  pnr: string;
  localPnr?: string; // Specific to Sepehr
  price?: string;
  idType?: 'Passport' | 'NationalID';
  issueTime?: string;
  issueDate?: string;
}

export interface TicketData {
  passenger: Passenger;
  flights: Flight[];
  tripType: TripType;
  agency: AgencyData;
  showPrice: boolean;
  isLoggedIn: boolean;
  templateId: string;
}

// Dashboard Types

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed';
  description: string;
  user: string;
}

export interface SavedPassenger {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  passportNumber: string;
  nationalId?: string;
  nationality: string;
  totalFlights: number;
  issueDate?: string;
  issueTime?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role: 'Admin' | 'Agent' | 'User';
  status: 'Active' | 'Inactive';
  credit: number;
  isUnlimited?: boolean;
  bonusFreeTickets?: number;
  permissions: Permission[];
}

export type Permission = 'ISSUE_TICKET' | 'MANAGE_USERS' | 'MANAGE_BASE_DATA' | 'VIEW_FINANCIALS' | 'MANAGE_REVENUE' | 'MANAGE_ADS' | 'MANAGE_SETTINGS' | 'MANAGE_BLOG';

export interface TicketHistoryItem {
  id: string;
  ticketId: string;
  pnr: string;
  passengerName: string;
  route: string;
  date: string;
  issuedBy: string;
  status: 'Confirmed' | 'Cancelled' | 'Pending';
  price: string;
  paymentMethod: string;
  notes?: string;
}

// Ads Types
export interface Ad {
  id: string;
  location: 'spot_1' | 'spot_2' | 'spot_3' | 'spot_4' | 'spot_popup' | 'spot_bottom_1' | 'spot_bottom_2' | 'spot_bottom_3';
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
}

// Config Types
export interface TicketTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailColor: string;
  isActive: boolean;
}

export interface FooterConfig {
  description: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  social: {
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
  };
}

export interface StaticPage {
    id?: string;
    slug: string;
    title: string;
    content: string;
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    imageUrl: string;
    status: 'Published' | 'Draft';
}

export interface RevenueConfig {
    modelType: 'FIXED' | 'TIERED';
    fixedPrice: number;
    globalFreeLimit: number;
    tiers: {
        id: string;
        minQty: number;
        maxQty: number | null; // null means infinity
        pricePerTicket: number;
    }[];
}

export interface Airline {
    id: string;
    name: string;
    code: string;
    logoUrl?: string;
}

export interface Airport {
    id: string;
    name: string;
    code: string;
    city: string;
    country: string;
}

export interface SavedFlight {
    id: string;
    airlineId?: string;
    flightNumber: string;
    airline: string;
    originCode: string;
    destCode: string;
    departureTime: string;
    arrivalTime: string;
    date: string;
}
