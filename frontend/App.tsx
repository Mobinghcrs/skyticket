
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import html2canvas from 'html2canvas';
import { TicketPreview } from './components/TicketPreview';
import { Dashboard } from './components/Dashboard';
import { TicketData, TripType, Flight, Passenger, AgencyData, SavedFlight, Airport, User, SavedPassenger, Permission, Language, TicketHistoryItem, Ad, TicketTemplate, FooterConfig, BlogPost, StaticPage, RevenueConfig, Airline } from './types';
import { Download, Plane, Users, ArrowRightLeft, ArrowRight, Building2, Upload, Eye, EyeOff, Calendar, UserCircle, LogIn, LogOut, LayoutDashboard, FileText, X, Smartphone, Lock, Palette, Grid, AlignVerticalJustifyCenter, CreditCard, ShieldCheck, RefreshCw, UserCheck, Search, CheckCircle2, Globe, Sparkles, Hotel, ShieldPlus, ChevronRight, Zap, Gift, Megaphone, Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, PhoneCall, Loader2, BookOpen, Tag, Clock, Coins, Coffee } from 'lucide-react';
import { translations } from './translations';
import { BaseDataService } from './src/api/services/baseDataService';
import { AuthService } from './src/api/services/authService';
import { AdService } from './src/api/services/adService';
import { UserService } from './src/api/services/userService';
import { PassengerService } from './src/api/services/passengerService';
import { TicketService } from './src/api/services/ticketService';
import { BlogService } from './src/api/services/blogService';
import { SettingsService } from './src/api/services/settingsService';
import { RevenueService } from './src/api/services/revenueService';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

const normalizeAssetUrl = (url?: string | null) => {
  if (!url) return url ?? undefined;
  if (/^(https?:|data:)/i.test(url)) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

const normalizeUser = (user: any): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  role: user.role === 'ADMIN' ? 'Admin' : user.role === 'AGENT' ? 'Agent' : 'User',
  status: user.status === 'ACTIVE' ? 'Active' : 'Inactive',
  credit: user.credit ?? 0,
  isUnlimited: Boolean(user.isUnlimited),
  bonusFreeTickets: user.bonusFreeTickets ?? 0,
  permissions: (user.permissions || []).map((permission: any) =>
    typeof permission === 'string' ? permission : permission.name
  )
});

const normalizeAdLocation = (location: string) => location.toLowerCase();

const normalizeAd = (ad: any): Ad => ({
  id: ad.id,
  location: normalizeAdLocation(ad.location) as Ad['location'],
  title: ad.title,
  description: ad.description,
  ctaText: ad.ctaText,
  linkUrl: ad.linkUrl,
  imageUrl: normalizeAssetUrl(ad.imageUrl),
  colorFrom: ad.colorFrom,
  colorTo: ad.colorTo,
  iconName: ad.iconName,
  isActive: Boolean(ad.isActive),
  startDate: ad.startDate || '',
  endDate: ad.endDate || ''
});

const serializeAdLocation = (location: string) => location.toUpperCase();

const normalizeBlogPost = (post: any): BlogPost => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  author: post.author,
  date: post.date,
  imageUrl: normalizeAssetUrl(post.imageUrl) || '',
  status: post.status === 'PUBLISHED' ? 'Published' : post.status === 'DRAFT' ? 'Draft' : post.status
});

const normalizeFooterConfig = (config: any): FooterConfig => ({
  description: config.description || '',
  address: config.address || '',
  phone: config.phone || '',
  email: config.email || '',
  copyright: config.copyright || '',
  social: {
    facebook: config.facebook || '',
    twitter: config.twitter || '',
    instagram: config.instagram || '',
    linkedin: config.linkedin || ''
  }
});

const serializeFooterConfig = (config: FooterConfig) => ({
  description: config.description,
  address: config.address,
  phone: config.phone,
  email: config.email,
  copyright: config.copyright,
  facebook: config.social.facebook || undefined,
  twitter: config.social.twitter || undefined,
  instagram: config.social.instagram || undefined,
  linkedin: config.social.linkedin || undefined
});

const normalizeStaticPage = (page: any): StaticPage => ({
  id: page.id,
  slug: page.slug,
  title: page.title,
  content: page.content
});

const normalizeRevenueConfig = (config: any): RevenueConfig => ({
  modelType: config.modelType,
  fixedPrice: Number(config.fixedPrice ?? 0),
  globalFreeLimit: Number(config.globalFreeLimit ?? 0),
  tiers: (config.tiers || []).map((tier: any) => ({
    id: tier.id,
    minQty: Number(tier.minQty),
    maxQty: tier.maxQty === null ? null : Number(tier.maxQty),
    pricePerTicket: Number(tier.pricePerTicket)
  }))
});

const normalizeTicket = (ticket: any): TicketHistoryItem => ({
  id: ticket.id,
  ticketId: ticket.ticketId,
  pnr: ticket.pnr,
  passengerName: ticket.passengerName,
  route: ticket.route,
  date: ticket.date,
  issuedBy: ticket.issuedBy,
  status: ticket.status === 'CONFIRMED' ? 'Confirmed' : ticket.status === 'CANCELLED' ? 'Cancelled' : 'Pending',
  price: ticket.price,
  paymentMethod: ticket.paymentMethod,
  notes: ticket.notes || ''
});

// --- INITIAL DATA ---

const INITIAL_AIRLINES: Airline[] = [
  // --- IRANIAN AIRLINES ---
  { id: '1', name: 'Mahan Air', code: 'W5' },
  { id: '2', name: 'Iran Air', code: 'IR' },
  { id: '3', name: 'Sepehran Airlines', code: 'IS' },
  { id: '4', name: 'Ata Airlines', code: 'I3' },
  { id: '5', name: 'Zagros Airlines', code: 'ZV' },
  { id: '6', name: 'Kish Air', code: 'Y9' },
  { id: '7', name: 'Qeshm Air', code: 'QB' },
  { id: '8', name: 'Iran Aseman', code: 'EP' },
  { id: '9', name: 'Taban Air', code: 'HH' },
  { id: '10', name: 'Caspian Airlines', code: 'RV' },
  { id: '11', name: 'Meraj Airlines', code: 'JI' },
  { id: '12', name: 'Pouya Air', code: 'PY' },
  { id: '13', name: 'Saha Airlines', code: 'IRZ' },
  { id: '14', name: 'Varesh Airlines', code: 'VR' },
  { id: '15', name: 'FlyPersia', code: 'FP' },
  { id: '16', name: 'Karun Airlines', code: 'NV' },
  { id: '17', name: 'Pars Air', code: 'PR' },
  { id: '18', name: 'Chabahar Airlines', code: 'IKV' },
  { id: '19', name: 'Yazd Air', code: 'DZD' },
  { id: '34', name: 'Ava Air', code: 'VAA' },
  { id: '35', name: 'Arvan Airlines', code: 'A1' },

  // --- MIDDLE EAST ---
  { id: '20', name: 'Turkish Airlines', code: 'TK' },
  { id: '21', name: 'FlyDubai', code: 'FZ' },
  { id: '22', name: 'Emirates', code: 'EK' },
  { id: '23', name: 'Qatar Airways', code: 'QR' },
  { id: '24', name: 'Iraqi Airways', code: 'IA' },
  { id: '25', name: 'Pegasus Airlines', code: 'PC' },
  { id: '26', name: 'Etihad Airways', code: 'EY' },
  { id: '27', name: 'Saudia', code: 'SV' },
  { id: '28', name: 'Oman Air', code: 'WY' },
  { id: '29', name: 'Kuwait Airways', code: 'KU' },
  { id: '30', name: 'Middle East Airlines', code: 'ME' },
  { id: '31', name: 'Air Arabia', code: 'G9' },
  { id: '32', name: 'Gulf Air', code: 'GF' },
  { id: '33', name: 'Royal Jordanian', code: 'RJ' },

  // --- EUROPE ---
  { id: '40', name: 'Lufthansa', code: 'LH' },
  { id: '41', name: 'British Airways', code: 'BA' },
  { id: '42', name: 'Air France', code: 'AF' },
  { id: '43', name: 'KLM', code: 'KL' },
  { id: '44', name: 'Aeroflot', code: 'SU' },
  { id: '45', name: 'Swiss International', code: 'LX' },
  { id: '46', name: 'Austrian Airlines', code: 'OS' },
  { id: '47', name: 'Ryanair', code: 'FR' },
  { id: '48', name: 'EasyJet', code: 'U2' },
  { id: '49', name: 'Wizz Air', code: 'W6' },
  
  // --- ASIA ---
  { id: '60', name: 'Singapore Airlines', code: 'SQ' },
  { id: '61', name: 'Cathay Pacific', code: 'CX' },
  { id: '62', name: 'China Southern', code: 'CZ' },
  { id: '63', name: 'China Eastern', code: 'MU' },
  { id: '64', name: 'Air China', code: 'CA' },
  { id: '65', name: 'All Nippon Airways', code: 'NH' },
  { id: '66', name: 'Japan Airlines', code: 'JL' },
  { id: '67', name: 'Korean Air', code: 'KE' },
  { id: '68', name: 'Thai Airways', code: 'TG' },
  { id: '69', name: 'Malaysia Airlines', code: 'MH' },
  { id: '70', name: 'IndiGo', code: '6E' },
  { id: '71', name: 'Air India', code: 'AI' },

  // --- AMERICAS ---
  { id: '80', name: 'American Airlines', code: 'AA' },
  { id: '81', name: 'Delta Air Lines', code: 'DL' },
  { id: '82', name: 'United Airlines', code: 'UA' },
  { id: '83', name: 'Air Canada', code: 'AC' },
  { id: '84', name: 'LATAM Airlines', code: 'LA' },
];

const INITIAL_AIRPORTS: Airport[] = [
  // --- IRAN (MAJOR & INTERNATIONAL) ---
  { id: '1', name: 'Imam Khomeini Intl', code: 'IKA', city: 'Tehran', country: 'Iran' },
  { id: '2', name: 'Mehrabad Intl', code: 'THR', city: 'Tehran', country: 'Iran' },
  { id: '3', name: 'Mashhad Intl', code: 'MHD', city: 'Mashhad', country: 'Iran' },
  { id: '4', name: 'Shiraz Intl', code: 'SYZ', city: 'Shiraz', country: 'Iran' },
  { id: '5', name: 'Isfahan Intl', code: 'IFN', city: 'Isfahan', country: 'Iran' },
  { id: '6', name: 'Tabriz Intl', code: 'TBZ', city: 'Tabriz', country: 'Iran' },
  { id: '7', name: 'Kish Intl', code: 'KIH', city: 'Kish Island', country: 'Iran' },
  { id: '8', name: 'Qeshm Intl', code: 'GSM', city: 'Qeshm Island', country: 'Iran' },
  { id: '9', name: 'Bandar Abbas Intl', code: 'BND', city: 'Bandar Abbas', country: 'Iran' },
  { id: '10', name: 'Ahvaz Intl', code: 'AWZ', city: 'Ahvaz', country: 'Iran' },
  { id: '11', name: 'Yazd Shahid Sadooghi', code: 'AZD', city: 'Yazd', country: 'Iran' },
  { id: '12', name: 'Kerman Intl', code: 'KER', city: 'Kerman', country: 'Iran' },
  { id: '13', name: 'Abadan Intl', code: 'ABD', city: 'Abadan', country: 'Iran' },
  { id: '14', name: 'Bushehr', code: 'BUZ', city: 'Bushehr', country: 'Iran' },
  { id: '15', name: 'Rasht (Sardar Jangal)', code: 'RAS', city: 'Rasht', country: 'Iran' },
  { id: '16', name: 'Sari (Dasht-e Naz)', code: 'SRY', city: 'Sari', country: 'Iran' },
  { id: '17', name: 'Gorgan', code: 'GBT', city: 'Gorgan', country: 'Iran' },
  { id: '18', name: 'Zahedan Intl', code: 'ZAH', city: 'Zahedan', country: 'Iran' },
  { id: '19', name: 'Chabahar (Konarak)', code: 'ZBR', city: 'Chabahar', country: 'Iran' },
  { id: '20', name: 'Lamerd', code: 'LFM', city: 'Lamerd', country: 'Iran' },
  { id: '21', name: 'Lar', code: 'LRR', city: 'Lar', country: 'Iran' },
  { id: '22', name: 'Kermanshah', code: 'KSH', city: 'Kermanshah', country: 'Iran' },
  { id: '23', name: 'Urmia', code: 'OMH', city: 'Urmia', country: 'Iran' },
  { id: '24', name: 'Ardabil', code: 'ADU', city: 'Ardabil', country: 'Iran' },
  { id: '25', name: 'Persian Gulf (Asaluyeh)', code: 'PGU', city: 'Asaluyeh', country: 'Iran' },
  { id: '26', name: 'Birjand', code: 'XBJ', city: 'Birjand', country: 'Iran' },
  { id: '27', name: 'Bojnord', code: 'BJB', city: 'Bojnord', country: 'Iran' },
  { id: '28', name: 'Hamadan', code: 'HDM', city: 'Hamadan', country: 'Iran' },
  { id: '29', name: 'Ilam', code: 'IIL', city: 'Ilam', country: 'Iran' },
  { id: '30', name: 'Sanandaj', code: 'SDG', city: 'Sanandaj', country: 'Iran' },
  { id: '31', name: 'Khorramabad', code: 'KHD', city: 'Khorramabad', country: 'Iran' },
  { id: '32', name: 'Yasuj', code: 'YES', city: 'Yasuj', country: 'Iran' },
  { id: '33', name: 'Shahr-e Kord', code: 'CQD', city: 'Shahr-e Kord', country: 'Iran' },
  { id: '34', name: 'Dezful', code: 'DEF', city: 'Dezful', country: 'Iran' },
  { id: '35', name: 'Mahshahr', code: 'MRX', city: 'Mahshahr', country: 'Iran' },
  { id: '36', name: 'Jask', code: 'JSK', city: 'Jask', country: 'Iran' },
  { id: '37', name: 'Jiroft', code: 'JYR', city: 'Jiroft', country: 'Iran' },
  { id: '38', name: 'Rafsanjan', code: 'RJN', city: 'Rafsanjan', country: 'Iran' },
  { id: '39', name: 'Sirjan', code: 'SYJ', city: 'Sirjan', country: 'Iran' },
  { id: '40', name: 'Bam', code: 'BXR', city: 'Bam', country: 'Iran' },
  { id: '41', name: 'Zabol', code: 'ACZ', city: 'Zabol', country: 'Iran' },
  { id: '42', name: 'Iranshahr', code: 'IHR', city: 'Iranshahr', country: 'Iran' },
  { id: '43', name: 'Saravan', code: 'SXV', city: 'Saravan', country: 'Iran' },
  { id: '44', name: 'Ramsar', code: 'RZR', city: 'Ramsar', country: 'Iran' },
  { id: '45', name: 'Noshahr', code: 'NSH', city: 'Noshahr', country: 'Iran' },
  { id: '46', name: 'Kalaleh', code: 'KLM', city: 'Kalaleh', country: 'Iran' },
  { id: '47', name: 'Sabzevar', code: 'AFZ', city: 'Sabzevar', country: 'Iran' },
  { id: '48', name: 'Tabas', code: 'TCX', city: 'Tabas', country: 'Iran' },
  { id: '49', name: 'Arak', code: 'AJK', city: 'Arak', country: 'Iran' },
  { id: '50', name: 'Kashan', code: 'KKS', city: 'Kashan', country: 'Iran' },
  { id: '51', name: 'Abumusa Island', code: 'AEU', city: 'Abumusa', country: 'Iran' },
  { id: '52', name: 'Lavan Island', code: 'LVP', city: 'Lavan', country: 'Iran' },
  { id: '53', name: 'Khark Island', code: 'KHK', city: 'Khark', country: 'Iran' },
  { id: '54', name: 'Sirri Island', code: 'SXI', city: 'Sirri', country: 'Iran' },
  { id: '55', name: 'Jahrom', code: 'JAR', city: 'Jahrom', country: 'Iran' },
  { id: '56', name: 'Parsabad', code: 'PFQ', city: 'Parsabad', country: 'Iran' },
  { id: '57', name: 'Khoy', code: 'KHY', city: 'Khoy', country: 'Iran' },
  { id: '58', name: 'Maku', code: 'IMQ', city: 'Maku', country: 'Iran' },
  { id: '59', name: 'Maragheh', code: 'ACP', city: 'Maragheh', country: 'Iran' },
  { id: '60', name: 'Zanjan', code: 'JWN', city: 'Zanjan', country: 'Iran' },
  { id: '61', name: 'Payam (Karaj)', code: 'PYK', city: 'Karaj', country: 'Iran' },
  { id: '62', name: 'Shahroud', code: 'RUD', city: 'Shahroud', country: 'Iran' },
  { id: '63', name: 'Bandar Lengeh', code: 'BDH', city: 'Bandar Lengeh', country: 'Iran' },
  { id: '64', name: 'Gachsaran', code: 'GCH', city: 'Gachsaran', country: 'Iran' },
  { id: '65', name: 'Semnan', code: 'SNX', city: 'Semnan', country: 'Iran' },
  { id: '66', name: 'Gonabad', code: 'GNA', city: 'Gonabad', country: 'Iran' },
  { id: '67', name: 'Bahregan', code: 'IAQ', city: 'Bahregan', country: 'Iran' },
  { id: '68', name: 'Jam', code: 'KNR', city: 'Jam', country: 'Iran' },
  { id: '69', name: 'Sarakhs', code: 'CKT', city: 'Sarakhs', country: 'Iran' },

  // --- IRAQ ---
  { id: '101', name: 'Al Najaf Intl', code: 'NJF', city: 'Najaf', country: 'Iraq' },
  { id: '102', name: 'Baghdad Intl', code: 'BGW', city: 'Baghdad', country: 'Iraq' },
  { id: '103', name: 'Erbil Intl', code: 'EBL', city: 'Erbil', country: 'Iraq' },
  { id: '104', name: 'Sulaimaniyah Intl', code: 'ISU', city: 'Sulaimaniyah', country: 'Iraq' },
  { id: '105', name: 'Basra Intl', code: 'BSR', city: 'Basra', country: 'Iraq' },

  // --- UAE ---
  { id: '201', name: 'Dubai Intl', code: 'DXB', city: 'Dubai', country: 'UAE' },
  { id: '202', name: 'Sharjah Intl', code: 'SHJ', city: 'Sharjah', country: 'UAE' },
  { id: '203', name: 'Abu Dhabi Intl', code: 'AUH', city: 'Abu Dhabi', country: 'UAE' },
  
  // --- TURKEY ---
  { id: '301', name: 'Istanbul Airport', code: 'IST', city: 'Istanbul', country: 'Turkey' },
  { id: '302', name: 'Sabiha Gokcen', code: 'SAW', city: 'Istanbul', country: 'Turkey' },
  { id: '303', name: 'Antalya', code: 'AYT', city: 'Antalya', country: 'Turkey' },
  { id: '304', name: 'Ankara Esenboga', code: 'ESB', city: 'Ankara', country: 'Turkey' },
  { id: '305', name: 'Izmir Adnan Menderes', code: 'ADB', city: 'Izmir', country: 'Turkey' },
  { id: '306', name: 'Van Ferit Melen', code: 'VAN', city: 'Van', country: 'Turkey' },

  // --- OTHERS ---
  { id: '401', name: 'Hamad Intl', code: 'DOH', city: 'Doha', country: 'Qatar' },
  { id: '402', name: 'Muscat Intl', code: 'MCT', city: 'Muscat', country: 'Oman' },
  { id: '403', name: 'Kuwait Intl', code: 'KWI', city: 'Kuwait City', country: 'Kuwait' },
  { id: '404', name: 'Bahrain Intl', code: 'BAH', city: 'Manama', country: 'Bahrain' },
  { id: '405', name: 'King Abdulaziz Intl', code: 'JED', city: 'Jeddah', country: 'Saudi Arabia' },
  { id: '406', name: 'King Khalid Intl', code: 'RUH', city: 'Riyadh', country: 'Saudi Arabia' },
  { id: '407', name: 'Prince Mohammad Bin Abdulaziz', code: 'MED', city: 'Medina', country: 'Saudi Arabia' },
  { id: '408', name: 'Rafic Hariri Intl', code: 'BEY', city: 'Beirut', country: 'Lebanon' },
  { id: '409', name: 'Queen Alia Intl', code: 'AMM', city: 'Amman', country: 'Jordan' },
  { id: '410', name: 'Zvartnots Intl', code: 'EVN', city: 'Yerevan', country: 'Armenia' },
  { id: '411', name: 'Tbilisi Intl', code: 'TBS', city: 'Tbilisi', country: 'Georgia' },
  { id: '412', name: 'Heydar Aliyev Intl', code: 'GYD', city: 'Baku', country: 'Azerbaijan' },
  { id: '413', name: 'Kabul Intl', code: 'KBL', city: 'Kabul', country: 'Afghanistan' },
  { id: '414', name: 'Mazar-i-Sharif', code: 'MZR', city: 'Mazar-i-Sharif', country: 'Afghanistan' },
  { id: '415', name: 'Herat', code: 'HEA', city: 'Herat', country: 'Afghanistan' },
];

const INITIAL_SAVED_FLIGHTS: SavedFlight[] = [
  { id: '1', flightNumber: '7300', airline: 'Sepehran Airlines', originCode: 'MHD', destCode: 'NJF', departureTime: '05:45', arrivalTime: '07:55', date: '2025-11-18' },
  { id: '2', flightNumber: '9213', airline: 'Ava Airlines', originCode: 'NJF', destCode: 'MHD', departureTime: '19:30', arrivalTime: '22:20', date: '2025-11-18' },
];

const INITIAL_SAVED_PASSENGERS: SavedPassenger[] = [
  { id: '1', firstName: 'Humam', lastName: 'Alyassiry', gender: 'Male', passportNumber: 'A21192788', nationality: 'IRAQ', totalFlights: 12 },
  { id: '2', firstName: 'Fatemeh', lastName: 'Alavi', gender: 'Female', passportNumber: 'B98765432', nationality: 'IRAN', totalFlights: 8 },
  { id: '3', firstName: 'John', lastName: 'Smith', gender: 'Male', passportNumber: 'C12345678', nationality: 'UK', totalFlights: 3 },
  { id: '4', firstName: 'Ali', lastName: 'Rezaei', gender: 'Male', passportNumber: 'D11223344', nationality: 'IRAN', totalFlights: 5 },
  { id: '5', firstName: 'Sarah', lastName: 'Connor', gender: 'Female', passportNumber: 'E55667788', nationality: 'USA', totalFlights: 1 },
];

const INITIAL_PASSENGER: Passenger = {
  ticketId: '2589746236',
  gender: 'Male',
  firstName: 'HUMAM',
  lastName: 'ALYASSIRY',
  passportNumber: 'A21192788',
  nationality: 'IRAQ',
  pnr: 'PU8MR2',
  localPnr: 'EJM25A',
  price: '$150.00',
  idType: 'Passport',
};

const INITIAL_AGENCY: AgencyData = {
  name: 'Your Travel Agency',
  phone: '+98 21 1234 5678',
  logoUrl: null,
  showLogo: true
};

const INITIAL_FLIGHT_1: Flight = {
  flightNumber: '7300',
  date: '18/Nov/2025',
  isoDate: '2025-11-18',
  originTime: '05:45',
  destTime: '07:55',
  originCode: 'MHD',
  originName: 'Masshad',
  destCode: 'NJF',
  destName: 'Najaf',
  airline: 'Sepehran Airlines',
  baggage: '20 kg',
  handBaggage: '5 Kg',
  flightClass: 'YYSFF',
  type: 'Go Flight'
};

const INITIAL_FLIGHT_2: Flight = {
  flightNumber: '9213',
  date: '18/Nov/2025',
  isoDate: '2025-11-18',
  originTime: '19:30',
  destTime: '22:20',
  originCode: 'NJF',
  originName: 'Najaf',
  destCode: 'MHD',
  destName: 'Masshad',
  airline: 'Ava Airlines',
  baggage: '20 kg',
  handBaggage: '5 Kg',
  flightClass: 'YYSFF',
  type: 'Return Flight'
};

const INITIAL_TEMPLATES: TicketTemplate[] = [
  { id: '1', name: 'Standard Blue', description: 'Classic airline layout with blue headers', thumbnailColor: 'bg-blue-500', isActive: true },
  { id: '2', name: 'Minimal Dark', description: 'High contrast black and white design', thumbnailColor: 'bg-gray-800', isActive: false },
  { id: '3', name: 'Modern Red', description: 'Bold design with red accents', thumbnailColor: 'bg-red-500', isActive: false },
  { id: '4', name: 'Golden Luxury', description: 'Premium gold styling for VIP tickets', thumbnailColor: 'bg-yellow-500', isActive: false },
  { id: '5', name: 'Vertical Pass', description: 'Modern vertical boarding pass style', thumbnailColor: 'bg-slate-800', isActive: true },
  { id: '6', name: 'Vertical Light', description: 'Clean vertical layout', thumbnailColor: 'bg-gray-200', isActive: false },
  { id: '7', name: 'Official Sepehr', description: 'Official A4 layout for Sepehr/ATA', thumbnailColor: 'bg-stone-200', isActive: true },
  { id: '8', name: 'System Sepehr (New)', description: 'Exact replica of System Sepehr blue layout', thumbnailColor: 'bg-blue-600', isActive: true },
];

const INITIAL_FOOTER_CONFIG: FooterConfig = {
  description: '',
  address: '',
  phone: '',
  email: '',
  copyright: '',
  social: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  }
};

const INITIAL_PAGES: StaticPage[] = [
    { slug: 'about', title: 'About Us', content: 'Welcome to SkyTicket Generator. We provide the best tools for travel agencies to generate professional tickets instantly.' },
    { slug: 'terms', title: 'Terms of Service', content: 'By using this service, you agree to the following terms and conditions...' },
    { slug: 'privacy', title: 'Privacy Policy', content: 'We value your privacy. Your data is secure with us...' },
    { slug: 'support', title: 'Support Center', content: 'Need help? Contact our 24/7 support team via email or phone.' },
    { slug: 'faq', title: 'Frequently Asked Questions', content: 'Q: How do I generate a ticket?\nA: Fill in the form and click download.' },
];

const INITIAL_BLOG_POSTS: BlogPost[] = [
    { 
        id: '1', 
        title: 'Top 10 Travel Destinations for 2025', 
        excerpt: 'Discover the most breathtaking places to visit this year. From hidden beaches to mountain retreats.', 
        content: 'Travel is coming back stronger than ever. Here are the top picks for 2025 that you cannot miss...', 
        author: 'Sarah Jenkins', 
        date: '2025-01-15', 
        imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        status: 'Published'
    },
    { 
        id: '2', 
        title: 'How to Save Money on International Flights', 
        excerpt: 'Expert tips on booking cheap tickets and finding the best deals online.', 
        content: 'Booking early is key, but did you know that clearing your cookies can also help? Here are 5 expert tips...', 
        author: 'Mike Ross', 
        date: '2025-01-20', 
        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        status: 'Published'
    },
    { 
        id: '3', 
        title: 'The Ultimate Packing Guide', 
        excerpt: 'Don\'t forget a thing! A comprehensive checklist for your next adventure.', 
        content: 'Whether you are going for a weekend trip or a month-long expedition, packing smart is essential...', 
        author: 'Emily Blunt', 
        date: '2025-02-05', 
        imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        status: 'Published'
    }
];

const INITIAL_REVENUE_CONFIG: RevenueConfig = {
  modelType: 'TIERED',
  fixedPrice: 2000,
  globalFreeLimit: 5, 
  tiers: [
    { id: '1', minQty: 1, maxQty: 50, pricePerTicket: 2000 },
    { id: '2', minQty: 51, maxQty: 200, pricePerTicket: 1500 },
    { id: '3', minQty: 201, maxQty: null, pricePerTicket: 1000 },
  ]
};

// Mock Database for Authentication
const MOCK_AUTH_DB: User[] = [
  { 
    id: '1', 
    name: 'Admin Manager', 
    email: 'admin@sky.com', 
    mobile: '09121234567', 
    password: 'admin',
    role: 'Admin', 
    status: 'Active', 
    credit: 10000, 
    isUnlimited: true, 
    bonusFreeTickets: 100,
    permissions: ['ISSUE_TICKET', 'MANAGE_USERS', 'MANAGE_BASE_DATA', 'VIEW_FINANCIALS', 'MANAGE_REVENUE', 'MANAGE_ADS', 'MANAGE_SETTINGS', 'MANAGE_BLOG']
  },
  { 
    id: '2', 
    name: 'Reza Agent', 
    email: 'reza@agency.com', 
    mobile: '09127654321', 
    password: 'agent',
    role: 'Agent', 
    status: 'Active', 
    credit: 5000, 
    isUnlimited: false, 
    bonusFreeTickets: 10,
    permissions: ['ISSUE_TICKET', 'VIEW_FINANCIALS']
  },
  { 
    id: '3', 
    name: 'Normal User', 
    email: 'user@gmail.com', 
    mobile: '09120000000', 
    password: 'user',
    role: 'User', 
    status: 'Active', 
    credit: 0, 
    isUnlimited: false, 
    bonusFreeTickets: 0,
    permissions: ['ISSUE_TICKET']
  }
];

// Initial Ads Data
const INITIAL_ADS: Ad[] = [
    {
        id: '1',
        location: 'spot_1',
        title: 'Instant Visa Approval',
        description: 'Get your travel visa in 24 hours.',
        ctaText: 'View',
        linkUrl: 'https://google.com',
        colorFrom: 'from-indigo-600',
        colorTo: 'to-purple-600',
        iconName: 'Sparkles',
        isActive: true,
        startDate: '2025-01-01',
        endDate: '2025-12-31'
    },
    {
        id: '2',
        location: 'spot_2',
        title: 'Travel Insurance',
        description: 'Full coverage for peace of mind.',
        ctaText: 'View',
        linkUrl: '#',
        colorFrom: 'from-emerald-600',
        colorTo: 'to-teal-600',
        iconName: 'ShieldPlus',
        isActive: true
    },
    {
        id: '3',
        location: 'spot_3',
        title: 'Luxury Hotels',
        description: 'Up to 50% discount on bookings.',
        ctaText: 'View',
        linkUrl: '#',
        colorFrom: 'from-amber-500',
        colorTo: 'to-orange-500',
        iconName: 'Hotel',
        isActive: true
    },
    {
        id: '4',
        location: 'spot_4',
        title: 'Rent a Car',
        description: 'Best prices for car rentals worldwide.',
        ctaText: 'Book Now',
        linkUrl: '#',
        colorFrom: 'from-slate-700',
        colorTo: 'to-slate-900',
        iconName: 'Zap',
        isActive: true
    },
    {
        id: '5',
        location: 'spot_popup',
        title: 'Business Class Upgrade',
        description: 'Upgrade your flight for only $50. Limited time offer!',
        ctaText: 'Upgrade Now',
        linkUrl: '#',
        colorFrom: 'from-indigo-900',
        colorTo: 'to-slate-900',
        iconName: 'Gift',
        isActive: true
    },
    // NEW VERTICAL ADS
    {
        id: '6',
        location: 'spot_bottom_1',
        title: 'Exclusive Tours',
        description: 'Discover hidden gems with our guides.',
        ctaText: 'Explore',
        linkUrl: '#',
        colorFrom: 'from-pink-500',
        colorTo: 'to-rose-500',
        iconName: 'Globe',
        isActive: true
    },
    {
        id: '7',
        location: 'spot_bottom_2',
        title: 'VIP Lounge Access',
        description: 'Relax in style before your flight.',
        ctaText: 'Get Access',
        linkUrl: '#',
        colorFrom: 'from-violet-600',
        colorTo: 'to-indigo-600',
        iconName: 'Coffee',
        isActive: true
    },
    {
        id: '8',
        location: 'spot_bottom_3',
        title: 'Best Exchange Rates',
        description: 'Currency exchange with 0% commission.',
        ctaText: 'Exchange',
        linkUrl: '#',
        colorFrom: 'from-emerald-500',
        colorTo: 'to-green-600',
        iconName: 'Coins',
        isActive: true
    }
];

// Icon Mapping
const ICON_MAP: Record<string, any> = {
    Sparkles, ShieldPlus, Hotel, Plane, CreditCard, Globe, Zap, Gift, Megaphone, Coffee, Coins
};

// Input Component
const Input = ({ label, name, value, onChange, placeholder, className = "" }: any) => (
  <div className={className}>
    <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
    />
  </div>
);

// FlightForm Component
const FlightForm = ({ title, data, onChange, onDateChange, isSepehr, t, isRTL, airports }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
      <Plane className={`w-5 h-5 text-blue-500 ${title === t('returnFlight') ? 'rotate-180' : ''}`} /> {title}
    </h2>
    <div className="space-y-3">
       <div className="grid grid-cols-2 gap-3">
          <Input label={t('flightNumber')} name="flightNumber" value={data.flightNumber} onChange={onChange} />
          <Input label={t('airline')} name="airline" value={data.airline} onChange={onChange} />
       </div>
       <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">{t('originCode')}</label>
            <input list="airports-origin" name="originCode" value={data.originCode} onChange={onChange} className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all uppercase" placeholder="MHD" />
            <datalist id="airports-origin">
                {airports.map((a: any) => <option key={a.id} value={a.code}>{a.city}</option>)}
            </datalist>
          </div>
          <div>
             <label className="text-xs font-medium text-gray-500 mb-1 block">{t('destCode')}</label>
             <input list="airports-dest" name="destCode" value={data.destCode} onChange={onChange} className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all uppercase" placeholder="NJF" />
             <datalist id="airports-dest">
                {airports.map((a: any) => <option key={a.id} value={a.code}>{a.city}</option>)}
            </datalist>
          </div>
       </div>
       <div className="grid grid-cols-2 gap-3">
          <Input label={t('originName')} name="originName" value={data.originName} onChange={onChange} />
          <Input label={t('destName')} name="destName" value={data.destName} onChange={onChange} />
       </div>
       <div className="grid grid-cols-2 gap-3">
          <Input label={t('departure')} name="originTime" value={data.originTime} onChange={onChange} placeholder="05:45" />
          <Input label={t('arrival')} name="destTime" value={data.destTime} onChange={onChange} placeholder="07:55" />
       </div>
       <div className="grid grid-cols-2 gap-3">
          <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{t('date')}</label>
              <input type="date" value={data.isoDate || ''} onChange={onDateChange} className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
              <input type="text" name="date" value={data.date} onChange={onChange} className="w-full mt-1 p-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:bg-white outline-none" placeholder="18/Nov/2025" />
          </div>
          <div className="space-y-3">
              <Input label={t('baggage')} name="baggage" value={data.baggage} onChange={onChange} />
              {isSepehr && (
                <>
                  <Input label={t('handBag')} name="handBaggage" value={data.handBaggage || ''} onChange={onChange} />
                  <Input label={t('classCode')} name="flightClass" value={data.flightClass || ''} onChange={onChange} />
                </>
              )}
          </div>
       </div>
    </div>
  </div>
);

const LoginModal = ({ onClose, onLogin, onRegisterClick, t, isRTL }: any) => {
    const [identifier, setIdentifier] = useState('admin@skyticket.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        const result = await AuthService.login({ identifier, password });
        setIsLoading(false);

        if (!result.success || !result.token || !result.user) {
            setError(result.error || 'Invalid credentials');
            return;
        }

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        onLogin(normalizeUser(result.user));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative" dir={isRTL ? 'rtl' : 'ltr'}>
                
                {/* Visual Side (Hidden on Mobile) */}
                <div className="hidden md:flex w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-600/90 to-indigo-900/90 mix-blend-multiply"></div>
                    
                    <div className="relative z-10 p-10 text-white flex flex-col h-full justify-between">
                         <div>
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/20">
                                <Plane className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight">Welcome to <br/>SkyTicket</h2>
                            <p className="text-blue-100 text-lg opacity-90 leading-relaxed">The professional platform for issuing flight tickets instantly and securely.</p>
                         </div>
                         <div className="text-xs text-blue-200 opacity-60">
                             © 2025 SkyTicket Generator. All rights reserved.
                         </div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center bg-white">
                    <button onClick={onClose} className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors`}>
                        <X className="w-6 h-6" />
                    </button>

                    <div className="mb-8 mt-4">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('login')}</h2>
                        <p className="text-gray-500">{t('welcomeBack')}</p>
                    </div>

                    <div className="space-y-5">
                        <div className="relative group">
                            <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide">Email / Mobile</label>
                            <div className="relative">
                                <div className={`absolute top-3.5 ${isRTL ? 'right-4' : 'left-4'} text-gray-400 group-focus-within:text-blue-600 transition-colors`}>
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    value={identifier} 
                                    onChange={e => setIdentifier(e.target.value)} 
                                    className={`w-full py-3.5 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-800`} 
                                    dir="ltr"
                                    placeholder="admin@skyticket.com"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide">{t('password')}</label>
                            <div className="relative">
                                <div className={`absolute top-3.5 ${isRTL ? 'right-4' : 'left-4'} text-gray-400 group-focus-within:text-blue-600 transition-colors`}>
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    className={`w-full py-3.5 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-800`} 
                                    dir="ltr"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

                        <button onClick={handleSubmit} disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
                            {isLoading ? 'Loading...' : t('login')} <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account? <button onClick={onRegisterClick} className="text-blue-600 font-bold hover:underline hover:text-blue-700 transition-colors">{t('register')}</button>
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="text-center">
                           <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Demo Credentials</p>
                           <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-mono font-medium border border-gray-200">
                               admin@skyticket.com / admin123
                           </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RegisterModal = ({ onClose, onRegister, t, isRTL }: any) => {
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        const result = await AuthService.register(formData);
        setIsLoading(false);

        if (!result.success || !result.token || !result.user) {
            setError(result.error || 'Registration failed');
            return;
        }

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        onRegister(normalizeUser(result.user));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative" dir={isRTL ? 'rtl' : 'ltr'}>
                <button onClick={onClose} className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors`}>
                    <X className="w-5 h-5" />
                </button>
                <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm border border-green-100">
                        <UserCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('createNewAccount')}</h2>
                    <p className="text-sm text-gray-500 mt-1">Join us to start issuing tickets</p>
                </div>
                <div className="space-y-4">
                    <input placeholder={t('fullName')} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all" />
                    <input placeholder={t('mobileNumber')} value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all" />
                    <input placeholder={t('emailText')} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all" />
                    <input type="password" placeholder={t('password')} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition-all" />
                    {error && <p className="text-sm font-medium text-red-500">{error}</p>}
                    <button onClick={handleSubmit} disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-2 disabled:opacity-60">{isLoading ? 'Loading...' : t('register')}</button>
                </div>
            </div>
        </div>
    );
};

const PaymentModal = ({ onClose, onPaymentSuccess, amount, t }: any) => {
    const [step, setStep] = useState(1);
    
    const handlePay = () => {
        setStep(2);
        setTimeout(() => {
            onPaymentSuccess();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
                {step === 1 ? (
                    <>
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 animate-pulse">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Insufficient Credit</h2>
                        <p className="text-sm text-gray-500 mb-6">You need to top up your account to issue this ticket. Cost: <span className="font-bold text-gray-800">${amount}</span></p>
                        
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-left">
                            <div className="flex justify-between mb-2 text-sm"><span>Balance</span><span className="font-bold text-red-500">$0.00</span></div>
                            <div className="flex justify-between mb-2 text-sm"><span>Required</span><span className="font-bold">$10.00</span></div>
                            <div className="border-t pt-2 flex justify-between font-bold"><span>Total to Pay</span><span className="text-blue-600">$10.00</span></div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200">{t('cancel')}</button>
                            <button onClick={handlePay} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700">Pay Now</button>
                        </div>
                    </>
                ) : (
                    <div className="py-8">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-lg font-bold text-gray-800">Processing Payment...</h3>
                        <p className="text-sm text-gray-500">Please wait while we confirm your transaction.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PassengerSelectModal = ({ passengers, onClose, onSelect, t, isRTL }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filtered = passengers.filter((p: any) => 
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.passportNumber.includes(searchTerm)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{t('selectSaved')}</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="relative mb-4">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-4 h-4 text-gray-400`} />
                    <input 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={t('search')}
                        className={`w-full p-2.5 ${isRTL ? 'pr-10' : 'pl-10'} border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none`}
                    />
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {filtered.map((p: any) => (
                        <button 
                            key={p.id} 
                            onClick={() => onSelect(p.id)}
                            className="w-full p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-left flex items-center justify-between group"
                        >
                            <div>
                                <div className="font-bold text-gray-800">{p.firstName} {p.lastName}</div>
                                <div className="text-xs text-gray-500 font-mono">{p.passportNumber} • {p.nationality}</div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 text-blue-600"><CheckCircle2 className="w-5 h-5"/></div>
                        </button>
                    ))}
                    {filtered.length === 0 && <div className="text-center py-8 text-gray-400">No passengers found</div>}
                </div>
            </div>
        </div>
    );
};

const DownloadLoadingModal = ({ isRTL, t, ad, timer }: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 text-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold mb-1">{t('preparingTicket')}</h2>
                <p className="text-slate-400 text-sm">{t('pleaseWait')}</p>
            </div>
            
            {/* Ad Space (Popup) */}
            <div className="p-6 bg-gray-50">
                {ad && (
                    <div className="mb-6">
                         <div className={`rounded-2xl p-4 text-white shadow-lg relative overflow-hidden bg-gradient-to-br ${ad.colorFrom} ${ad.colorTo}`}>
                              <div className="relative z-10 flex items-start gap-4">
                                   <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg"><Gift className="w-6 h-6" /></div>
                                   <div>
                                       <h4 className="font-bold text-lg mb-1">{ad.title}</h4>
                                       <p className="text-sm opacity-90 mb-3">{ad.description}</p>
                                       <a href={ad.linkUrl || '#'} target="_blank" className="inline-block bg-white text-gray-900 px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:scale-105 transition-transform">{ad.ctaText}</a>
                                   </div>
                              </div>
                              {/* Decor */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                         </div>
                    </div>
                )}
                
                <div className="text-center">
                    <p className="text-sm text-gray-500 font-medium mb-2">{t('downloadStartsIn')}</p>
                    <div className="text-4xl font-black text-slate-800 font-mono">{timer} <span className="text-base font-bold text-gray-400">{t('seconds')}</span></div>
                </div>
            </div>
        </div>
    </div>
);


type View = 'generator' | 'dashboard' | 'blog' | 'page';
type TemplateCategory = 'horizontal' | 'vertical';

const TICKET_COST = 10000; // Cost per ticket in Credit

// ... (Rest of the components: AdBanner, StaticPageView, BlogView, Footer) ...
// To save space, I will keep AdBanner, StaticPageView, BlogView, and Footer exactly as they are in the original file. 
// They are not changed. I am only modifying the App component below.

const AdBanner = ({ 
    icon: Icon, 
    title, 
    desc, 
    cta,
    linkUrl,
    imageUrl,
    colorFrom, 
    colorTo, 
    isRTL,
    className = ""
}: { 
    icon: any, 
    title: string, 
    desc: string, 
    cta: string, 
    linkUrl?: string,
    imageUrl?: string,
    colorFrom: string, 
    colorTo: string, 
    isRTL: boolean,
    className?: string
}) => {
    return (
        <a href={linkUrl || '#'} target={linkUrl ? "_blank" : "_self"} className={`block w-full ${className}`}>
            <div className={`w-full p-3 md:p-4 rounded-xl relative shadow-md flex items-center justify-between group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-[1.01] ${!imageUrl ? `bg-gradient-to-r ${colorFrom} ${colorTo}` : ''} text-white`}>
                
                {imageUrl ? (
                    <>
                        {/* Background Image */}
                        <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover z-0" />
                        {/* Dark Overlay for Readability */}
                        <div className="absolute inset-0 bg-black/40 z-0 transition-opacity group-hover:bg-black/30"></div>
                    </>
                ) : (
                    <>
                         {/* Subtle Pattern Overlay for Gradient */}
                         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                    </>
                )}
                
                {/* Content */}
                <div className="flex items-center gap-4 z-10 relative">
                    {!imageUrl && (
                        <div className="bg-white/20 p-2 md:p-2.5 rounded-lg backdrop-blur-sm border border-white/10 shadow-inner">
                            <Icon size={20} className="text-white" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <h4 className="font-bold text-sm md:text-base leading-tight tracking-tight shadow-sm drop-shadow-md text-white">{title}</h4>
                        <p className="text-[10px] md:text-xs text-white/90 font-medium opacity-90 drop-shadow">{desc}</p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="flex items-center z-10 relative">
                    <button className={`hidden sm:flex items-center gap-1 bg-white text-gray-900 px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg hover:bg-gray-50 transition-colors whitespace-nowrap`}>
                        {cta} {isRTL ? <ChevronRight size={14} className="rotate-180" /> : <ChevronRight size={14} />}
                    </button>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </div>
        </a>
    );
};

const VerticalAdCard = ({ ad, isRTL }: { ad: Ad, isRTL: boolean }) => (
    <a href={ad.linkUrl || '#'} target={ad.linkUrl ? "_blank" : "_self"} className="group block h-full">
        <div className={`relative h-full min-h-[420px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 bg-white flex flex-col`}>
           {/* Image Area - Taller */}
           <div className="h-64 overflow-hidden relative">
              {ad.imageUrl ? (
                  <img src={ad.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${ad.colorFrom} ${ad.colorTo}`}></div>
              )}
              {/* Gradient Overlay for Text Readability if needed */}
              <div className={`absolute inset-0 bg-gradient-to-t ${ad.colorFrom} to-transparent opacity-40`} />
              
              {/* Icon Overlay */}
              <div className="absolute bottom-4 left-4 text-white bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-sm">
                 {(() => {
                    const Icon = ICON_MAP[ad.iconName] || Sparkles;
                    return <Icon size={24} />;
                 })()}
              </div>
           </div>

           {/* Content Area */}
           <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                  <h4 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">{ad.title}</h4>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-4 leading-relaxed">{ad.description}</p>
              </div>
              
              <button className={`w-full py-3 rounded-xl bg-gray-50 text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center gap-2`}>
                 {ad.ctaText} {isRTL ? <ChevronRight size={16} className="rotate-180" /> : <ChevronRight size={16} />}
              </button>
           </div>
        </div>
    </a>
);

// --- COMPONENT: STATIC PAGE VIEW ---
const StaticPageView = ({ page, onBack, t }: { page: StaticPage, onBack: () => void, t: any }) => (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in duration-300">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium">
            <ArrowRight className="rotate-180 w-4 h-4" /> {t('back')}
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">{page.title}</h1>
            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                {page.content}
            </div>
        </div>
    </div>
);

// --- COMPONENT: BLOG VIEW ---
const BlogView = ({ posts, onBack, t, isRTL }: { posts: BlogPost[], onBack: () => void, t: any, isRTL: boolean }) => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPosts = posts.filter(post => 
        post.status === 'Published' && 
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (selectedPost) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in duration-300">
                    <button onClick={() => setSelectedPost(null)} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium group">
                        <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                            <ArrowRight className={`${isRTL ? '' : 'rotate-180'} w-4 h-4`} />
                        </div>
                        <span>{t('back')}</span>
                    </button>
                    
                    <article className="space-y-8">
                        {/* Hero Image */}
                        {selectedPost.imageUrl && (
                            <div className="h-64 md:h-[450px] w-full overflow-hidden rounded-3xl shadow-lg relative">
                                <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">Article</span>
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="md:px-4">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-500"/> {selectedPost.date}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="flex items-center gap-1.5"><UserCircle className="w-4 h-4 text-blue-500"/> {selectedPost.author}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500"/> 5 min read</span>
                            </div>
                            
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">{selectedPost.title}</h1>
                            
                            <div className="prose prose-lg prose-blue max-w-none text-gray-600 leading-loose whitespace-pre-wrap font-sans">
                                {selectedPost.content}
                            </div>

                            {/* Author Box */}
                            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                                    {selectedPost.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 font-bold uppercase">Written by</p>
                                    <p className="font-bold text-gray-900">{selectedPost.author}</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Modern Hero Header */}
            <div className="bg-slate-900 text-white relative overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                
                <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24 flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Our Blog</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
                            Explore the world <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">with confidence</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-lg">Latest news, travel tips, and insights from the SkyTicket team.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-96">
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder={t('search')} 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-white placeholder-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xl"
                            />
                            <Search className="absolute top-4 left-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"><ArrowRight className={`${isRTL ? '' : 'rotate-180'} w-5 h-5`}/></button>
                    <h2 className="text-2xl font-bold text-gray-900">{t('blogPosts')}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map(post => (
                        <div 
                            key={post.id} 
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer" 
                            onClick={() => setSelectedPost(post)}
                        >
                            <div className="h-56 overflow-hidden relative bg-gray-100">
                                {post.imageUrl ? (
                                    <>
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50"><BookOpen className="w-12 h-12" /></div>
                                )}
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm flex items-center gap-1">
                                    <Tag className="w-3 h-3"/> Article
                                </span>
                            </div>
                            
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-medium">
                                    <span>{post.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>{post.author}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">{post.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1 leading-relaxed">{post.excerpt}</p>
                                
                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {post.author.charAt(0)}
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">Read more</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all ${isRTL ? 'rotate-180' : ''}`}>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: FOOTER ---
const Footer = ({ t, isRTL, config, onNavigate }: { t: (key: any) => string, isRTL: boolean, config: FooterConfig, onNavigate: (view: string, slug?: string) => void }) => (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
        <div className="w-full px-8 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                {/* Brand Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white mb-2">
                        <div className="bg-blue-600 p-2 rounded-lg"><Plane className="w-6 h-6"/></div>
                        <span className="text-xl font-bold tracking-tight">SkyTicket</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400">{config.description || t('footerDesc')}</p>
                    <div className="flex gap-4 pt-4">
                        <a href={config.social.facebook || '#'} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Facebook size={18}/></a>
                        <a href={config.social.twitter || '#'} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"><Twitter size={18}/></a>
                        <a href={config.social.instagram || '#'} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18}/></a>
                        <a href={config.social.linkedin || '#'} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={18}/></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-6">{t('quickLinks')}</h3>
                    <ul className="space-y-3 text-sm">
                        <li><button onClick={() => onNavigate('page', 'about')} className="hover:text-white transition-colors flex items-center gap-2">{isRTL && <ChevronRight size={14} className="rotate-180"/>}{t('aboutUs')}</button></li>
                        <li><button onClick={() => onNavigate('generator')} className="hover:text-white transition-colors flex items-center gap-2">{isRTL && <ChevronRight size={14} className="rotate-180"/>}{t('generator')}</button></li>
                        <li><button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors flex items-center gap-2">{isRTL && <ChevronRight size={14} className="rotate-180"/>}Blog</button></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-6">{t('legal')}</h3>
                    <ul className="space-y-3 text-sm">
                        <li><button onClick={() => onNavigate('page', 'terms')} className="hover:text-white transition-colors flex items-center gap-2">{isRTL && <ChevronRight size={14} className="rotate-180"/>}{t('terms')}</button></li>
                        <li><button onClick={() => onNavigate('page', 'privacy')} className="hover:text-white transition-colors flex items-center gap-2">{isRTL && <ChevronRight size={14} className="rotate-180"/>}{t('privacy')}</button></li>
                        <li><button onClick={() => onNavigate('page', 'support')} className="hover:text-white transition-colors flex items-center gap-2">{isRTL && <ChevronRight size={14} className="rotate-180"/>}{t('support')}</button></li>
                        <li><button onClick={() => onNavigate('page', 'faq')} className="hover:text-white transition-colors flex items-center gap-2">{isRTL && <ChevronRight size={14} className="rotate-180"/>}{t('faq')}</button></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-6">{t('contactUs')}</h3>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-slate-400">{config.address || t('address')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <PhoneCall className="w-5 h-5 text-blue-500 shrink-0" />
                            <span className="text-slate-400">{config.phone || '+98 21 1234 5678'}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                            <span className="text-slate-400">{config.email || 'support@skyticket.com'}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-800 pt-8 mt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-500">{config.copyright || t('copyright')}</p>
                <div className="flex gap-6 text-xs text-slate-500">
                    <a href="#" className="hover:text-white">Sitemap</a>
                    <a href="#" className="hover:text-white">Cookies</a>
                    <a href="#" className="hover:text-white">Security</a>
                </div>
            </div>
        </div>
    </footer>
);

export default function App() {
  const [view, setView] = useState<View>('generator');
  const [activePageSlug, setActivePageSlug] = useState<string>(''); // For static pages
  const [lang, setLang] = useState<Language>('fa'); 
  const [tripType, setTripType] = useState<TripType>(TripType.ROUND_TRIP);
  const [passenger, setPassenger] = useState<Passenger>(INITIAL_PASSENGER);
  const [agency, setAgency] = useState<AgencyData>(INITIAL_AGENCY);
  const [flight1, setFlight1] = useState<Flight>(INITIAL_FLIGHT_1);
  const [flight2, setFlight2] = useState<Flight>(INITIAL_FLIGHT_2);
  const [showPrice, setShowPrice] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory>('horizontal');
  const [selectedTemplate, setSelectedTemplate] = useState('7');
  
  // Shared Database State
  const [savedFlights, setSavedFlights] = useState<SavedFlight[]>(INITIAL_SAVED_FLIGHTS);
  const [savedAirports, setSavedAirports] = useState<Airport[]>(INITIAL_AIRPORTS);
  const [savedAirlines, setSavedAirlines] = useState<Airline[]>(INITIAL_AIRLINES);
  const [savedPassengers, setSavedPassengers] = useState<SavedPassenger[]>(INITIAL_SAVED_PASSENGERS);
  const [users, setUsers] = useState<User[]>([]);
  const [ticketHistory, setTicketHistory] = useState<TicketHistoryItem[]>([]);
  const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);
  const [templates, setTemplates] = useState<TicketTemplate[]>(INITIAL_TEMPLATES);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(INITIAL_FOOTER_CONFIG);
  const [staticPages, setStaticPages] = useState<StaticPage[]>(INITIAL_PAGES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [revenueConfig, setRevenueConfig] = useState<RevenueConfig>(INITIAL_REVENUE_CONFIG);

  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  // Download Loader State
  const [showDownloadLoader, setShowDownloadLoader] = useState(false);
  const [downloadTimer, setDownloadTimer] = useState(0);
  
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [ticketHeight, setTicketHeight] = useState(1123); // Default A4 height

  const historyPrintRef = useRef<HTMLDivElement>(null);
  const [historyTicketData, setHistoryTicketData] = useState<TicketData | null>(null);
  const [pendingHistoryDownloadFileName, setPendingHistoryDownloadFileName] = useState<string | null>(null);

  const t = (key: keyof typeof translations['en']) => translations[lang][key] || key;
  const isRTL = lang === 'fa' || lang === 'ar';

  // Navigation Handler
  const handleNavigate = (targetView: string, slug?: string) => {
      setView(targetView as View);
      if (targetView === 'page' && slug) {
          setActivePageSlug(slug);
      }
      window.scrollTo(0, 0);
  };

  const handleResize = () => {
    if (previewContainerRef.current) {
      const containerWidth = previewContainerRef.current.offsetWidth;
      const ticketWidth = 794; 
      const padding = window.innerWidth < 768 ? 16 : 32;
      const scale = Math.min(1, (containerWidth - padding) / ticketWidth);
      setPreviewScale(scale);
    }
  };

  useEffect(() => {
    const updateHeight = () => {
        if (ticketRef.current) {
            setTicketHeight(ticketRef.current.offsetHeight);
        }
    };
    
    // Initial check and on data change
    updateHeight();
    
    // Add resize listener
    const observer = new ResizeObserver(updateHeight);
    if (ticketRef.current) observer.observe(ticketRef.current);

    return () => observer.disconnect();
  }, [passenger, flight1, flight2, selectedTemplate, view]);

  useEffect(() => {
    if (view === 'generator') {
       handleResize();
       setTimeout(handleResize, 100);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  // Download Timer Logic
  useEffect(() => {
      let interval: any;
      if (showDownloadLoader && downloadTimer > 0) {
          interval = setInterval(() => {
              setDownloadTimer(prev => prev - 1);
          }, 1000);
      } else if (showDownloadLoader && downloadTimer === 0) {
          // Timer finished, trigger download
          downloadPDF();
          setShowDownloadLoader(false);
      }
      return () => clearInterval(interval);
  }, [showDownloadLoader, downloadTimer]);

  useEffect(() => {
    const hydrateUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(normalizeUser(user));
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    hydrateUser();

    const handleForcedLogout = () => {
      setCurrentUser(null);
      setView('generator');
    };

    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  useEffect(() => {
    const loadBaseData = async () => {
      try {
        const [airlines, airports, flights] = await Promise.all([
          BaseDataService.getAirlines(),
          BaseDataService.getAirports(),
          BaseDataService.getFlights()
        ]);

        if (airlines.length > 0) {
          setSavedAirlines(
            airlines.map((airline) => ({
              id: airline.id,
              name: airline.name,
              code: airline.code,
              logoUrl: normalizeAssetUrl(airline.logoUrl)
            }))
          );
        }

        if (airports.length > 0) {
          setSavedAirports(
            airports.map((airport) => ({
              id: airport.id,
              name: airport.name,
              code: airport.code,
              city: airport.city,
              country: airport.country
            }))
          );
        }

        if (flights.length > 0) {
          setSavedFlights(
            flights.map((flight) => ({
              id: flight.id,
              airlineId: flight.airlineId,
              flightNumber: flight.flightNumber,
              airline: flight.airline.name,
              originCode: flight.originCode,
              destCode: flight.destCode,
              departureTime: flight.departureTime,
              arrivalTime: flight.arrivalTime,
              date: flight.date
            }))
          );
        }
      } catch (error) {
        console.error('Failed to load base data from backend:', error);
      }
    };

    loadBaseData();
  }, []);

  useEffect(() => {
    const loadAds = async () => {
      try {
        const loadedAds = await AdService.getAds();
        if (loadedAds.length > 0) {
          setAds(loadedAds.map(normalizeAd));
        }
      } catch (error) {
        console.error('Failed to load ads from backend:', error);
      }
    };

    loadAds();
  }, []);

  useEffect(() => {
    const loadPublicContent = async () => {
      try {
        const [footer, pages, blog] = await Promise.all([
          SettingsService.getFooter(),
          SettingsService.getStaticPages(),
          BlogService.getBlogPosts()
        ]);

        setFooterConfig(normalizeFooterConfig(footer));
        if (pages.length > 0) {
          setStaticPages(pages.map(normalizeStaticPage));
        }
        if (blog.data.length > 0) {
          setBlogPosts(blog.data.map(normalizeBlogPost));
        }
      } catch (error) {
        console.error('Failed to load public content from backend:', error);
      }
    };

    loadPublicContent();
  }, []);

  useEffect(() => {
    const loadProtectedData = async () => {
      if (!currentUser) {
        setUsers([]);
        setTicketHistory([]);
        return;
      }

      try {
        const tasks: Promise<any>[] = [
          PassengerService.getPassengers().then((items) => {
            if (items.length > 0) {
              setSavedPassengers(items.map((item) => ({
                id: item.id,
                firstName: item.firstName,
                lastName: item.lastName,
                gender: item.gender,
                passportNumber: item.passportNumber,
                nationality: item.nationality,
                totalFlights: item.totalFlights
              })));
            }
          }),
          TicketService.getTickets().then((items) => {
            setTicketHistory(items.map(normalizeTicket));
          }),
          BlogService.getBlogPosts().then((response) => {
            if (response.data.length > 0) {
              setBlogPosts(response.data.map(normalizeBlogPost));
            }
          })
        ];

        if (currentUser.role === 'Admin') {
          tasks.push(
            UserService.getUsers().then((items) => setUsers(items.map(normalizeUser))),
            RevenueService.getConfig().then((config) => setRevenueConfig(normalizeRevenueConfig(config))),
            SettingsService.getFooter().then((config) => setFooterConfig(normalizeFooterConfig(config))),
            SettingsService.getStaticPages().then((items) => {
              if (items.length > 0) {
                setStaticPages(items.map(normalizeStaticPage));
              }
            })
          );
        }

        await Promise.allSettled(tasks);
      } catch (error) {
        console.error('Failed to load protected admin data:', error);
      }
    };

    loadProtectedData();
  }, [currentUser]);

  const handlePassengerChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPassenger(prev => ({ ...prev, [name]: value }));
  };

  const handlePassengerSelectFromModal = (passengerId: string) => {
      const selected = savedPassengers.find(p => p.id === passengerId);
      if (selected) {
          setPassenger(prev => ({
              ...prev,
              firstName: selected.firstName,
              lastName: selected.lastName,
              passportNumber: selected.passportNumber,
              nationality: selected.nationality,
              gender: selected.gender
          }));
      }
      setShowPassengerModal(false);
  };

  const handleAgencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAgency(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAgency(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLogoVisibility = () => {
      setAgency(prev => ({ ...prev, showLogo: !prev.showLogo }));
  };

  const handleFlightChange = (flightNum: 1 | 2, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updateFn = flightNum === 1 ? setFlight1 : setFlight2;
    
    updateFn(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-fill Logic for Flight Number
      if (name === 'flightNumber') {
        const match = savedFlights.find(f => f.flightNumber === value);
        if (match) {
          const findCity = (code: string) => {
             const airport = savedAirports.find(a => a.code === code);
             return airport ? airport.city : code; 
          };

          const autoFillData: Partial<Flight> = {
            airline: match.airline,
            originCode: match.originCode,
            originName: findCity(match.originCode),
            originTime: match.departureTime,
            destCode: match.destCode,
            destName: findCity(match.destCode),
            destTime: match.arrivalTime,
          };

          if (match.date) {
              const isoDate = match.date;
              const [year, month, day] = isoDate.split('-').map(Number);
              const dateObj = new Date(year, month - 1, day);
              const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
              const formattedDate = `${day}/${monthName}/${year}`;
              autoFillData.isoDate = isoDate;
              autoFillData.date = formattedDate;
          }

          return {
            ...newData,
            ...autoFillData
          };
        }
      }

      // Auto-fill Logic for Origin Code
      if (name === 'originCode') {
          const airport = savedAirports.find(a => a.code.toUpperCase() === value.toUpperCase());
          if (airport) {
              newData.originName = airport.city;
          } else {
              newData.originName = '';
          }
      }

      // Auto-fill Logic for Destination Code
      if (name === 'destCode') {
          const airport = savedAirports.find(a => a.code.toUpperCase() === value.toUpperCase());
          if (airport) {
              newData.destName = airport.city;
          } else {
              newData.destName = '';
          }
      }

      return newData;
    });
  };

  const handleFlightDateChange = (flightNum: 1 | 2, e: ChangeEvent<HTMLInputElement>) => {
    const isoDate = e.target.value;
    if (!isoDate) return;
    const [year, month, day] = isoDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
    const formattedDate = `${day}/${monthName}/${year}`;
    const update = { isoDate, date: formattedDate };

    if (flightNum === 1) setFlight1(prev => ({ ...prev, ...update }));
    else setFlight2(prev => ({ ...prev, ...update }));
  };

  const toggleTripType = (type: TripType) => setTripType(type);

  // --- Auth Logic ---

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    setShowRegisterModal(false);
    
    // Auto-redirect to dashboard if admin or agent
    if (user.role === 'Admin' || user.role === 'Agent') {
        setView('dashboard');
    } else {
        // Normal users might want to issue tickets primarily
        setView('generator'); 
    }
  };
  
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      setView('generator');
    }
  };

  const handleSaveAd = async (ad: Ad) => {
    const payload = {
      location: serializeAdLocation(ad.location),
      title: ad.title,
      description: ad.description,
      ctaText: ad.ctaText,
      linkUrl: ad.linkUrl || 'https://example.com',
      imageUrl: ad.imageUrl,
      colorFrom: ad.colorFrom,
      colorTo: ad.colorTo,
      iconName: ad.iconName,
      isActive: ad.isActive,
      startDate: ad.startDate || undefined,
      endDate: ad.endDate || undefined
    };

    const savedAd = ad.id && ads.some((item) => item.id === ad.id)
      ? await AdService.updateAd(ad.id, payload)
      : await AdService.createAd(payload);

    const normalizedAd = normalizeAd(savedAd);
    setAds((prev) => {
      const exists = prev.some((item) => item.id === normalizedAd.id);
      return exists
        ? prev.map((item) => item.id === normalizedAd.id ? normalizedAd : item)
        : [...prev, normalizedAd];
    });
  };

  const handleDeleteAd = async (id: string) => {
    await AdService.deleteAd(id);
    setAds((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveUser = async (user: User & { password?: string }) => {
    const trimmedPassword = user.password?.trim();

    if (!user.id && !trimmedPassword) {
      throw new Error('Password is required for new users.');
    }

    const payload = {
      name: user.name.trim(),
      email: user.email.trim(),
      mobile: user.mobile.trim(),
      role: user.role === 'Admin' ? 'ADMIN' : user.role === 'Agent' ? 'AGENT' : 'USER',
      status: user.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
      credit: user.credit,
      isUnlimited: Boolean(user.isUnlimited),
      bonusFreeTickets: user.bonusFreeTickets || 0,
      ...(trimmedPassword ? { password: trimmedPassword } : {})
    };

    const savedUser = user.id
      ? await UserService.updateUser(user.id, payload)
      : await UserService.createUser({ ...payload, password: trimmedPassword! });

    setUsers((prev) => {
      const normalized = normalizeUser(savedUser);
      const exists = prev.some((item) => item.id === normalized.id);
      return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
    });
  };

  const handleDeleteUser = async (id: string) => {
    await UserService.deleteUser(id);
    setUsers((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleUserStatus = async (id: string) => {
    const updated = await UserService.toggleUserStatus(id);
    const normalized = normalizeUser(updated);
    setUsers((prev) => prev.map((item) => item.id === id ? { ...item, status: normalized.status } : item));
  };

  const handleSavePassenger = async (passengerData: SavedPassenger) => {
    const payload = {
      firstName: passengerData.firstName,
      lastName: passengerData.lastName,
      gender: passengerData.gender as 'Male' | 'Female',
      passportNumber: passengerData.passportNumber,
      nationality: passengerData.nationality,
      totalFlights: passengerData.totalFlights
    };

    const savedPassenger = passengerData.id
      ? await PassengerService.updatePassenger(passengerData.id, payload)
      : await PassengerService.createPassenger(payload);

    const normalized = {
      id: savedPassenger.id,
      firstName: savedPassenger.firstName,
      lastName: savedPassenger.lastName,
      gender: savedPassenger.gender,
      passportNumber: savedPassenger.passportNumber,
      nationality: savedPassenger.nationality,
      totalFlights: savedPassenger.totalFlights
    };

    setSavedPassengers((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
    });
  };

  const handleDeletePassenger = async (id: string) => {
    await PassengerService.deletePassenger(id);
    setSavedPassengers((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveAirline = async (airline: Airline) => {
    const saved = airline.id
      ? await BaseDataService.updateAirline(airline.id, { name: airline.name, code: airline.code, logoUrl: airline.logoUrl })
      : await BaseDataService.createAirline({ name: airline.name, code: airline.code, logoUrl: airline.logoUrl });

    const normalized = { id: saved.id, name: saved.name, code: saved.code, logoUrl: normalizeAssetUrl(saved.logoUrl) };
    setSavedAirlines((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
    });
  };

  const handleDeleteAirline = async (id: string) => {
    await BaseDataService.deleteAirline(id);
    setSavedAirlines((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveAirport = async (airport: Airport) => {
    const payload = { name: airport.name, code: airport.code, city: airport.city, country: airport.country };
    const saved = airport.id
      ? await BaseDataService.updateAirport(airport.id, payload)
      : await BaseDataService.createAirport(payload);

    const normalized = { id: saved.id, name: saved.name, code: saved.code, city: saved.city, country: saved.country };
    setSavedAirports((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
    });
  };

  const handleDeleteAirport = async (id: string) => {
    await BaseDataService.deleteAirport(id);
    setSavedAirports((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveFlight = async (flight: SavedFlight) => {
    const airlineId = flight.airlineId || savedAirlines.find((item) => item.name === flight.airline)?.id;
    if (!airlineId) {
      throw new Error('Airline must be selected before saving a flight.');
    }

    const payload = {
      flightNumber: flight.flightNumber,
      airlineId,
      originCode: flight.originCode,
      destCode: flight.destCode,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      date: flight.date
    };

    const saved = flight.id
      ? await BaseDataService.updateFlight(flight.id, payload)
      : await BaseDataService.createFlight(payload);

    const normalized = {
      id: saved.id,
      airlineId: saved.airlineId,
      flightNumber: saved.flightNumber,
      airline: saved.airline.name,
      originCode: saved.originCode,
      destCode: saved.destCode,
      departureTime: saved.departureTime,
      arrivalTime: saved.arrivalTime,
      date: saved.date
    };

    setSavedFlights((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
    });
  };

  const handleDeleteFlight = async (id: string) => {
    await BaseDataService.deleteFlight(id);
    setSavedFlights((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveBlogPost = async (post: BlogPost) => {
    const payload = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      status: post.status === 'Published' ? 'PUBLISHED' : 'DRAFT'
    };

    const saved = post.id
      ? await BlogService.updateBlogPost(post.id, payload)
      : await BlogService.createBlogPost(payload);

    const normalized = normalizeBlogPost(saved);
    setBlogPosts((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
    });
  };

  const handleDeleteBlogPost = async (id: string) => {
    await BlogService.deleteBlogPost(id);
    setBlogPosts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveFooter = async (config: FooterConfig) => {
    const saved = await SettingsService.updateFooter(serializeFooterConfig(config));
    setFooterConfig(normalizeFooterConfig(saved));
  };

  const handleSaveStaticPage = async (page: StaticPage) => {
    const payload = { slug: page.slug, title: page.title, content: page.content };
    const saved = page.id
      ? await SettingsService.updateStaticPage(page.id, payload)
      : await SettingsService.createStaticPage(payload);

    const normalized = normalizeStaticPage(saved);
    setStaticPages((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
    });
  };

  const handleDeleteStaticPage = async (id: string) => {
    await SettingsService.deleteStaticPage(id);
    setStaticPages((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveRevenueConfig = async (config: RevenueConfig) => {
    const saved = await RevenueService.updateConfig({
      modelType: config.modelType,
      fixedPrice: config.fixedPrice,
      globalFreeLimit: config.globalFreeLimit,
      tiers: config.tiers.map((tier) => ({
        id: tier.id,
        minQty: tier.minQty,
        maxQty: tier.maxQty,
        pricePerTicket: tier.pricePerTicket
      }))
    });

    setRevenueConfig(normalizeRevenueConfig(saved));
  };
  
  // --- Download & Payment Logic ---

  const startDownloadProcess = () => {
      setDownloadTimer(7); // 7 seconds countdown
      setShowDownloadLoader(true);
  };

  const handleDownloadRequest = () => {
    if (!currentUser) {
        setShowLoginModal(true);
        return;
    }

    // 1. Check Unlimited Access
    if (currentUser.isUnlimited) {
        startDownloadProcess();
        return;
    }

    // 2. Check Free Tickets
    if ((currentUser.bonusFreeTickets || 0) > 0) {
        // Decrement free ticket
        const updatedUser = { 
            ...currentUser, 
            bonusFreeTickets: (currentUser.bonusFreeTickets || 0) - 1 
        };
        setCurrentUser(updatedUser);
        // Alert handled by modal text implicitly
        startDownloadProcess();
        return;
    }

    // 3. Check Credit
    if (currentUser.credit >= TICKET_COST) {
        // Deduct credit
        const updatedUser = { 
            ...currentUser, 
            credit: currentUser.credit - TICKET_COST 
        };
        setCurrentUser(updatedUser);
        startDownloadProcess();
        return;
    }

    // 4. Insufficient Funds -> Trigger Payment Gateway
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
      if (currentUser) {
          const updatedUser = { 
              ...currentUser, 
              credit: currentUser.credit + TICKET_COST 
          };
          setCurrentUser(updatedUser);
          setShowPaymentModal(false);
          
          setTimeout(() => {
              handleDownloadRequest();
          }, 500);
      }
  };

  const printElement = (element: HTMLElement, fileName: string) => {
      const printWindow = window.open('', '_blank', 'width=900,height=1200');
      if (!printWindow) {
          alert('Please allow popups to print the ticket.');
          return;
      }

      printWindow.document.write(`
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${fileName}</title>
            <style>
              body { margin: 0; background: #f3f4f6; display: flex; justify-content: center; padding: 24px; }
              img { max-width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body>${element.outerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
  };

  const generatePdfFromRef = async (element: HTMLElement, fileName: string) => {
      if (!window.jspdf) {
          console.error('PDF library is not loaded. jsPDF is missing.');
          alert('PDF generator is not ready yet. Please refresh the page and try again.');
          return;
      }

      const hasUnsupportedColorFunction = (value: string) =>
          value.includes('oklch(') || value.includes('oklab(') || value.includes('color-mix(');

      const clampColorChannel = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

      const linearToSrgb = (value: number) => {
          const normalized = Math.max(0, Math.min(1, value));
          return normalized <= 0.0031308
              ? 12.92 * normalized
              : 1.055 * Math.pow(normalized, 1 / 2.4) - 0.055;
      };

      const oklabToRgb = (l: number, a: number, b: number) => {
          const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
          const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
          const sPrime = l - 0.0894841775 * a - 1.2914855480 * b;
          const l3 = lPrime ** 3;
          const m3 = mPrime ** 3;
          const s3 = sPrime ** 3;

          const r = linearToSrgb(4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3);
          const g = linearToSrgb(-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3);
          const blue = linearToSrgb(-0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3);

          return `rgb(${clampColorChannel(r * 255)}, ${clampColorChannel(g * 255)}, ${clampColorChannel(blue * 255)})`;
      };

      const parseModernColorNumbers = (raw: string) =>
          raw
              .replace(/\s*\/\s*[^ ]+$/, '')
              .trim()
              .split(/\s+/)
              .map((part) => part.endsWith('%') ? Number(part.slice(0, -1)) / 100 : Number(part));

      const normalizeModernCssColors = (value: string) => {
          if (!hasUnsupportedColorFunction(value)) return value;

          return value
              .replace(/oklch\(([^)]+)\)/g, (_match, rawChannels) => {
                  const [l = 0, c = 0, h = 0] = parseModernColorNumbers(rawChannels);
                  const hueRadians = (h * Math.PI) / 180;
                  return oklabToRgb(l, c * Math.cos(hueRadians), c * Math.sin(hueRadians));
              })
              .replace(/oklab\(([^)]+)\)/g, (_match, rawChannels) => {
                  const [l = 0, a = 0, b = 0] = parseModernColorNumbers(rawChannels);
                  return oklabToRgb(l, a, b);
              });
      };

      const inlineComputedStyles = (sourceRoot: HTMLElement, clonedRoot: HTMLElement) => {
          const sourceNodes = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll<HTMLElement>('*'))];
          const clonedNodes = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll<HTMLElement>('*'))];
          const svgRootProperties = new Set([
              'color',
              'display',
              'flex',
              'flex-basis',
              'flex-grow',
              'flex-shrink',
              'height',
              'margin',
              'margin-bottom',
              'margin-left',
              'margin-right',
              'margin-top',
              'opacity',
              'rotate',
              'transform',
              'transform-origin',
              'translate',
              'width'
          ]);
          const svgChildProperties = new Set(['color', 'fill', 'opacity', 'stroke', 'stroke-width']);

          sourceNodes.forEach((sourceNode, index) => {
              const clonedNode = clonedNodes[index];
              if (!clonedNode) return;

              const computed = window.getComputedStyle(sourceNode);
              const isSvgElement = sourceNode instanceof SVGElement;
              const isSvgRoot = isSvgElement && sourceNode.tagName.toLowerCase() === 'svg';
              const allowedSvgProperties = isSvgRoot ? svgRootProperties : svgChildProperties;
              for (const propertyName of Array.from(computed)) {
                  if (propertyName.startsWith('--')) continue;
                  if (isSvgElement && !allowedSvgProperties.has(propertyName)) continue;
                  let propertyValue = computed.getPropertyValue(propertyName);
                  if (!propertyValue) continue;

                  propertyValue = normalizeModernCssColors(propertyValue);
                  if (!propertyValue || hasUnsupportedColorFunction(propertyValue)) {
                      if (propertyName === 'background-image') {
                          clonedNode.style.setProperty(propertyName, 'none');
                      } else {
                          clonedNode.style.removeProperty(propertyName);
                      }
                      continue;
                  }

                  clonedNode.style.setProperty(propertyName, propertyValue, computed.getPropertyPriority(propertyName));
              }

              clonedNode.removeAttribute('class');
          });
      };

      const stabilizeSvgIcons = (root: HTMLElement) => {
          root.querySelectorAll<SVGElement>('svg').forEach((svg) => {
              const width = svg.style.width || svg.getAttribute('width') || '1em';
              const height = svg.style.height || svg.getAttribute('height') || '1em';
              svg.style.setProperty('display', 'block');
              svg.style.setProperty('flex-shrink', '0');
              svg.style.setProperty('overflow', 'visible');
              svg.setAttribute('width', width);
              svg.setAttribute('height', height);
          });
      };

      const normalizeTransformsForCanvas = (sourceRoot: HTMLElement, clonedRoot: HTMLElement) => {
          const sourceNodes = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll<HTMLElement>('*'))];
          const clonedNodes = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll<HTMLElement>('*'))];
          const splitTransformValue = (value: string) => value.trim().split(/\s+/).filter(Boolean);
          const formatTranslate = (value: string) => {
              const [x = '0px', y = '0px'] = splitTransformValue(value);
              return `translate(${x}, ${y})`;
          };
          const formatScale = (value: string) => {
              const [x = '1', y] = splitTransformValue(value);
              return y ? `scale(${x}, ${y})` : `scale(${x})`;
          };

          sourceNodes.forEach((sourceNode, index) => {
              const clonedNode = clonedNodes[index];
              if (!clonedNode) return;

              const computed = window.getComputedStyle(sourceNode);
              const transform = computed.getPropertyValue('transform');
              const translate = computed.getPropertyValue('translate');
              const rotate = computed.getPropertyValue('rotate');
              const scale = computed.getPropertyValue('scale');
              const transformParts: string[] = [];

              if (translate && translate !== 'none') {
                  transformParts.push(formatTranslate(translate));
              }

              if (rotate && rotate !== 'none') {
                  transformParts.push(`rotate(${rotate})`);
              }

              if (scale && scale !== 'none') {
                  transformParts.push(formatScale(scale));
              }

              if (transform && transform !== 'none') {
                  transformParts.push(transform);
              }

              if (transformParts.length > 0) {
                  clonedNode.style.setProperty('transform', transformParts.join(' '));
                  clonedNode.style.removeProperty('translate');
                  clonedNode.style.removeProperty('rotate');
                  clonedNode.style.removeProperty('scale');
              }
          });
      };

      const removeUnsupportedInlineStyles = (root: HTMLElement) => {
          const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];

          nodes.forEach((node) => {
              for (const propertyName of Array.from(node.style)) {
                  const propertyValue = node.style.getPropertyValue(propertyName);
                  if (!propertyValue) continue;

                  const normalizedValue = normalizeModernCssColors(propertyValue);
                  if (normalizedValue && !hasUnsupportedColorFunction(normalizedValue)) {
                      node.style.setProperty(propertyName, normalizedValue, node.style.getPropertyPriority(propertyName));
                  } else if (propertyName === 'background-image') {
                      node.style.setProperty(propertyName, 'none');
                  } else {
                      node.style.removeProperty(propertyName);
                  }
              }
          });
      };

      const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error || new Error('Failed to read image data'));
          reader.readAsDataURL(blob);
      });

      const safeInlineTicketImages = async (clonedRoot: HTMLElement) => {
          const images = Array.from(clonedRoot.querySelectorAll<HTMLImageElement>('img'));
          const pdfAssetProxyUrl = (assetUrl: string) => {
              const apiBaseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
              const proxyUrl = new URL(`${apiBaseUrl}/assets/proxy`, window.location.origin);
              proxyUrl.searchParams.set('url', assetUrl);
              return proxyUrl.toString();
          };

          const fetchImageBlob = async (url: string) => {
              const response = await fetch(url, { mode: 'cors', credentials: 'same-origin' });
              if (!response.ok) {
                  throw new Error(`Image request failed with status ${response.status}`);
              }

              const contentType = response.headers.get('content-type') || '';
              if (!contentType.startsWith('image/')) {
                  throw new Error('Image request did not return an image');
              }

              return response.blob();
          };

          await Promise.all(images.map(async (image) => {
              const src = image.getAttribute('src');
              if (!src || src.startsWith('data:')) return;

              try {
                  const absoluteUrl = new URL(src, window.location.href).toString();
                  let imageBlob: Blob;

                  try {
                      imageBlob = await fetchImageBlob(absoluteUrl);
                  } catch (directFetchError) {
                      imageBlob = await fetchImageBlob(pdfAssetProxyUrl(absoluteUrl));
                  }

                  image.setAttribute('src', await blobToDataUrl(imageBlob));
              } catch (error) {
                  console.warn('Skipping image that cannot be safely embedded in PDF:', src, error);
                  image.removeAttribute('src');
                  image.style.visibility = 'hidden';
              }
          }));
      };

      const waitForTicketImages = async (root: HTMLElement) => {
          const images = Array.from(root.querySelectorAll<HTMLImageElement>('img'));

          await Promise.all(images.map(async (image) => {
              if (!image.getAttribute('src')) return;
              try {
                  if ('decode' in image) {
                      await image.decode();
                  } else if (!image.complete) {
                      await new Promise<void>((resolve) => {
                          image.onload = () => resolve();
                          image.onerror = () => resolve();
                      });
                  }
              } catch {
                  // A failed optional logo should not block the PDF.
              }
          }));
      };

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.dir = 'ltr'; // Force LTR for PDF generation

      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '794px';
      iframe.style.height = `${element.scrollHeight || 1123}px`;
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const iframeDocument = iframe.contentDocument;
      if (!iframeDocument) {
          document.body.removeChild(iframe);
          throw new Error('Failed to initialize isolated PDF document');
      }

      iframeDocument.open();
      iframeDocument.write(`
        <!doctype html>
        <html dir="ltr">
          <head>
            <meta charset="utf-8" />
            <style>
              html, body { margin: 0; padding: 0; background: #ffffff; }
              body { width: 794px; color: rgb(17, 24, 39); }
              * {
                box-sizing: border-box;
                color-scheme: light;
                border-color: rgb(229, 231, 235);
              }
            </style>
          </head>
          <body></body>
        </html>
      `);
      iframeDocument.close();

      iframeDocument.body.appendChild(clone);

      try {
          inlineComputedStyles(element, clone);
          stabilizeSvgIcons(clone);
          normalizeTransformsForCanvas(element, clone);
          removeUnsupportedInlineStyles(clone);
          await safeInlineTicketImages(clone);
          await waitForTicketImages(clone);
          await iframe.contentWindow?.document.fonts?.ready;

          const width = Math.ceil(clone.scrollWidth || 794);
          const height = Math.ceil(clone.scrollHeight || element.scrollHeight || 1123);
          const canvas = await html2canvas(clone, {
              backgroundColor: '#ffffff',
              scale: 2,
              useCORS: true,
              allowTaint: false,
              logging: false,
              width,
              height,
              windowWidth: width,
              windowHeight: height,
              scrollX: 0,
              scrollY: 0
          });

          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${fileName}.pdf`);
      } catch (err) {
          console.error(err);
          alert("Error generating PDF");
      } finally {
          document.body.removeChild(iframe);
      }
  };

  const buildFlightFromRoute = (
    routeLabel: string,
    fallbackDate: string,
    type: Flight['type']
  ): Flight => {
    const [rawOrigin = '', rawDestination = ''] = routeLabel.split('-').map((segment) => segment.trim());
    const findAirport = (value: string) => {
      const normalized = value.toUpperCase();
      return savedAirports.find((airport) =>
        airport.code.toUpperCase() === normalized ||
        airport.name.toUpperCase() === normalized ||
        airport.city.toUpperCase() === normalized
      );
    };

    const originAirport = findAirport(rawOrigin);
    const destinationAirport = findAirport(rawDestination);

    const matchingSavedFlight = savedFlights.find((flight) => {
      const sameOrigin = flight.originCode.toUpperCase() === (originAirport?.code || rawOrigin).toUpperCase();
      const sameDestination = flight.destCode.toUpperCase() === (destinationAirport?.code || rawDestination).toUpperCase();
      const sameDate = !flight.date || flight.date === fallbackDate;
      return sameOrigin && sameDestination && sameDate;
    });

    return {
      ...(type === 'Return Flight' ? INITIAL_FLIGHT_2 : INITIAL_FLIGHT_1),
      type,
      date: fallbackDate || INITIAL_FLIGHT_1.date,
      isoDate: fallbackDate,
      originCode: originAirport?.code || rawOrigin || INITIAL_FLIGHT_1.originCode,
      originName: originAirport?.name || rawOrigin || INITIAL_FLIGHT_1.originName,
      destCode: destinationAirport?.code || rawDestination || INITIAL_FLIGHT_1.destCode,
      destName: destinationAirport?.name || rawDestination || INITIAL_FLIGHT_1.destName,
      flightNumber: matchingSavedFlight?.flightNumber || (type === 'Return Flight' ? INITIAL_FLIGHT_2.flightNumber : INITIAL_FLIGHT_1.flightNumber),
      originTime: matchingSavedFlight?.departureTime || (type === 'Return Flight' ? INITIAL_FLIGHT_2.originTime : INITIAL_FLIGHT_1.originTime),
      destTime: matchingSavedFlight?.arrivalTime || (type === 'Return Flight' ? INITIAL_FLIGHT_2.destTime : INITIAL_FLIGHT_1.destTime),
      airline: matchingSavedFlight?.airline || (type === 'Return Flight' ? INITIAL_FLIGHT_2.airline : INITIAL_FLIGHT_1.airline)
    };
  };

  const buildTicketDataFromHistory = (item: TicketHistoryItem, snapshot?: Partial<TicketData> | null): TicketData => {
    if (snapshot?.passenger && Array.isArray(snapshot.flights) && snapshot.flights.length > 0) {
      return {
        passenger: {
          ...INITIAL_PASSENGER,
          ...snapshot.passenger,
          ticketId: snapshot.passenger.ticketId || item.ticketId,
          pnr: snapshot.passenger.pnr || item.pnr,
          price: snapshot.passenger.price || item.price
        },
        flights: snapshot.flights.map((flight, index) => ({
          ...(index === 0 ? INITIAL_FLIGHT_1 : INITIAL_FLIGHT_2),
          ...flight,
          type: index === 0 ? 'Go Flight' : 'Return Flight'
        })),
        tripType: snapshot.tripType || (snapshot.flights.length > 1 ? TripType.ROUND_TRIP : TripType.ONE_WAY),
        agency: { ...agency, ...(snapshot.agency || {}) },
        showPrice: snapshot.showPrice ?? true,
        isLoggedIn: true,
        templateId: snapshot.templateId || selectedTemplate
      };
    }

    const passengerParts = item.passengerName.trim().split(/\s+/);
    const fallbackDate = item.date || INITIAL_FLIGHT_1.isoDate || INITIAL_FLIGHT_1.date;
    const outboundFlight = buildFlightFromRoute(item.route, fallbackDate, 'Go Flight');

    return {
      passenger: {
        ...INITIAL_PASSENGER,
        firstName: passengerParts[0] || INITIAL_PASSENGER.firstName,
        lastName: passengerParts.slice(1).join(' ') || INITIAL_PASSENGER.lastName,
        ticketId: item.ticketId,
        pnr: item.pnr,
        price: item.price
      },
      flights: [outboundFlight],
      tripType: TripType.ONE_WAY,
      agency,
      showPrice: true,
      isLoggedIn: true,
      templateId: selectedTemplate
    };
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    try {
      if (view === 'generator' && ticketRef.current) {
        await generatePdfFromRef(ticketRef.current, `Ticket-${passenger.lastName}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistoryDownload = async (item: TicketHistoryItem) => {
      try {
          const detailedTicket = await TicketService.getTicket(item.id);
          const preparedTicket = buildTicketDataFromHistory(item, (detailedTicket as any).snapshot);
          setHistoryTicketData(preparedTicket);
          setPendingHistoryDownloadFileName(`Ticket-${preparedTicket.passenger.lastName || item.ticketId}`);
      } catch (error) {
          console.error('Failed to prepare history ticket PDF:', error);
          const preparedTicket = buildTicketDataFromHistory(item, null);
          setHistoryTicketData(preparedTicket);
          setPendingHistoryDownloadFileName(`Ticket-${preparedTicket.passenger.lastName || item.ticketId}`);
      }
  };

  useEffect(() => {
    if (!historyTicketData || !pendingHistoryDownloadFileName || !historyPrintRef.current) {
      return;
    }

    let cancelled = false;

    const exportHistoryTicket = async () => {
      setIsGenerating(true);
      try {
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
        if (!cancelled && historyPrintRef.current) {
          await generatePdfFromRef(historyPrintRef.current, pendingHistoryDownloadFileName);
        }
      } finally {
        if (!cancelled) {
          setHistoryTicketData(null);
          setPendingHistoryDownloadFileName(null);
          setIsGenerating(false);
        }
      }
    };

    exportHistoryTicket();

    return () => {
      cancelled = true;
    };
  }, [historyTicketData, pendingHistoryDownloadFileName]);

  const getAd = (loc: string) => {
     const today = new Date().toISOString().split('T')[0];
     return ads.find(a => {
         if (a.location !== loc) return false;
         if (!a.isActive) return false;
         if (a.startDate && a.startDate > today) return false;
         if (a.endDate && a.endDate < today) return false;
         return true;
     });
  };

  const activeStaticPage = staticPages.find(p => p.slug === activePageSlug);

  return (
    <div className={`min-h-screen ${isRTL ? 'font-vazir' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="w-full px-6 py-3 flex justify-between items-center">
           <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => setView('generator')}>
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200">
                 <Plane className={`w-6 h-6 ${isGenerating ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                  <h1 className="text-xl font-bold text-gray-800 tracking-tight">{t('title')}</h1>
                  <p className="hidden md:block text-xs text-gray-500">{t('subtitle')}</p>
              </div>
           </div>

           <div className="flex items-center gap-3">
              {/* Blog Link in Header */}
              <button onClick={() => setView('blog')} className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <BookOpen className="w-4 h-4" /> Blog
              </button>

              {currentUser ? (
                  <>
                     <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                             {currentUser.name.charAt(0)}
                         </div>
                         <div className="flex flex-col text-right">
                             <span className="text-xs font-bold text-gray-700">{currentUser.name}</span>
                             <span className="text-[10px] text-gray-500">${currentUser.credit}</span>
                         </div>
                     </div>
                     {currentUser.role !== 'User' && (
                         <button 
                             onClick={() => setView(view === 'dashboard' ? 'generator' : 'dashboard')}
                             className={`p-2 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                             title="Toggle Dashboard"
                         >
                             <LayoutDashboard className="w-5 h-5" />
                         </button>
                     )}
                     <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title={t('logout')}>
                         <LogOut className="w-5 h-5" />
                     </button>
                  </>
              ) : (
                  <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-shadow shadow-md">
                      <LogIn className="w-4 h-4" /> {t('login')}
                  </button>
              )}
              
              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              <div className="flex bg-gray-100 rounded-lg p-1">
                 <button onClick={() => setLang('en')} className={`px-2 py-1 rounded text-xs font-bold ${lang === 'en' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>EN</button>
                 <button onClick={() => setLang('fa')} className={`px-2 py-1 rounded text-xs font-bold ${lang === 'fa' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>FA</button>
                 <button onClick={() => setLang('ar')} className={`px-2 py-1 rounded text-xs font-bold ${lang === 'ar' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>AR</button>
              </div>
           </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="min-h-[calc(100vh-64px)]">
        {view === 'dashboard' && currentUser ? (
            <Dashboard 
                currentUser={currentUser}
                users={users}
                tickets={ticketHistory}
                savedFlights={savedFlights} setSavedFlights={setSavedFlights}
                savedAirports={savedAirports} setSavedAirports={setSavedAirports}
                savedAirlines={savedAirlines} setSavedAirlines={setSavedAirlines}
                savedPassengers={savedPassengers} setSavedPassengers={setSavedPassengers}
                ads={ads} setAds={setAds}
                templates={templates} setTemplates={setTemplates}
                footerConfig={footerConfig} setFooterConfig={setFooterConfig}
                staticPages={staticPages} setStaticPages={setStaticPages}
                blogPosts={blogPosts} setBlogPosts={setBlogPosts}
                revenueConfig={revenueConfig} setRevenueConfig={setRevenueConfig}
                lang={lang} t={t}
                onDownloadTicket={handleHistoryDownload}
                onSaveUser={handleSaveUser}
                onDeleteUser={handleDeleteUser}
                onToggleUserStatus={handleToggleUserStatus}
                onSavePassenger={handleSavePassenger}
                onDeletePassenger={handleDeletePassenger}
                onSaveAirline={handleSaveAirline}
                onDeleteAirline={handleDeleteAirline}
                onSaveAirport={handleSaveAirport}
                onDeleteAirport={handleDeleteAirport}
                onSaveFlight={handleSaveFlight}
                onDeleteFlight={handleDeleteFlight}
                onSaveAd={handleSaveAd}
                onDeleteAd={handleDeleteAd}
                onSaveBlogPost={handleSaveBlogPost}
                onDeleteBlogPost={handleDeleteBlogPost}
                onSaveFooter={handleSaveFooter}
                onSaveStaticPage={handleSaveStaticPage}
                onDeleteStaticPage={handleDeleteStaticPage}
                onSaveRevenueConfig={handleSaveRevenueConfig}
            />
        ) : view === 'blog' ? (
            <BlogView posts={blogPosts} onBack={() => setView('generator')} t={t} isRTL={isRTL} />
        ) : view === 'page' && activeStaticPage ? (
            <StaticPageView page={activeStaticPage} onBack={() => setView('generator')} t={t} />
        ) : (
            <div className="w-full p-4 md:p-8 flex flex-col lg:flex-row gap-8">
                {/* Form Section */}
                <div className="w-full lg:w-[450px] flex-shrink-0 space-y-6">
                    {/* AD SPOT 1 */}
                    {getAd('spot_1') && <AdBanner 
                        icon={ICON_MAP[getAd('spot_1')!.iconName] || Sparkles} 
                        title={getAd('spot_1')!.title} 
                        desc={getAd('spot_1')!.description} 
                        cta={getAd('spot_1')!.ctaText} 
                        linkUrl={getAd('spot_1')!.linkUrl}
                        imageUrl={getAd('spot_1')!.imageUrl}
                        colorFrom={getAd('spot_1')!.colorFrom}
                        colorTo={getAd('spot_1')!.colorTo}
                        isRTL={isRTL} 
                    />}

                    {/* Agency Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                           <Building2 className="w-5 h-5 text-blue-500" /> {t('agency')}
                        </h2>
                        <div className="space-y-4">
                            <Input label={t('agencyName')} name="name" value={agency.name} onChange={handleAgencyChange} />
                            <Input label={t('phone')} name="phone" value={agency.phone} onChange={handleAgencyChange} />
                            
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">{t('logo')}</label>
                                <div className="flex items-center gap-3">
                                    <div className="relative overflow-hidden group">
                                         <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                                         <label htmlFor="logo-upload" className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors">
                                            <Upload className="w-4 h-4" /> {t('upload')}
                                         </label>
                                    </div>
                                    <button onClick={toggleLogoVisibility} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${agency.showLogo ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                        {agency.showLogo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} {agency.showLogo ? 'Visible' : 'Hidden'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trip Type */}
                    <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 flex">
                        <button onClick={() => toggleTripType(TripType.ONE_WAY)} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${tripType === TripType.ONE_WAY ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /> {t('oneWay')}
                        </button>
                        <button onClick={() => toggleTripType(TripType.ROUND_TRIP)} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${tripType === TripType.ROUND_TRIP ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <ArrowRightLeft className="w-4 h-4" /> {t('roundTrip')}
                        </button>
                    </div>

                    {/* Passenger Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative">
                        <div className="flex justify-between items-center mb-4">
                           <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                             <UserCircle className="w-5 h-5 text-blue-500" /> {t('passenger')}
                           </h2>
                           <button onClick={() => setShowPassengerModal(true)} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                               <Users className="w-3 h-3"/> {t('selectSaved')}
                           </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input label={t('firstName')} name="firstName" value={passenger.firstName} onChange={handlePassengerChange} placeholder="LATIN ONLY" className="uppercase" />
                            <Input label={t('lastName')} name="lastName" value={passenger.lastName} onChange={handlePassengerChange} placeholder="LATIN ONLY" className="uppercase" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">{t('gender')}</label>
                                <select name="gender" value={passenger.gender} onChange={handlePassengerChange} className="w-full p-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:bg-white outline-none">
                                    <option value="Male">{t('male')}</option>
                                    <option value="Female">{t('female')}</option>
                                </select>
                            </div>
                            <Input label={t('nationality')} name="nationality" value={passenger.nationality} onChange={handlePassengerChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                             <div>
                                 <div className="flex gap-4 mb-2 px-1">
                                     <label className="flex items-center gap-2 cursor-pointer">
                                         <input 
                                             type="radio" 
                                             name="idType" 
                                             checked={passenger.idType !== 'NationalID'} // Default or Passport
                                             onChange={() => setPassenger(prev => ({ ...prev, idType: 'Passport' }))}
                                             className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                         />
                                         <span className="text-xs font-medium text-gray-700">{t('passport')}</span>
                                     </label>
                                     <label className="flex items-center gap-2 cursor-pointer">
                                         <input 
                                             type="radio" 
                                             name="idType" 
                                             checked={passenger.idType === 'NationalID'}
                                             onChange={() => setPassenger(prev => ({ ...prev, idType: 'NationalID' }))}
                                             className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                         />
                                         <span className="text-xs font-medium text-gray-700">{t('nationalId')}</span>
                                     </label>
                                 </div>
                                 <Input 
                                    label={passenger.idType === 'NationalID' ? t('nationalId') : t('passport')} 
                                    name="passportNumber" 
                                    value={passenger.passportNumber} 
                                    onChange={handlePassengerChange} 
                                 />
                             </div>
                             <Input label={t('ticketId')} name="ticketId" value={passenger.ticketId} onChange={handlePassengerChange} className="mt-8" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                             <Input label={t('pnr')} name="pnr" value={passenger.pnr} onChange={handlePassengerChange} />
                             {(selectedTemplate === '7' || selectedTemplate === '8') && <Input label={t('localPnr')} name="localPnr" value={passenger.localPnr || ''} onChange={handlePassengerChange} />}
                        </div>
                        <div className="mt-3 relative">
                            <Input label={t('price')} name="price" value={passenger.price || ''} onChange={handlePassengerChange} />
                            <button onClick={() => setShowPrice(!showPrice)} className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-8 text-gray-400 hover:text-blue-600`}>
                                {showPrice ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
                            </button>
                        </div>
                    </div>

                    {/* AD SPOT 2 */}
                    {getAd('spot_2') && <AdBanner 
                        icon={ICON_MAP[getAd('spot_2')!.iconName] || ShieldPlus} 
                        title={getAd('spot_2')!.title} 
                        desc={getAd('spot_2')!.description} 
                        cta={getAd('spot_2')!.ctaText} 
                        linkUrl={getAd('spot_2')!.linkUrl}
                        imageUrl={getAd('spot_2')!.imageUrl}
                        colorFrom={getAd('spot_2')!.colorFrom}
                        colorTo={getAd('spot_2')!.colorTo}
                        isRTL={isRTL} 
                    />}

                    {/* Flight Forms */}
                    <FlightForm title={t('goFlight')} data={flight1} onChange={(e: any) => handleFlightChange(1, e)} onDateChange={(e: any) => handleFlightDateChange(1, e)} isSepehr={selectedTemplate === '7' || selectedTemplate === '8'} t={t} isRTL={isRTL} airports={savedAirports} />
                    
                    {tripType === TripType.ROUND_TRIP && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                             <FlightForm title={t('returnFlight')} data={flight2} onChange={(e: any) => handleFlightChange(2, e)} onDateChange={(e: any) => handleFlightDateChange(2, e)} isSepehr={selectedTemplate === '7' || selectedTemplate === '8'} t={t} isRTL={isRTL} airports={savedAirports} />
                        </div>
                    )}

                    {/* AD SPOT 3 */}
                    {getAd('spot_3') && <AdBanner 
                        icon={ICON_MAP[getAd('spot_3')!.iconName] || Hotel} 
                        title={getAd('spot_3')!.title} 
                        desc={getAd('spot_3')!.description} 
                        cta={getAd('spot_3')!.ctaText} 
                        linkUrl={getAd('spot_3')!.linkUrl}
                        imageUrl={getAd('spot_3')!.imageUrl}
                        colorFrom={getAd('spot_3')!.colorFrom}
                        colorTo={getAd('spot_3')!.colorTo}
                        isRTL={isRTL} 
                    />}

                    <button 
                        onClick={handleDownloadRequest}
                        disabled={isGenerating || showDownloadLoader}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-200 font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Download className="w-5 h-5" />
                        )}
                        {isGenerating ? t('generating') : t('downloadPdf')}
                    </button>
                    
                    {!currentUser && <p className="text-center text-xs text-gray-400">{t('subtitleGuest')}</p>}
                </div>

                {/* Preview Section */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 justify-between items-center sticky top-20 z-20">
                         <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                             <Palette className="w-4 h-4 text-gray-400" /> {t('selectDesign')}
                         </div>
                         <div className="flex gap-2">
                             <div className="flex bg-gray-100 p-1 rounded-lg">
                                 <button onClick={() => setTemplateCategory('horizontal')} className={`p-2 rounded-md transition-all ${templateCategory === 'horizontal' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}><Grid className="w-4 h-4"/></button>
                                 <button onClick={() => setTemplateCategory('vertical')} className={`p-2 rounded-md transition-all ${templateCategory === 'vertical' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}><AlignVerticalJustifyCenter className="w-4 h-4"/></button>
                             </div>
                         </div>
                    </div>

                    {/* Template Gallery */}
                    <div className="flex gap-4 overflow-x-auto pb-4 mb-4 snap-x">
                        {templates.filter(tpl => (templateCategory === 'horizontal' ? ['1','2','3','4','7', '8'].includes(tpl.id) : ['5','6'].includes(tpl.id))).map(tpl => (
                            <button 
                                key={tpl.id}
                                onClick={() => setSelectedTemplate(tpl.id)}
                                className={`flex-shrink-0 w-32 md:w-40 snap-start p-3 rounded-xl border-2 transition-all text-left group ${selectedTemplate === tpl.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200 ring-offset-2' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                            >
                                <div className={`h-20 rounded-lg ${tpl.thumbnailColor} mb-3 shadow-inner relative overflow-hidden`}>
                                     {/* Mini Visual of Layout */}
                                     <div className="absolute top-2 left-2 right-2 h-2 bg-white/20 rounded-sm"></div>
                                     <div className="absolute top-5 left-2 w-8 h-8 bg-white/20 rounded-full"></div>
                                     {!tpl.isActive && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Lock className="w-4 h-4 text-white"/></div>}
                                </div>
                                <h3 className={`font-bold text-xs mb-1 ${selectedTemplate === tpl.id ? 'text-blue-700' : 'text-gray-700'}`}>{tpl.name}</h3>
                            </button>
                        ))}
                    </div>

                    {/* Live Preview Container */}
                    <div ref={previewContainerRef} className="flex-1 bg-gray-200/50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center p-4 md:p-8 overflow-hidden relative min-h-[500px]" dir="ltr">
                        <div className="absolute top-4 right-4 bg-black/75 text-white text-[10px] px-2 py-1 rounded-full font-mono z-10 pointer-events-none">
                            {t('preview')} {(previewScale * 100).toFixed(0)}%
                        </div>
                        
                        <div style={{ 
                            transform: `scale(${previewScale})`, 
                            transformOrigin: 'top center', 
                            transition: 'transform 0.2s',
                            marginBottom: `-${ticketHeight * (1 - previewScale)}px` // Fix gap from scaling
                        }}>
                           <TicketPreview 
                                ref={ticketRef}
                                data={{
                                    passenger,
                                    flights: tripType === TripType.ROUND_TRIP ? [flight1, flight2] : [flight1],
                                    tripType,
                                    agency,
                                    showPrice,
                                    isLoggedIn: !!currentUser,
                                    templateId: selectedTemplate
                                }} 
                           />
                        </div>

                        {/* NEW VERTICAL ADS - Inside the preview box */}
                        <div className="w-full max-w-[794px] mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                             {getAd('spot_bottom_1') && <VerticalAdCard ad={getAd('spot_bottom_1')!} isRTL={isRTL} />}
                             {getAd('spot_bottom_2') && <VerticalAdCard ad={getAd('spot_bottom_2')!} isRTL={isRTL} />}
                             {getAd('spot_bottom_3') && <VerticalAdCard ad={getAd('spot_bottom_3')!} isRTL={isRTL} />}
                        </div>
                    </div>

                    {/* AD SPOT 4 (Footer Ad) */}
                    <div className="mt-6 space-y-6">
                        {/* Existing Horizontal Bottom Banner */}
                        {getAd('spot_4') && <AdBanner 
                            icon={ICON_MAP[getAd('spot_4')!.iconName] || Zap} 
                            title={getAd('spot_4')!.title} 
                            desc={getAd('spot_4')!.description} 
                            cta={getAd('spot_4')!.ctaText} 
                            linkUrl={getAd('spot_4')!.linkUrl}
                            imageUrl={getAd('spot_4')!.imageUrl}
                            colorFrom={getAd('spot_4')!.colorFrom}
                            colorTo={getAd('spot_4')!.colorTo}
                            isRTL={isRTL} 
                        />}
                    </div>
                </div>
            </div>
        )}
      </main>
      
      {/* Footer */}
      <Footer t={t} isRTL={isRTL} config={footerConfig} onNavigate={handleNavigate} />

      {/* Modals */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLoginSuccess} onRegisterClick={() => {setShowLoginModal(false); setShowRegisterModal(true)}} t={t} isRTL={isRTL} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} onRegister={handleLoginSuccess} t={t} isRTL={isRTL} />}
      {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} onPaymentSuccess={handlePaymentSuccess} amount="10" t={t} />}
      {showPassengerModal && <PassengerSelectModal passengers={savedPassengers} onClose={() => setShowPassengerModal(false)} onSelect={handlePassengerSelectFromModal} t={t} isRTL={isRTL} />}
      
      {/* Download Loader Modal */}
      {showDownloadLoader && <DownloadLoadingModal isRTL={isRTL} t={t} ad={getAd('spot_popup')} timer={downloadTimer} />}

      {/* Hidden Print Container for History */}
      {historyTicketData && (
          <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }} dir="ltr">
              <TicketPreview ref={historyPrintRef} data={historyTicketData} />
          </div>
      )}

    </div>
  );
}
