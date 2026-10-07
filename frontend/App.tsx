
import { useState, useRef, useEffect, useMemo, ChangeEvent } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { TicketPreview } from './components/TicketPreview';
import { SafeAirlineLogo } from './components/SafeAirlineLogo';
import { Dashboard } from './components/Dashboard';
import { TicketData, TripType, Flight, Passenger, AgencyData, SavedFlight, Airport, User, SavedPassenger, Permission, Language, TicketHistoryItem, Ad, TicketTemplate, FooterConfig, BlogPost, StaticPage, RevenueConfig, Airline, TicketPricingConfig } from './types';
import { Download, Plane, Users, ArrowRightLeft, ArrowRight, Building2, Upload, Eye, EyeOff, Calendar, UserCircle, LogIn, LogOut, LayoutDashboard, FileText, X, Smartphone, Lock, Palette, Grid, AlignVerticalJustifyCenter, CreditCard, ShieldCheck, RefreshCw, UserCheck, Search, CheckCircle2, Globe, Sparkles, Hotel, ShieldPlus, ChevronRight, ChevronDown, Zap, Gift, Megaphone, Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, PhoneCall, Loader2, BookOpen, Tag, Clock, Coins, Coffee } from 'lucide-react';
import { translations } from './translations';
import { AIRLINES_CATALOG } from './src/data/airlinesCatalog';
import { COMPREHENSIVE_AIRPORTS } from './src/data/airportsCatalog';
import { getReliableAirlineLogo, generateDynamicAirlineEmblem } from './src/utils/airlineEmblems';
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
  credit: user.creditIrr ?? user.credit ?? 0,
  creditIrr: user.creditIrr ?? user.credit ?? 0,
  creditUsd: user.creditUsd ?? 0,
  giftCredit: user.giftCreditIrr ?? user.giftCredit ?? 0,
  giftCreditIrr: user.giftCreditIrr ?? user.giftCredit ?? 0,
  giftCreditUsd: user.giftCreditUsd ?? 0,
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

const INITIAL_AIRLINES: Airline[] = AIRLINES_CATALOG.map((item) => ({
  id: `air_${item.code.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
  name: item.name,
  code: item.code,
  logoUrl: item.logoUrl
}));

const INITIAL_AIRPORTS: Airport[] = COMPREHENSIVE_AIRPORTS;

const INITIAL_SAVED_FLIGHTS: SavedFlight[] = [
  { id: '1', flightNumber: '7300', airline: 'Sepehran Airlines', originCode: 'MHD', destCode: 'NJF', departureTime: '05:45', arrivalTime: '07:55', date: '2025-11-18' },
  { id: '2', flightNumber: '9213', airline: 'Ava Airlines', originCode: 'NJF', destCode: 'MHD', departureTime: '19:30', arrivalTime: '22:20', date: '2025-11-18' },
];

const INITIAL_SAVED_PASSENGERS: SavedPassenger[] = [
  { id: '1', firstName: 'Humam', lastName: 'Alyassiry', gender: 'Male', passportNumber: 'A21192788', nationalId: '0921192788', nationality: 'IRAQ', totalFlights: 12 },
  { id: '2', firstName: 'Fatemeh', lastName: 'Alavi', gender: 'Female', passportNumber: 'B98765432', nationalId: '0012345678', nationality: 'IRAN', totalFlights: 8 },
  { id: '3', firstName: 'John', lastName: 'Smith', gender: 'Male', passportNumber: 'C12345678', nationalId: '1234567890', nationality: 'UK', totalFlights: 3 },
  { id: '4', firstName: 'Ali', lastName: 'Rezaei', gender: 'Male', passportNumber: 'D11223344', nationalId: '0944556677', nationality: 'IRAN', totalFlights: 5 },
  { id: '5', firstName: 'Sarah', lastName: 'Connor', gender: 'Female', passportNumber: 'E55667788', nationalId: '0088997766', nationality: 'USA', totalFlights: 1 },
];

const POPULAR_NATIONALITIES = [
  { value: 'IRAQ', label: 'IRAQ', subLabel: 'عراق', badge: 'IQ' },
  { value: 'IRAN', label: 'IRAN', subLabel: 'ایران', badge: 'IR' },
  { value: 'AFGHANISTAN', label: 'AFGHANISTAN', subLabel: 'افغانستان', badge: 'AF' },
  { value: 'TURKEY', label: 'TURKEY', subLabel: 'ترکیه', badge: 'TR' },
  { value: 'UNITED ARAB EMIRATES', label: 'UAE (United Arab Emirates)', subLabel: 'امارات متحده عربی', badge: 'AE' },
  { value: 'SAUDI ARABIA', label: 'SAUDI ARABIA', subLabel: 'عربستان سعودی', badge: 'SA' },
  { value: 'QATAR', label: 'QATAR', subLabel: 'قطر', badge: 'QA' },
  { value: 'OMAN', label: 'OMAN', subLabel: 'عمان', badge: 'OM' },
  { value: 'KUWAIT', label: 'KUWAIT', subLabel: 'کویت', badge: 'KW' },
  { value: 'SYRIA', label: 'SYRIA', subLabel: 'سوریه', badge: 'SY' },
  { value: 'LEBANON', label: 'LEBANON', subLabel: 'لبنان', badge: 'LB' },
  { value: 'PAKISTAN', label: 'PAKISTAN', subLabel: 'پاکستان', badge: 'PK' },
  { value: 'INDIA', label: 'INDIA', subLabel: 'هندوستان', badge: 'IN' },
  { value: 'CHINA', label: 'CHINA', subLabel: 'چین', badge: 'CN' },
  { value: 'RUSSIA', label: 'RUSSIA', subLabel: 'روسیه', badge: 'RU' },
  { value: 'GERMANY', label: 'GERMANY', subLabel: 'آلمان', badge: 'DE' },
  { value: 'UNITED KINGDOM', label: 'UNITED KINGDOM', subLabel: 'انگلستان', badge: 'GB' },
  { value: 'FRANCE', label: 'FRANCE', subLabel: 'فرانسه', badge: 'FR' },
  { value: 'CANADA', label: 'CANADA', subLabel: 'کانادا', badge: 'CA' },
  { value: 'UNITED STATES', label: 'UNITED STATES', subLabel: 'ایالات متحده آمریکا', badge: 'US' },
  { value: 'AZERBAIJAN', label: 'AZERBAIJAN', subLabel: 'آذربایجان', badge: 'AZ' },
  { value: 'ARMENIA', label: 'ARMENIA', subLabel: 'ارمنستان', badge: 'AM' },
  { value: 'GEORGIA', label: 'GEORGIA', subLabel: 'گرجستان', badge: 'GE' },
  { value: 'TAJIKISTAN', label: 'TAJIKISTAN', subLabel: 'تاجیکستان', badge: 'TJ' },
  { value: 'UZBEKISTAN', label: 'UZBEKISTAN', subLabel: 'ازبکستان', badge: 'UZ' },
  { value: 'TURKMENISTAN', label: 'TURKMENISTAN', subLabel: 'ترکمنستان', badge: 'TM' },
  { value: 'MALAYSIA', label: 'MALAYSIA', subLabel: 'مالزی', badge: 'MY' },
  { value: 'THAILAND', label: 'THAILAND', subLabel: 'تایلند', badge: 'TH' },
  { value: 'INDONESIA', label: 'INDONESIA', subLabel: 'اندونزی', badge: 'ID' },
  { value: 'AUSTRALIA', label: 'AUSTRALIA', subLabel: 'استرالیا', badge: 'AU' },
  { value: 'ITALY', label: 'ITALY', subLabel: 'ایتالیا', badge: 'IT' },
  { value: 'SPAIN', label: 'SPAIN', subLabel: 'اسپانیا', badge: 'ES' },
  { value: 'NETHERLANDS', label: 'NETHERLANDS', subLabel: 'هلند', badge: 'NL' },
  { value: 'SWEDEN', label: 'SWEDEN', subLabel: 'سوئد', badge: 'SE' },
  { value: 'SWITZERLAND', label: 'SWITZERLAND', subLabel: 'سوئیس', badge: 'CH' }
];

const INITIAL_PASSENGER: Passenger = {
  ticketId: '',
  gender: 'Male',
  firstName: '',
  lastName: '',
  passportNumber: '',
  nationality: 'IRAN',
  pnr: 'P2FS5',
  localPnr: 'P2FS5',
  price: '25,000,000',
  idType: 'Passport',
  issueDate: '07/Nov/2025',
  issueTime: '18:11',
};

const INITIAL_AGENCY: AgencyData = {
  name: 'If You Want To Go Far, Go Together',
  phone: '09369848917',
  logoUrl: null,
  showLogo: true,
  address: 'Mashhad, Iran'
};

const INITIAL_FLIGHT_1: Flight = {
  flightNumber: '7399',
  date: '12/Nov/2025',
  isoDate: '2025-11-12',
  originTime: '20:31',
  destTime: '20:31',
  originCode: 'AWZ',
  originName: 'Ahvaz',
  destCode: 'NJF',
  destName: 'Najaf',
  airline: 'Sepehran Airlines (سپهران)',
  airlineLogo: 'https://cdn.charter118.ir/static/img/airlines/IS.png',
  aircraft: 'Boeing 737',
  baggage: '20 KG',
  handBaggage: '5 Kg',
  flightClass: 'Economy',
  type: 'Flight'
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
  airline: 'Ava Airlines (هواپیمایی آوا)',
  airlineLogo: 'https://cdn.charter118.ir/static/img/airlines/VAA.png',
  baggage: '20 kg',
  handBaggage: '5 Kg',
  flightClass: 'YYSFF',
  type: 'Return Flight'
};

const INITIAL_TEMPLATES: TicketTemplate[] = [
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
    // 3 SAMPLE VERTICAL BANNERS UNDER TICKET
    {
        id: '6',
        location: 'spot_bottom_1',
        title: 'خدمات تشریفات فرودگاهی CIP و VIP',
        description: 'پذیرایی در سالن اختصاصی، گیت اختصاصی گذرنامه، بدون معطلی در صف پرواز و ترانسفر لوکس پای پلکان.',
        ctaText: 'رزرو آنلاین CIP',
        linkUrl: '#',
        colorFrom: 'from-amber-600',
        colorTo: 'to-amber-900',
        iconName: 'Coffee',
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        isActive: true
    },
    {
        id: '7',
        location: 'spot_bottom_2',
        title: 'صدور فوری ویزا و بیمه مسافرتی',
        description: 'صدور آنی ویزای توریستی دبی، عمان، عراق و پوشش بیمه‌ای ۵۰ هزار یورویی سامان با تخفیف ویژه مسافران.',
        ctaText: 'دریافت بیمه‌نامه',
        linkUrl: '#',
        colorFrom: 'from-blue-600',
        colorTo: 'to-indigo-900',
        iconName: 'ShieldPlus',
        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
        isActive: true
    },
    {
        id: '8',
        location: 'spot_bottom_3',
        title: 'رزرو هتل‌های ۵ ستاره تا ۵۰٪ تخفیف',
        description: 'بهترین نرخ اقامت در هتل‌های لوکس نجف، کربلا، استانبول و دبی با صبحانه رایگان و تسویه ریالی شتاب.',
        ctaText: 'مشاهده هتل‌ها',
        linkUrl: '#',
        colorFrom: 'from-emerald-600',
        colorTo: 'to-teal-900',
        iconName: 'Hotel',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
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
    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      className="w-full p-2.5 rounded-lg border-2 border-slate-400 hover:border-slate-500 bg-white text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
    />
  </div>
);

interface ComboboxOption {
  value: string;
  label: string;
  subLabel?: string;
  badge?: string;
  logoUrl?: string;
  extra?: any;
}

interface SearchableComboboxProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string, extra?: any) => void;
  options: ComboboxOption[];
  placeholder?: string;
  className?: string;
  uppercase?: boolean;
  isRTL?: boolean;
}

const SearchableCombobox = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  className = "",
  uppercase = false,
  isRTL = false
}: SearchableComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!value || !value.trim()) {
      return options.slice(0, 40);
    }
    const term = value.trim().toLowerCase();
    const matches = options.filter(opt =>
      opt.value.toLowerCase().includes(term) ||
      opt.label.toLowerCase().includes(term) ||
      (opt.subLabel && opt.subLabel.toLowerCase().includes(term)) ||
      (opt.badge && opt.badge.toLowerCase().includes(term))
    );
    return matches.slice(0, 40);
  }, [options, value]);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    const clean = value.trim().toLowerCase();
    return options.find(opt => 
      opt.value.toLowerCase() === clean || 
      opt.label.toLowerCase() === clean || 
      (opt.badge && opt.badge.toLowerCase() === clean)
    );
  }, [options, value]);

  const hasSelectedLogo = Boolean(selectedOption && (selectedOption.logoUrl || selectedOption.badge));

  return (
    <div className={`relative ${className} ${isOpen ? 'z-30' : 'z-10'}`} ref={wrapperRef}>
      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">{label}</label>
      <div className="relative w-full">
        {hasSelectedLogo && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 shadow-2xs pointer-events-none z-10">
            <img 
              src={getReliableAirlineLogo(selectedOption?.badge || selectedOption?.label || selectedOption?.value, selectedOption?.logoUrl)} 
              alt="" 
              className="w-full h-full object-contain" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                const el = e.currentTarget;
                el.src = generateDynamicAirlineEmblem(selectedOption?.badge || selectedOption?.label || selectedOption?.value);
              }}
            />
          </div>
        )}
        <input
          type="text"
          name={name}
          value={value}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            const val = uppercase ? e.target.value.toUpperCase() : e.target.value;
            onChange(val);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            paddingRight: '38px',
            paddingLeft: hasSelectedLogo ? '38px' : '14px'
          }}
          className={`w-full p-2.5 rounded-lg border-2 border-slate-400 hover:border-slate-500 bg-white text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm ${uppercase ? 'uppercase' : ''}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(prev => !prev);
          }}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: '10px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
          className="text-slate-500 hover:text-blue-600 transition-colors focus:outline-none"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div 
          className="absolute z-50 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border-2 border-blue-400 rounded-xl shadow-2xl divide-y divide-slate-100"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const isSelected = opt.value.trim().toUpperCase() === (value || '').trim().toUpperCase();
              const logo = (opt.logoUrl || opt.badge) 
                ? getReliableAirlineLogo(opt.badge || opt.label || opt.value, opt.logoUrl) 
                : null;

              return (
                <div
                  key={`${opt.value}-${idx}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(opt.value, opt.extra);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-blue-50/90 text-blue-700 font-semibold' : 'text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {logo ? (
                      <div className="w-6 h-6 rounded-md bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                        <img 
                          src={logo} 
                          alt="" 
                          className="w-full h-full object-contain" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.src = generateDynamicAirlineEmblem(opt.badge || opt.label || opt.value);
                          }}
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-col text-right min-w-0">
                      <span className="text-sm font-medium truncate">{opt.label}</span>
                      {opt.subLabel && <span className="text-[11px] text-gray-500 truncate">{opt.subLabel}</span>}
                    </div>
                  </div>
                  {opt.badge && (
                    <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-2 shrink-0">
                      {opt.badge}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-3 text-center text-xs text-gray-500">
              {value ? `موردی با این عنوان در لیست نیست؛ همان «${value}» ثبت می‌شود.` : 'داده‌ای یافت نشد'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// FlightForm Component
const FlightForm = ({ 
  title, 
  data, 
  onChange, 
  onFieldChange,
  onDateChange, 
  isSepehr, 
  t, 
  isRTL, 
  airports,
  airlines
}: any) => {
  const airportOptions = useMemo(() => {
    return (airports || []).map((a: any) => ({
      value: a.code,
      label: `${a.code} - ${a.city}`,
      subLabel: `${a.name} (${a.country})`,
      badge: a.code,
      extra: a
    }));
  }, [airports]);

  const airlineOptions = useMemo(() => {
    return (airlines || []).map((al: any) => ({
      value: al.name,
      label: al.name,
      subLabel: al.code ? `IATA: ${al.code}` : undefined,
      badge: al.code,
      logoUrl: al.logoUrl,
      extra: al
    }));
  }, [airlines]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
          <Plane className={`w-5 h-5 ${title === t('returnFlight') ? 'rotate-180 text-indigo-500' : 'text-blue-500'}`} /> 
          <span>{title}</span>
        </h2>
        {data.airline && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shadow-2xs">
            <SafeAirlineLogo logoUrl={data.airlineLogo} airline={data.airline} size="w-6 h-6" border={false} />
            <span className="text-xs font-bold text-slate-700 max-w-[160px] truncate">{data.airline}</span>
          </div>
        )}
      </div>

      <div className="space-y-3.5">
         {/* Flight Number & Airline */}
         <div className="grid grid-cols-2 gap-3">
            <Input label={t('flightNumber')} name="flightNumber" value={data.flightNumber} onChange={onChange} placeholder="7399" />
            <SearchableCombobox 
              label={t('airline')} 
              name="airline" 
              value={data.airline} 
              onChange={(val, extra) => onFieldChange('airline', val, extra)} 
              options={airlineOptions}
              placeholder="Caspian Airlines..."
              isRTL={isRTL}
            />
         </div>

         {/* Origin & Destination Codes */}
         <div className="grid grid-cols-2 gap-3">
            <SearchableCombobox 
              label={t('originCode')} 
              name="originCode" 
              value={data.originCode} 
              uppercase
              onChange={(val, extra) => onFieldChange('originCode', val, extra)} 
              options={airportOptions}
              placeholder="MHD"
              isRTL={isRTL}
            />
            <SearchableCombobox 
              label={t('destCode')} 
              name="destCode" 
              value={data.destCode} 
              uppercase
              onChange={(val, extra) => onFieldChange('destCode', val, extra)} 
              options={airportOptions}
              placeholder="NJF"
              isRTL={isRTL}
            />
         </div>

         {/* Origin & Destination City Names */}
         <div className="grid grid-cols-2 gap-3">
            <Input label={t('originName')} name="originName" value={data.originName} onChange={onChange} placeholder="Mashhad" />
            <Input label={t('destName')} name="destName" value={data.destName} onChange={onChange} placeholder="Najaf" />
         </div>

         {/* Departure & Arrival Times */}
         <div className="grid grid-cols-2 gap-3">
            <Input label={t('departure')} name="originTime" value={data.originTime} onChange={onChange} placeholder="05:45" />
            <Input label={t('arrival')} name="destTime" value={data.destTime} onChange={onChange} placeholder="07:55" />
         </div>

         {/* Flight Date (Calendar picker + Display text) */}
         <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  {isRTL ? 'انتخاب تاریخ (تقویم)' : 'Flight Date (Calendar)'}
                </label>
                <input 
                  type="date" 
                  value={data.isoDate || ''} 
                  onChange={onDateChange} 
                  className="w-full p-2.5 rounded-lg border-2 border-slate-400 hover:border-slate-500 bg-white text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm" 
                />
            </div>
            <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">{t('date')}</label>
                <input 
                  type="text" 
                  name="date" 
                  value={data.date} 
                  onChange={onChange} 
                  className="w-full p-2.5 rounded-lg border-2 border-slate-400 hover:border-slate-500 bg-white text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm" 
                  placeholder="18/Nov/2025" 
                />
            </div>
         </div>

         {/* Baggage & Sepehr Specific Details */}
         {isSepehr ? (
           <div className="space-y-3 pt-1 border-t border-gray-100">
             <div className="grid grid-cols-2 gap-3">
               <Input label={t('baggage')} name="baggage" value={data.baggage} onChange={onChange} placeholder="20 kg" />
               <Input label={t('handBag')} name="handBaggage" value={data.handBaggage || ''} onChange={onChange} placeholder="5 kg" />
             </div>
             <div className="grid grid-cols-2 gap-3">
               <Input label={t('classCode')} name="flightClass" value={data.flightClass || ''} onChange={onChange} placeholder="Economy" />
               <Input label={isRTL ? 'مدل هواپیما (Aircraft)' : 'Aircraft'} name="aircraft" value={data.aircraft || ''} onChange={onChange} placeholder="Boeing 737" />
             </div>
           </div>
         ) : (
           <div className="grid grid-cols-1 gap-3 pt-1 border-t border-gray-100">
             <Input label={t('baggage')} name="baggage" value={data.baggage} onChange={onChange} placeholder="20 kg" />
           </div>
         )}
      </div>
    </div>
  );
};

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
        <div className={`relative h-full min-h-[440px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 bg-white flex flex-col`}>
           {/* Image Area */}
           <div className="h-60 overflow-hidden relative">
              {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${ad.colorFrom} ${ad.colorTo}`}></div>
              )}
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              
              {/* Top Promo Badge */}
              <div className={`absolute top-3.5 ${isRTL ? 'right-3.5' : 'left-3.5'} bg-amber-500/90 backdrop-blur-md text-slate-900 px-3 py-1 rounded-full text-[11px] font-black tracking-wide shadow-sm flex items-center gap-1`}>
                 <span>★ ۴.۹</span>
                 <span className="opacity-70">|</span>
                 <span>پیشنهاد ویژه</span>
              </div>

              {/* Icon Overlay */}
              <div className={`absolute bottom-3.5 ${isRTL ? 'right-3.5' : 'left-3.5'} text-white bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/30 shadow-md`}>
                 {(() => {
                    const Icon = ICON_MAP[ad.iconName] || Sparkles;
                    return <Icon size={22} />;
                 })()}
              </div>
           </div>

           {/* Content Area */}
           <div className="p-5 flex-1 flex flex-col justify-between bg-white text-right" dir={isRTL ? 'rtl' : 'ltr'}>
              <div>
                  <h4 className="font-extrabold text-base text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">{ad.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{ad.description}</p>
              </div>
              
              <div className="pt-4 mt-auto">
                 <button className={`w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs group-hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-xs`}>
                    <span>{ad.ctaText}</span>
                    {isRTL ? <ChevronRight size={14} className="rotate-180" /> : <ChevronRight size={14} />}
                 </button>
              </div>
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
  const [selectedTemplate, setSelectedTemplate] = useState('8');
  
  // Shared Database State
  const [savedFlights, setSavedFlights] = useState<SavedFlight[]>(INITIAL_SAVED_FLIGHTS);
  const [savedAirports, setSavedAirports] = useState<Airport[]>(INITIAL_AIRPORTS);
  const [savedAirlines, setSavedAirlines] = useState<Airline[]>(() => {
    try {
      const saved = localStorage.getItem('localSavedAirlines');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_AIRLINES;
  });
  const [savedPassengers, setSavedPassengers] = useState<SavedPassenger[]>(() => {
    try {
      const saved = localStorage.getItem('localSavedPassengers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_SAVED_PASSENGERS;
  });
  const [users, setUsers] = useState<User[]>([]);
  const [ticketHistory, setTicketHistory] = useState<TicketHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('localTicketHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);
  const [templates, setTemplates] = useState<TicketTemplate[]>(INITIAL_TEMPLATES);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(INITIAL_FOOTER_CONFIG);
  const [staticPages, setStaticPages] = useState<StaticPage[]>(INITIAL_PAGES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [revenueConfig, setRevenueConfig] = useState<RevenueConfig>(INITIAL_REVENUE_CONFIG);
  const [ticketPricingConfig, setTicketPricingConfig] = useState<TicketPricingConfig>({
    defaultCurrency: 'IRR',
    domesticPriceIrr: 500000,
    domesticPriceUsd: 10,
    internationalPriceIrr: 1500000,
    internationalPriceUsd: 25,
    exchangeRateUsdToIrr: 900000,
    customAirlinePrices: [
      { id: 'ap_1', airlineCode: 'W5', airlineName: 'Mahan Air (هواپیمایی ماهان)', priceIrr: 600000, priceUsd: 12, isActive: true },
      { id: 'ap_2', airlineCode: 'IR', airlineName: 'Iran Air (هما ایران ایر)', priceIrr: 550000, priceUsd: 11, isActive: true },
      { id: 'ap_3', airlineCode: 'TK', airlineName: 'Turkish Airlines (ترکیش ایرلاینز)', priceIrr: 2000000, priceUsd: 35, isActive: true },
      { id: 'ap_4', airlineCode: 'EK', airlineName: 'Emirates (هواپیمایی امارات)', priceIrr: 2500000, priceUsd: 40, isActive: true },
      { id: 'ap_5', airlineCode: 'FZ', airlineName: 'Flydubai (فلای دبی)', priceIrr: 1800000, priceUsd: 30, isActive: true },
      { id: 'ap_6', airlineCode: 'QR', airlineName: 'Qatar Airways (قطر ایرویز)', priceIrr: 2500000, priceUsd: 40, isActive: true }
    ]
  });

  // Auto-fill and suggestion states for passenger passport/national code
  const [autoFillNotice, setAutoFillNotice] = useState<string | null>(null);
  const [idSearchSuggestions, setIdSearchSuggestions] = useState<SavedPassenger[]>([]);

  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  // Download Loader State
  const [showDownloadLoader, setShowDownloadLoader] = useState(false);
  const [downloadTimer, setDownloadTimer] = useState(0);

  const nationalityOptions = useMemo(() => {
    return POPULAR_NATIONALITIES.map(n => ({
      value: n.value,
      label: `${n.value} (${n.subLabel})`,
      subLabel: n.subLabel,
      badge: n.badge
    }));
  }, []);
  
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const pdfExportRef = useRef<HTMLDivElement>(null);
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
              logoUrl: getReliableAirlineLogo(airline.code || airline.name, airline.logoUrl)
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
              airline: flight.airline?.name || (typeof flight.airline === 'string' ? flight.airline : '') || 'Airline',
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
          const normalized = loadedAds.map(normalizeAd);
          const loadedLocations = new Set(normalized.map(a => a.location));
          const missingDefaults = INITIAL_ADS.filter(a => !loadedLocations.has(a.location));
          setAds([...normalized, ...missingDefaults]);
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
        const [footer, pages, blog, pricing] = await Promise.all([
          SettingsService.getFooter(),
          SettingsService.getStaticPages(),
          BlogService.getBlogPosts(),
          SettingsService.getTicketPricing().catch(() => null)
        ]);

        setFooterConfig(normalizeFooterConfig(footer));
        if (pages.length > 0) {
          setStaticPages(pages.map(normalizeStaticPage));
        }
        if (blog.data.length > 0) {
          setBlogPosts(blog.data.map(normalizeBlogPost));
        }
        if (pricing) {
          setTicketPricingConfig(pricing);
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
        // Keep local ticket history intact so guest/offline tickets remain visible
        return;
      }

      try {
        const tasks: Promise<any>[] = [
          PassengerService.getPassengers().then((items) => {
            if (items.length > 0) {
              const backendPassengers = items.map((item) => ({
                id: item.id,
                firstName: item.firstName,
                lastName: item.lastName,
                gender: item.gender,
                passportNumber: item.passportNumber,
                nationality: item.nationality,
                totalFlights: item.totalFlights
              }));
              setSavedPassengers((prev) => {
                const map = new Map<string, SavedPassenger>();
                prev.forEach(p => map.set(p.passportNumber?.toUpperCase() || p.id, p));
                backendPassengers.forEach(p => map.set(p.passportNumber?.toUpperCase() || p.id, p));
                const merged = Array.from(map.values());
                try {
                  localStorage.setItem('localSavedPassengers', JSON.stringify(merged));
                } catch (e) {}
                return merged;
              });
            }
          }),
          TicketService.getTickets().then((items) => {
            const normalized = items.map(normalizeTicket);
            setTicketHistory((prev) => {
              const map = new Map<string, TicketHistoryItem>();
              prev.forEach(t => map.set(t.ticketId, t));
              normalized.forEach(t => map.set(t.ticketId, t));
              const merged = Array.from(map.values());
              try {
                localStorage.setItem('localTicketHistory', JSON.stringify(merged.slice(0, 100)));
              } catch (e) {}
              return merged;
            });
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

  const toEnglishDigits = (str: string) => {
    return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
              .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  };

  const handlePassengerChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'passportNumber') {
      const cleanValue = toEnglishDigits(value).trim();
      const upperVal = cleanValue.toUpperCase();

      setPassenger(prev => ({ ...prev, passportNumber: cleanValue }));

      if (upperVal.length >= 2) {
        // Look for exact match first
        const exactMatch = savedPassengers.find(p => 
          (p.passportNumber && p.passportNumber.trim().toUpperCase() === upperVal) ||
          (p.nationalId && p.nationalId.trim() === cleanValue)
        );

        if (exactMatch) {
          setPassenger(prev => ({
            ...prev,
            passportNumber: cleanValue,
            firstName: exactMatch.firstName || prev.firstName,
            lastName: exactMatch.lastName || prev.lastName,
            gender: exactMatch.gender || prev.gender,
            nationality: exactMatch.nationality || prev.nationality
          }));
          setAutoFillNotice(`✓ اطلاعات مسافر "${exactMatch.firstName} ${exactMatch.lastName}" (${exactMatch.nationality}) بازیابی شد.`);
          setIdSearchSuggestions([]);
          setTimeout(() => setAutoFillNotice(null), 4500);
          return;
        }

        // Suggestions for partial match
        const partials = savedPassengers.filter(p => 
          (p.passportNumber && p.passportNumber.toUpperCase().includes(upperVal)) ||
          (p.nationalId && p.nationalId.includes(cleanValue)) ||
          (`${p.firstName} ${p.lastName}`.toUpperCase().includes(upperVal))
        );
        setIdSearchSuggestions(partials.slice(0, 5));
      } else {
        setIdSearchSuggestions([]);
        setAutoFillNotice(null);
      }
    } else {
      setPassenger(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSetIssueToNow = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    setPassenger(prev => ({
      ...prev,
      issueDate: formattedDate,
      issueTime: formattedTime
    }));
  };

  const applyPassengerSuggestion = (selected: SavedPassenger) => {
    setPassenger(prev => ({
      ...prev,
      firstName: selected.firstName || prev.firstName,
      lastName: selected.lastName || prev.lastName,
      passportNumber: selected.passportNumber || selected.nationalId || prev.passportNumber,
      nationality: selected.nationality || prev.nationality,
      gender: selected.gender || prev.gender,
      issueDate: selected.issueDate || prev.issueDate,
      issueTime: selected.issueTime || prev.issueTime
    }));
    setIdSearchSuggestions([]);
    setAutoFillNotice(`✓ اطلاعات مسافر "${selected.firstName} ${selected.lastName}" جایگذاری شد.`);
    setTimeout(() => setAutoFillNotice(null), 4500);
  };

  const saveOrUpdatePassengerFromCurrent = (pass: Passenger) => {
    const rawId = toEnglishDigits(pass.passportNumber || '').trim();
    if (!rawId) return;
    const cleanFirst = (pass.firstName || '').trim();
    const cleanLast = (pass.lastName || '').trim();
    if (!cleanFirst && !cleanLast) return;

    setSavedPassengers((prev) => {
      const idx = prev.findIndex(p => 
        (p.passportNumber && p.passportNumber.trim().toUpperCase() === rawId.toUpperCase()) ||
        (p.nationalId && p.nationalId.trim() === rawId)
      );

      let updatedList: SavedPassenger[];
      if (idx >= 0) {
        const existing = prev[idx];
        const updated: SavedPassenger = {
          ...existing,
          firstName: cleanFirst || existing.firstName,
          lastName: cleanLast || existing.lastName,
          gender: pass.gender || existing.gender,
          nationality: pass.nationality || existing.nationality,
          passportNumber: pass.idType === 'Passport' ? rawId.toUpperCase() : (existing.passportNumber || rawId.toUpperCase()),
          nationalId: pass.idType === 'NationalID' ? rawId : (existing.nationalId || rawId),
          totalFlights: (existing.totalFlights || 0) + 1,
          issueDate: pass.issueDate || existing.issueDate,
          issueTime: pass.issueTime || existing.issueTime
        };
        updatedList = [...prev];
        updatedList[idx] = updated;
      } else {
        const newPassenger: SavedPassenger = {
          id: `sp_${Date.now()}`,
          firstName: cleanFirst,
          lastName: cleanLast,
          gender: pass.gender || 'Male',
          passportNumber: pass.idType === 'Passport' ? rawId.toUpperCase() : rawId.toUpperCase(),
          nationalId: pass.idType === 'NationalID' ? rawId : rawId,
          nationality: pass.nationality || 'IRAN',
          totalFlights: 1,
          issueDate: pass.issueDate,
          issueTime: pass.issueTime
        };
        updatedList = [newPassenger, ...prev];
      }

      try {
        localStorage.setItem('localSavedPassengers', JSON.stringify(updatedList));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      return updatedList;
    });

    if (currentUser) {
      PassengerService.createPassenger({
        firstName: cleanFirst,
        lastName: cleanLast,
        gender: pass.gender || 'Male',
        passportNumber: rawId.toUpperCase(),
        nationality: pass.nationality || 'IRAN'
      }).catch((e) => console.warn('Could not sync passenger to server:', e));
    }
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
              gender: selected.gender,
              issueDate: selected.issueDate || prev.issueDate,
              issueTime: selected.issueTime || prev.issueTime
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

          const matchedAirline = savedAirlines.find(al => al.name.toLowerCase() === match.airline.toLowerCase() || (al.code && al.code.toUpperCase() === match.airline.toUpperCase()));
          const autoFillData: Partial<Flight> = {
            airline: match.airline,
            airlineLogo: getReliableAirlineLogo(matchedAirline?.code || match.airline, matchedAirline?.logoUrl),
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

  const handleFlightFieldChange = (flightNum: 1 | 2, fieldName: string, value: string, extra?: any) => {
    const updateFn = flightNum === 1 ? setFlight1 : setFlight2;
    updateFn(prev => {
      const newData = { ...prev, [fieldName]: value };

      if (fieldName === 'airline') {
        const found = extra || savedAirlines.find(al => al.name.toLowerCase() === value.toLowerCase() || (al.code && al.code.toUpperCase() === value.toUpperCase()));
        newData.airlineLogo = getReliableAirlineLogo(found?.code || found?.name || value, found?.logoUrl);
      }

      if (fieldName === 'originCode') {
        if (extra && extra.city) {
          newData.originName = extra.city;
        } else {
          const airport = savedAirports.find(a => a.code.toUpperCase() === value.toUpperCase());
          if (airport) {
            newData.originName = airport.city;
          }
        }
      }

      if (fieldName === 'destCode') {
        if (extra && extra.city) {
          newData.destName = extra.city;
        } else {
          const airport = savedAirports.find(a => a.code.toUpperCase() === value.toUpperCase());
          if (airport) {
            newData.destName = airport.city;
          }
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
      throw new Error('رمز عبور برای کاربر جدید الزامی است (Password is required for new users).');
    }

    const cleanName = (user.name || '').trim();
    const cleanEmail = (user.email || '').trim().toLowerCase();
    const cleanMobile = (user.mobile || '')
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
      .replace(/[\s\-\(\)]/g, '')
      .trim();

    const roleUpper = (user.role || '').toUpperCase();
    const normalizedRole = roleUpper === 'ADMIN' ? 'ADMIN' : roleUpper === 'AGENT' ? 'AGENT' : 'USER';

    const statusUpper = (user.status || '').toUpperCase();
    const normalizedStatus = statusUpper === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const creditIrr = Number(user.creditIrr ?? user.credit) || 0;
    const creditUsd = Number(user.creditUsd) || 0;
    const giftCreditIrr = Number(user.giftCreditIrr ?? user.giftCredit) || 0;
    const giftCreditUsd = Number(user.giftCreditUsd) || 0;

    const payload = {
      name: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      role: normalizedRole,
      status: normalizedStatus,
      credit: creditIrr,
      creditIrr,
      creditUsd,
      giftCredit: giftCreditIrr,
      giftCreditIrr,
      giftCreditUsd,
      isUnlimited: Boolean(user.isUnlimited),
      bonusFreeTickets: parseInt(String(user.bonusFreeTickets || 0), 10) || 0,
      ...(trimmedPassword ? { password: trimmedPassword } : {})
    };

    try {
      const savedUser = user.id
        ? await UserService.updateUser(user.id, payload)
        : await UserService.createUser({ ...payload, password: trimmedPassword! });

      setUsers((prev) => {
        const normalized = normalizeUser(savedUser);
        const exists = prev.some((item) => item.id === normalized.id);
        return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
      });
    } catch (apiError: any) {
      // If unauthorized or local session, store in local state so admin is never blocked
      if (apiError.message?.includes('Not authorized') || !localStorage.getItem('token')) {
        const localUser: User = {
          id: user.id || `usr_${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          mobile: cleanMobile,
          role: normalizedRole === 'ADMIN' ? 'Admin' : normalizedRole === 'AGENT' ? 'Agent' : 'User',
          status: normalizedStatus === 'ACTIVE' ? 'Active' : 'Inactive',
          credit: creditIrr,
          creditIrr,
          creditUsd,
          giftCredit: giftCreditIrr,
          giftCreditIrr,
          giftCreditUsd,
          isUnlimited: payload.isUnlimited,
          bonusFreeTickets: payload.bonusFreeTickets,
          permissions: normalizedRole === 'ADMIN'
            ? ['ISSUE_TICKET', 'MANAGE_USERS', 'MANAGE_BASE_DATA', 'VIEW_FINANCIALS', 'MANAGE_REVENUE', 'MANAGE_ADS', 'MANAGE_SETTINGS', 'MANAGE_BLOG']
            : normalizedRole === 'AGENT'
            ? ['ISSUE_TICKET', 'VIEW_FINANCIALS']
            : ['ISSUE_TICKET']
        };
        setUsers((prev) => {
          const exists = prev.some((item) => item.id === localUser.id);
          return exists ? prev.map((item) => item.id === localUser.id ? localUser : item) : [localUser, ...prev];
        });
        return;
      }
      throw apiError;
    }
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

  const handleSaveTicketPricing = async (config: TicketPricingConfig) => {
    try {
      const updated = await SettingsService.updateTicketPricing(config);
      setTicketPricingConfig(updated);
    } catch (err) {
      console.warn('Could not save pricing to backend, saving locally:', err);
      setTicketPricingConfig(config);
    }
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

    let savedId = passengerData.id;
    try {
      const savedPassenger = passengerData.id
        ? await PassengerService.updatePassenger(passengerData.id, payload)
        : await PassengerService.createPassenger(payload);
      if (savedPassenger?.id) savedId = savedPassenger.id;
    } catch (err) {
      console.warn('Save passenger warning:', err);
    }

    const normalized = {
      id: savedId || `sp_${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      gender: payload.gender,
      passportNumber: payload.passportNumber,
      nationality: payload.nationality,
      totalFlights: payload.totalFlights,
      issueDate: passengerData.issueDate,
      issueTime: passengerData.issueTime
    };

    setSavedPassengers((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      const updated = exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
      try {
        localStorage.setItem('localSavedPassengers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleDeletePassenger = async (id: string) => {
    try {
      await PassengerService.deletePassenger(id);
    } catch (err) {
      console.warn('Delete passenger warning:', err);
    }
    setSavedPassengers((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('localSavedPassengers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleSaveAirline = async (airline: Airline) => {
    const cleanName = (airline.name || '').trim();
    const cleanCode = (airline.code || '').trim().toUpperCase();
    const cleanLogo = airline.logoUrl || '';

    let savedId = airline.id;
    try {
      const saved = airline.id
        ? await BaseDataService.updateAirline(airline.id, { name: cleanName, code: cleanCode, logoUrl: cleanLogo })
        : await BaseDataService.createAirline({ name: cleanName, code: cleanCode, logoUrl: cleanLogo });

      if (saved?.id) {
        savedId = saved.id;
      }
    } catch (err: any) {
      console.warn('Backend save airline warning:', err);
    }

    const normalized: Airline = { 
      id: savedId || `air_${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '') || Date.now().toString()}`, 
      name: cleanName, 
      code: cleanCode, 
      logoUrl: getReliableAirlineLogo(cleanCode || cleanName, normalizeAssetUrl(cleanLogo)) 
    };

    setSavedAirlines((prev) => {
      const exists = prev.some((item) => item.id === normalized.id || item.code === normalized.code);
      const updated = exists 
        ? prev.map((item) => (item.id === normalized.id || item.code === normalized.code) ? normalized : item) 
        : [normalized, ...prev];
      try {
        localStorage.setItem('localSavedAirlines', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleDeleteAirline = async (id: string) => {
    try {
      await BaseDataService.deleteAirline(id);
    } catch (err) {
      console.warn('Delete airline warning:', err);
    }
    setSavedAirlines((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('localSavedAirlines', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleSaveAirport = async (airport: Airport) => {
    const payload = { name: airport.name, code: airport.code.toUpperCase(), city: airport.city, country: airport.country };
    let savedId = airport.id;
    try {
      const saved = airport.id
        ? await BaseDataService.updateAirport(airport.id, payload)
        : await BaseDataService.createAirport(payload);
      if (saved?.id) savedId = saved.id;
    } catch (err) {
      console.warn('Save airport warning:', err);
    }

    const normalized: Airport = { 
      id: savedId || `apt_${payload.code.toLowerCase()}`, 
      name: payload.name, 
      code: payload.code, 
      city: payload.city, 
      country: payload.country,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSavedAirports((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
    });
  };

  const handleDeleteAirport = async (id: string) => {
    try {
      await BaseDataService.deleteAirport(id);
    } catch (err) {
      console.warn('Delete airport warning:', err);
    }
    setSavedAirports((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveFlight = async (flight: SavedFlight) => {
    const airlineId = flight.airlineId || savedAirlines.find((item) => item.name === flight.airline)?.id || 'air_custom';
    const payload = {
      flightNumber: flight.flightNumber,
      airlineId,
      originCode: flight.originCode,
      destCode: flight.destCode,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      date: flight.date
    };

    let savedId = flight.id;
    try {
      const saved = flight.id
        ? await BaseDataService.updateFlight(flight.id, payload)
        : await BaseDataService.createFlight(payload);
      if (saved?.id) savedId = saved.id;
    } catch (err) {
      console.warn('Save flight warning:', err);
    }

    const normalized: SavedFlight = {
      id: savedId || `flt_${Date.now()}`,
      airlineId: payload.airlineId,
      flightNumber: payload.flightNumber,
      airline: flight.airline || 'Airline',
      originCode: payload.originCode,
      destCode: payload.destCode,
      departureTime: payload.departureTime,
      arrivalTime: payload.arrivalTime,
      date: payload.date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSavedFlights((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      return exists ? prev.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev];
    });
  };

  const handleDeleteFlight = async (id: string) => {
    try {
      await BaseDataService.deleteFlight(id);
    } catch (err) {
      console.warn('Delete flight warning:', err);
    }
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
      setDownloadTimer(10); // 10 seconds countdown
      setShowDownloadLoader(true);
  };

  const handleDownloadRequest = () => {
    startDownloadProcess();
  };

  const handlePaymentSuccess = async () => {
      if (currentUser) {
          const newCredit = (currentUser.credit || 0) + TICKET_COST;
          const updatedUser = { 
              ...currentUser, 
              credit: newCredit 
          };
          setCurrentUser(updatedUser);
          setShowPaymentModal(false);

          try {
            await UserService.updateUser(currentUser.id, { credit: newCredit });
            const me = await AuthService.getCurrentUser();
            if (me) {
              setCurrentUser(normalizeUser(me));
              localStorage.setItem('user', JSON.stringify(me));
            }
          } catch (err) {
            console.warn('Failed to update credit on server:', err);
          }
          
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

      const styleSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
          .map((el) => el.outerHTML)
          .join('\n');

      printWindow.document.write(`
        <!doctype html>
        <html dir="ltr">
          <head>
            <meta charset="utf-8" />
            <title>${fileName}</title>
            ${styleSheets}
            <style>
              body { margin: 0; background: #ffffff; display: flex; justify-content: center; padding: 24px; }
              @media print {
                body { padding: 0; background: #ffffff; }
                @page { size: A4 portrait; margin: 0; }
              }
            </style>
          </head>
          <body>
            ${element.outerHTML}
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.focus();
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
  };

  const generatePdfFromRef = async (element: HTMLElement, fileName: string) => {
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

      const normalizeModernCssColors = (value: string): string => {
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

      const colorHelperCanvas = document.createElement('canvas');
      colorHelperCanvas.width = 1;
      colorHelperCanvas.height = 1;
      const colorCtx = colorHelperCanvas.getContext('2d');

      const toRgbColor = (rawColor: string): string => {
          if (!rawColor || !rawColor.trim()) return rawColor;
          if (!hasUnsupportedColorFunction(rawColor)) return rawColor;
          if (colorCtx) {
              try {
                  colorCtx.fillStyle = '#000000';
                  colorCtx.fillStyle = rawColor;
                  if (colorCtx.fillStyle && colorCtx.fillStyle !== '#000000' && !hasUnsupportedColorFunction(colorCtx.fillStyle)) {
                      return colorCtx.fillStyle;
                  }
              } catch {
                  // Fallback
              }
          }
          return normalizeModernCssColors(rawColor);
      };

      const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error || new Error('Failed to read image data'));
          reader.readAsDataURL(blob);
      });

      const safeInlineTicketImages = async (rootNode: HTMLElement) => {
          const images = Array.from(rootNode.querySelectorAll<HTMLImageElement>('img'));
          const pdfAssetProxyUrl = (assetUrl: string) => {
              const apiBaseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
              const proxyUrl = new URL(`${apiBaseUrl}/assets/proxy`, window.location.origin);
              proxyUrl.searchParams.set('url', assetUrl);
              return proxyUrl.toString();
          };

          const fetchImageBlob = async (url: string) => {
              const controller = new AbortController();
              const timer = setTimeout(() => controller.abort(), 5000);
              try {
                  const response = await fetch(url, { 
                      mode: 'cors', 
                      credentials: 'same-origin',
                      signal: controller.signal 
                  });
                  clearTimeout(timer);
                  if (!response.ok) {
                      throw new Error(`Image request failed with status ${response.status}`);
                  }
                  const contentType = response.headers.get('content-type') || '';
                  if (!contentType.startsWith('image/')) {
                      throw new Error('Image request did not return an image');
                  }
                  return await response.blob();
              } catch (err) {
                  clearTimeout(timer);
                  throw err;
              }
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
              }
          }));
      };

      const waitForTicketImages = async (rootNode: HTMLElement) => {
          const images = Array.from(rootNode.querySelectorAll<HTMLImageElement>('img'));
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
                  // Non-blocking for PDF generation
              }
          }));
      };

      try {
          // Pre-inline and preload images and fonts in the main document
          await safeInlineTicketImages(element);
          await waitForTicketImages(element);
          await document.fonts?.ready;

          const exportWidth = 794;
          const exportHeight = element.scrollHeight || 1123;

          const canvas = await html2canvas(element, {
              backgroundColor: '#ffffff',
              scale: 2, // 2x for sharp 300 DPI print quality
              useCORS: true,
              allowTaint: false,
              logging: false,
              width: exportWidth,
              height: exportHeight,
              windowWidth: exportWidth,
              windowHeight: exportHeight,
              scrollX: 0,
              scrollY: 0,
              onclone: (clonedDoc, clonedTarget) => {
                  // Ensure cloned element is visible and positioned at origin in snapshot document
                  clonedTarget.style.position = 'static';
                  clonedTarget.style.left = '0';
                  clonedTarget.style.top = '0';
                  clonedTarget.style.margin = '0 auto';
                  clonedTarget.style.transform = 'none';
                  clonedTarget.style.visibility = 'visible';
                  clonedTarget.style.display = 'block';

                  if (clonedTarget.parentElement) {
                      clonedTarget.parentElement.style.position = 'static';
                      clonedTarget.parentElement.style.left = '0';
                      clonedTarget.parentElement.style.top = '0';
                      clonedTarget.parentElement.style.visibility = 'visible';
                      clonedTarget.parentElement.style.display = 'block';
                      clonedTarget.parentElement.style.transform = 'none';
                  }

                  // 1. Sanitize all <style> blocks in cloned document so html2canvas's CSS parser
                  //    never chokes on Tailwind v4's modern oklch/oklab color declarations
                  clonedDoc.querySelectorAll('style').forEach((styleEl) => {
                      if (styleEl.textContent && hasUnsupportedColorFunction(styleEl.textContent)) {
                          styleEl.textContent = styleEl.textContent.replace(/(?:oklch|oklab|color-mix)\([^)]+\)/g, (match) => toRgbColor(match));
                      }
                  });

                  // 2. Convert any inline modern colors on cloned target elements to standard RGB
                  const allNodes = [clonedTarget, ...Array.from(clonedTarget.querySelectorAll<HTMLElement>('*'))];
                  allNodes.forEach((node) => {
                      if (node.style.backgroundImage && hasUnsupportedColorFunction(node.style.backgroundImage)) {
                          node.style.backgroundImage = node.style.backgroundImage.replace(/(?:oklch|oklab|color-mix)\([^)]+\)/g, (match) => toRgbColor(match));
                      }
                      if (node.style.color && hasUnsupportedColorFunction(node.style.color)) {
                          node.style.color = toRgbColor(node.style.color);
                      }
                      if (node.style.backgroundColor && hasUnsupportedColorFunction(node.style.backgroundColor)) {
                          node.style.backgroundColor = toRgbColor(node.style.backgroundColor);
                      }
                      if (node.style.borderColor && hasUnsupportedColorFunction(node.style.borderColor)) {
                          node.style.borderColor = toRgbColor(node.style.borderColor);
                      }
                  });

                  // 3. Stabilize SVG icons (ensure width/height are set explicitly so Lucide icons never collapse)
                  clonedTarget.querySelectorAll<SVGElement>('svg').forEach((svg) => {
                      const width = svg.style.width || svg.getAttribute('width') || '1.25em';
                      const height = svg.style.height || svg.getAttribute('height') || '1.25em';
                      svg.style.setProperty('display', 'inline-block');
                      svg.style.setProperty('vertical-align', 'middle');
                      svg.style.setProperty('overflow', 'visible');
                      svg.setAttribute('width', width);
                      svg.setAttribute('height', height);
                  });
              }
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
          const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

          // Preserve exact proportional aspect ratio
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;

          if (imgHeight <= pdfHeight) {
              // Fits within single A4 page
              pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
          } else if (imgHeight <= pdfHeight * 1.25) {
              // Slightly longer: fit proportionally to clean single A4 page without distortion
              const scaleRatio = pdfHeight / imgHeight;
              const scaledWidth = pdfWidth * scaleRatio;
              const xOffset = (pdfWidth - scaledWidth) / 2;
              pdf.addImage(imgData, 'JPEG', xOffset, 0, scaledWidth, pdfHeight);
          } else {
              // Multi-page A4
              let heightLeft = imgHeight;
              let position = 0;
              pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
              heightLeft -= pdfHeight;
              while (heightLeft > 0) {
                  position = heightLeft - imgHeight;
                  pdf.addPage();
                  pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                  heightLeft -= pdfHeight;
              }
          }

          pdf.save(`${fileName}.pdf`);
      } catch (err) {
          console.error('Error generating PDF:', err);
          alert('Error generating PDF. Please try again.');
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
      const flights = tripType === TripType.ROUND_TRIP ? [flight1, flight2] : [flight1];
      const targetElement = pdfExportRef.current || ticketRef.current;
      if (view === 'generator' && targetElement) {
        await generatePdfFromRef(targetElement, `Ticket-${passenger.lastName || 'Passenger'}`);

        // 1. Prepare history item for Ticket Management (مدیریت بلیت‌ها)
        const ticketId = passenger.ticketId || `SKY${Math.floor(10000000 + Math.random() * 90000000)}`;
        const pnr = passenger.pnr || `PNR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const passengerName = `${passenger.firstName || ''} ${passenger.lastName || ''}`.trim() || 'Passenger';
        const route = `${flights[0]?.originCode || 'MHD'} - ${flights[0]?.destCode || 'THR'}`;
        const date = flights[0]?.isoDate || flights[0]?.date || new Date().toISOString().split('T')[0];
        const calculatedPrice = (() => {
          if (passenger.price && passenger.price.trim() !== '') return passenger.price;
          const airline = flights[0]?.airline || '';
          const cleanAirline = airline.toUpperCase();
          const matched = ticketPricingConfig.customAirlinePrices?.find(
            (a) => a.isActive && (cleanAirline.includes(a.airlineCode) || cleanAirline.includes(a.airlineName.toUpperCase()))
          );
          const isDomestic = (flights[0]?.originCode === 'THR' || flights[0]?.originCode === 'MHD' || flights[0]?.originCode === 'SYZ' || flights[0]?.originCode === 'IFN' || flights[0]?.originCode === 'TBZ' || flights[0]?.originCode === 'KIH') &&
                             (flights[0]?.destCode === 'THR' || flights[0]?.destCode === 'MHD' || flights[0]?.destCode === 'SYZ' || flights[0]?.destCode === 'IFN' || flights[0]?.destCode === 'TBZ' || flights[0]?.destCode === 'KIH');

          if (ticketPricingConfig.defaultCurrency === 'USD') {
            if (matched) return `$${matched.priceUsd}`;
            return isDomestic ? `$${ticketPricingConfig.domesticPriceUsd}` : `$${ticketPricingConfig.internationalPriceUsd}`;
          } else {
            if (matched) return `${matched.priceIrr.toLocaleString()} ریال`;
            return isDomestic ? `${ticketPricingConfig.domesticPriceIrr.toLocaleString()} ریال` : `${ticketPricingConfig.internationalPriceIrr.toLocaleString()} ریال`;
          }
        })();

        const price = calculatedPrice;
        const paymentMethod = currentUser 
          ? (currentUser.isUnlimited ? 'Unlimited' : (currentUser.bonusFreeTickets || 0) > 0 ? 'Free Bonus' : 'Wallet') 
          : 'صادر شده / آنلاین';

        const historyRecord: TicketHistoryItem = {
          id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          ticketId,
          pnr,
          passengerName,
          route,
          date,
          issuedBy: currentUser?.name || 'مدیر سیستم / صدور آنلاین',
          status: 'Confirmed',
          price,
          paymentMethod,
          notes: `${flights[0]?.flightNumber || ''} ${flights[0]?.airline || ''}`
        };

        // Always save ticket to history and localStorage immediately
        setTicketHistory((prev) => {
          const updated = [historyRecord, ...prev.filter((t) => t.ticketId !== ticketId)];
          try {
            localStorage.setItem('localTicketHistory', JSON.stringify(updated.slice(0, 100)));
          } catch (e) {}
          return updated;
        });

        // 2. Automatically save passenger by passport/national ID to savedPassengers
        saveOrUpdatePassengerFromCurrent(passenger);

        // 3. If authenticated, persist to backend
        if (currentUser) {
          try {
            const created = await TicketService.createTicket({
              ticketId,
              pnr,
              passengerName,
              route,
              date,
              price,
              currency: ticketPricingConfig.defaultCurrency,
              paymentMethod,
              status: 'CONFIRMED',
              notes: `${flights[0]?.flightNumber || ''} ${flights[0]?.airline || ''}`
            });

            if (created) {
              const normalized = normalizeTicket(created);
              setTicketHistory((prev) => {
                const updated = [normalized, ...prev.filter((t) => t.ticketId !== normalized.ticketId)];
                try {
                  localStorage.setItem('localTicketHistory', JSON.stringify(updated.slice(0, 100)));
                } catch (e) {}
                return updated;
              });
            }

            const me = await AuthService.getCurrentUser();
            if (me) {
              setCurrentUser(normalizeUser(me));
              localStorage.setItem('user', JSON.stringify(me));
            }
          } catch (createErr) {
            console.warn('Could not record issued ticket in backend, saved locally:', createErr);
          }
        }
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
              {/* Ticket Management button accessible to view saved/downloaded tickets & base data */}
              <button 
                  onClick={() => setView(view === 'dashboard' ? 'generator' : 'dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-xs ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                  title={isRTL ? 'مدیریت بلیت‌ها و داده‌های پایه' : 'Ticket Management'}
              >
                  <LayoutDashboard className="w-4 h-4 text-blue-500" />
                  <span>{isRTL ? 'مدیریت بلیت‌ها' : 'Ticket Management'}</span>
                  {ticketHistory.length > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${view === 'dashboard' ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'}`}>
                      {ticketHistory.length}
                    </span>
                  )}
              </button>

              {/* Blog Link in Header */}
              <button onClick={() => setView('blog')} className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <BookOpen className="w-4 h-4" /> Blog
              </button>

              {currentUser ? (
                  <>
                     <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                             {currentUser.name.charAt(0)}
                         </div>
                         <div className="flex flex-col text-right">
                             <span className="text-xs font-bold text-gray-700">{currentUser.name}</span>
                             <div className="flex items-center gap-1 text-[10px] font-semibold">
                                 <span className="text-blue-700">{(currentUser.creditIrr ?? currentUser.credit ?? 0).toLocaleString()} ریال</span>
                                 <span className="text-gray-300">/</span>
                                 <span className="text-emerald-700">${currentUser.creditUsd ?? 0}</span>
                             </div>
                             {((currentUser.giftCreditIrr ?? currentUser.giftCredit ?? 0) > 0 || (currentUser.giftCreditUsd ?? 0) > 0) && (
                                 <span className="text-[9px] font-bold text-amber-700 bg-amber-50 rounded px-1 border border-amber-200/60">
                                     هدیه: {(currentUser.giftCreditIrr ?? currentUser.giftCredit ?? 0).toLocaleString()} ریال (${currentUser.giftCreditUsd ?? 0})
                                 </span>
                             )}
                         </div>
                     </div>
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
        {view === 'dashboard' ? (
            <Dashboard 
                currentUser={currentUser || {
                  id: 'current-admin',
                  name: isRTL ? 'مدیر سیستم' : 'System Admin',
                  email: 'admin@skyticket.com',
                  mobile: '09121234567',
                  role: 'Admin',
                  status: 'Active',
                  credit: 10000,
                  isUnlimited: true,
                  bonusFreeTickets: 100,
                  permissions: ['ISSUE_TICKET', 'MANAGE_USERS', 'MANAGE_BASE_DATA', 'VIEW_FINANCIALS', 'MANAGE_REVENUE', 'MANAGE_ADS', 'MANAGE_SETTINGS', 'MANAGE_BLOG']
                }}
                onBackToGenerator={() => setView('generator')}
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
                ticketPricingConfig={ticketPricingConfig} setTicketPricingConfig={setTicketPricingConfig}
                onSaveTicketPricing={handleSaveTicketPricing}
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
                            <Input label={lang === 'fa' ? 'آدرس آژانس' : 'Agency Address'} name="address" value={agency.address || ''} onChange={handleAgencyChange} placeholder={lang === 'fa' ? 'عراق نجف خیابان جنسیه مرکز لبنانی' : 'Agency Address'} />
                            
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
                                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">{t('gender')}</label>
                                <select name="gender" value={passenger.gender} onChange={handlePassengerChange} className="w-full p-2.5 rounded-lg border-2 border-slate-400 hover:border-slate-500 bg-white text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm">
                                    <option value="Male">{t('male')}</option>
                                    <option value="Female">{t('female')}</option>
                                </select>
                            </div>
                            <SearchableCombobox 
                              label={t('nationality')} 
                              name="nationality" 
                              value={passenger.nationality} 
                              uppercase
                              onChange={(val) => setPassenger(prev => ({ ...prev, nationality: val }))} 
                              options={nationalityOptions}
                              placeholder="IRAQ, IRAN..."
                              isRTL={isRTL}
                            />
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
                                 <div className="relative">
                                   <Input 
                                      label={passenger.idType === 'NationalID' ? t('nationalId') : t('passport')} 
                                      name="passportNumber" 
                                      value={passenger.passportNumber} 
                                      onChange={handlePassengerChange} 
                                   />
                                   {autoFillNotice && (
                                     <div className="mt-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in duration-200 shadow-xs">
                                       <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                                       <span className="font-semibold">{autoFillNotice}</span>
                                     </div>
                                   )}
                                   {idSearchSuggestions.length > 0 && (
                                     <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-blue-200 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                                       <div className="bg-blue-50/80 px-3 py-1.5 text-[11px] font-bold text-blue-700 flex justify-between items-center">
                                         <span>{isRTL ? 'مسافران منطبق با شناسه:' : 'Matching Saved Passengers:'}</span>
                                         <button type="button" onClick={() => setIdSearchSuggestions([])} className="text-gray-400 hover:text-gray-600">✕</button>
                                       </div>
                                       {idSearchSuggestions.map((sp) => (
                                         <button
                                           key={sp.id}
                                           type="button"
                                           onClick={() => applyPassengerSuggestion(sp)}
                                           className="w-full text-start px-3 py-2 text-xs hover:bg-blue-50 transition flex justify-between items-center"
                                         >
                                           <span className="font-bold text-gray-800">{sp.firstName} {sp.lastName}</span>
                                           <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-blue-600 font-bold">{sp.passportNumber || sp.nationalId}</span>
                                         </button>
                                       ))}
                                     </div>
                                   )}
                                 </div>
                             </div>
                             <Input label={t('ticketId')} name="ticketId" value={passenger.ticketId} onChange={handlePassengerChange} className="mt-8" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                             <Input label={t('pnr')} name="pnr" value={passenger.pnr} onChange={handlePassengerChange} />
                             {(selectedTemplate === '7' || selectedTemplate === '8' || selectedTemplate === '9') && (
                               <Input 
                                 label={selectedTemplate === '9' ? (isRTL ? 'شماره سفارش (Order No)' : 'Order Number') : t('localPnr')} 
                                 name="localPnr" 
                                 value={passenger.localPnr || ''} 
                                 onChange={handlePassengerChange} 
                                 placeholder={selectedTemplate === '9' ? '1088398569' : undefined} 
                               />
                             )}
                        </div>

                        {/* Issue Date & Issue Time */}
                        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <div className="flex justify-between items-center px-0.5">
                            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              {isRTL ? 'زمان و تاریخ صدور بلیت (Issue Details)' : 'Issue Date & Time'}
                            </span>
                            <button
                              type="button"
                              onClick={handleSetIssueToNow}
                              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200"
                              title={isRTL ? 'تنظیم به ساعت و تاریخ فعلی' : 'Set to current date and time'}
                            >
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              <span>{isRTL ? 'تنظیم به اکنون' : 'Set to Now'}</span>
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input 
                              label={t('issueDate')} 
                              name="issueDate" 
                              value={passenger.issueDate || ''} 
                              onChange={handlePassengerChange} 
                              placeholder="07/Nov/2025" 
                            />
                            <Input 
                              label={t('issueTime')} 
                              name="issueTime" 
                              value={passenger.issueTime || ''} 
                              onChange={handlePassengerChange} 
                              placeholder="18:11" 
                            />
                          </div>
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
                    <FlightForm 
                      title={t('goFlight')} 
                      data={flight1} 
                      onChange={(e: any) => handleFlightChange(1, e)} 
                      onFieldChange={(name: string, val: string, extra?: any) => handleFlightFieldChange(1, name, val, extra)}
                      onDateChange={(e: any) => handleFlightDateChange(1, e)} 
                      isSepehr={selectedTemplate === '7' || selectedTemplate === '8' || selectedTemplate === '9'} 
                      t={t} 
                      isRTL={isRTL} 
                      airports={savedAirports} 
                      airlines={savedAirlines}
                    />
                    
                    {tripType === TripType.ROUND_TRIP && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                             <FlightForm 
                               title={t('returnFlight')} 
                               data={flight2} 
                               onChange={(e: any) => handleFlightChange(2, e)} 
                               onFieldChange={(name: string, val: string, extra?: any) => handleFlightFieldChange(2, name, val, extra)}
                               onDateChange={(e: any) => handleFlightDateChange(2, e)} 
                               isSepehr={selectedTemplate === '7' || selectedTemplate === '8' || selectedTemplate === '9'} 
                               t={t} 
                               isRTL={isRTL} 
                               airports={savedAirports} 
                               airlines={savedAirlines}
                             />
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
                         <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                             <Palette className="w-4 h-4 text-blue-600" /> {t('selectDesign')}: <span className="text-blue-600 font-black">System Sepehr (New)</span>
                         </div>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 shadow-2xs">
                             <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                             <span>{isRTL ? 'قالب فعال: سیستم سپهر جدید' : 'Active: System Sepehr (New)'}</span>
                         </div>
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

      {/* High-Fidelity PDF Export Portal - Full Resolution (794px), No Scale Transform */}
      <div 
        id="ticket-pdf-export-portal"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-100000px',
          left: '-100000px',
          width: '794px',
          zIndex: -99999,
          pointerEvents: 'none',
          opacity: 1,
          overflow: 'visible',
          margin: 0,
          padding: 0,
          background: '#ffffff'
        }}
        dir="ltr"
      >
        <TicketPreview 
          ref={pdfExportRef}
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

      {/* Hidden Print Container for History */}
      {historyTicketData && (
          <div 
            id="history-pdf-export-portal"
            aria-hidden="true"
            style={{ 
              position: 'fixed', 
              top: '-100000px', 
              left: '-100000px', 
              width: '794px', 
              zIndex: -99999,
              pointerEvents: 'none',
              opacity: 1,
              overflow: 'visible',
              margin: 0,
              padding: 0,
              background: '#ffffff'
            }} 
            dir="ltr"
          >
              <TicketPreview ref={historyPrintRef} data={historyTicketData} />
          </div>
      )}

    </div>
  );
}
