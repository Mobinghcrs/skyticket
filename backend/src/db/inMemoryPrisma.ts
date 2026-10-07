import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { COMPREHENSIVE_AIRLINES } from '../data/comprehensiveAirlines';

const DATA_DIR = path.resolve(process.cwd(), 'backend/data');
const STORE_FILE = path.resolve(DATA_DIR, 'dbStore.json');

function cuid(): string {
  return 'c' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 10);
const AGENT_PASSWORD_HASH = bcrypt.hashSync('agent123', 10);
const USER_PASSWORD_HASH = bcrypt.hashSync('user123', 10);
const ALIALI_PASSWORD_HASH = bcrypt.hashSync('123456789', 10);

const ALL_PERMISSIONS = [
  'ISSUE_TICKET',
  'MANAGE_USERS',
  'MANAGE_BASE_DATA',
  'VIEW_FINANCIALS',
  'MANAGE_REVENUE',
  'MANAGE_ADS',
  'MANAGE_SETTINGS',
  'MANAGE_BLOG'
];

interface InMemStore {
  users: any[];
  permissions: any[];
  ticketHistoryItems: any[];
  savedPassengers: any[];
  transactions: any[];
  airlines: any[];
  airports: any[];
  savedFlights: any[];
  ads: any[];
  blogPosts: any[];
  footerConfigs: any[];
  staticPages: any[];
  revenueConfigs: any[];
  revenueTiers: any[];
  ticketTemplates: any[];
  ticketPricingConfigs: any[];
}

function createInitialStore(): InMemStore {
  const permissions = ALL_PERMISSIONS.map((name) => ({
    id: cuid(),
    name,
    description: `Permission to ${name.toLowerCase().replace(/_/g, ' ')}`
  }));

  const adminPermissions = permissions.map(p => ({ id: p.id, name: p.name }));
  const agentPermissions = permissions.filter(p => ['ISSUE_TICKET', 'VIEW_FINANCIALS'].includes(p.name)).map(p => ({ id: p.id, name: p.name }));
  const userPermissions = permissions.filter(p => p.name === 'ISSUE_TICKET').map(p => ({ id: p.id, name: p.name }));

  const users = [
    {
      id: 'admin-user-id',
      name: 'System Administrator',
      email: 'admin@skyticket.com',
      mobile: '+1234567890',
      password: ADMIN_PASSWORD_HASH,
      role: 'ADMIN',
      status: 'ACTIVE',
      credit: 100000000,
      creditIrr: 100000000,
      creditUsd: 10000,
      giftCredit: 50000000,
      giftCreditIrr: 50000000,
      giftCreditUsd: 5000,
      isUnlimited: true,
      bonusFreeTickets: 100,
      permissions: adminPermissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'agent-user-id',
      name: 'Sales Agent',
      email: 'agent@skyticket.com',
      mobile: '+1234567891',
      password: AGENT_PASSWORD_HASH,
      role: 'AGENT',
      status: 'ACTIVE',
      credit: 50000000,
      creditIrr: 50000000,
      creditUsd: 5000,
      giftCredit: 10000000,
      giftCreditIrr: 10000000,
      giftCreditUsd: 1000,
      isUnlimited: false,
      bonusFreeTickets: 10,
      permissions: agentPermissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'regular-user-id',
      name: 'Regular User',
      email: 'user@skyticket.com',
      mobile: '+1234567892',
      password: USER_PASSWORD_HASH,
      role: 'USER',
      status: 'ACTIVE',
      credit: 5000000,
      creditIrr: 5000000,
      creditUsd: 50,
      giftCredit: 1000000,
      giftCreditIrr: 1000000,
      giftCreditUsd: 10,
      isUnlimited: false,
      bonusFreeTickets: 2,
      permissions: userPermissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'aliali-user-id',
      name: 'علی رضایی',
      email: 'aliali@gmail.com',
      mobile: '+989123456789',
      password: ALIALI_PASSWORD_HASH,
      role: 'USER',
      status: 'ACTIVE',
      credit: 10000000,
      creditIrr: 10000000,
      creditUsd: 100,
      giftCredit: 2000000,
      giftCreditIrr: 2000000,
      giftCreditUsd: 20,
      isUnlimited: false,
      bonusFreeTickets: 5,
      permissions: userPermissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const airlines = COMPREHENSIVE_AIRLINES.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    logoUrl: item.logoUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  const airports = [
    { id: '1', name: 'Tehran (Imam Khomeini)', code: 'IKA', city: 'Tehran', country: 'Iran', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'Tehran (Mehrabad)', code: 'THR', city: 'Tehran', country: 'Iran', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'Mashhad', code: 'MHD', city: 'Mashhad', country: 'Iran', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', name: 'Shiraz', code: 'SYZ', city: 'Shiraz', country: 'Iran', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', name: 'Isfahan', code: 'IFN', city: 'Isfahan', country: 'Iran', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '6', name: 'Tabriz', code: 'TBZ', city: 'Tabriz', country: 'Iran', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '7', name: 'Kish Island', code: 'KIH', city: 'Kish', country: 'Iran', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '8', name: 'Dubai', code: 'DXB', city: 'Dubai', country: 'UAE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '9', name: 'Istanbul', code: 'IST', city: 'Istanbul', country: 'Turkey', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '10', name: 'Doha', code: 'DOH', city: 'Doha', country: 'Qatar', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

  const savedFlights = [
    {
      id: cuid(),
      flightNumber: 'IR-123',
      airlineId: '2',
      originCode: 'MHD',
      destCode: 'THR',
      departureTime: '08:00',
      arrivalTime: '09:30',
      date: '2025-12-20',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: cuid(),
      flightNumber: 'TK-456',
      airlineId: '20',
      originCode: 'THR',
      destCode: 'IST',
      departureTime: '14:00',
      arrivalTime: '16:30',
      date: '2025-12-21',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const savedPassengers = [
    {
      id: cuid(),
      firstName: 'Ahmad',
      lastName: 'Rezaei',
      gender: 'Male',
      passportNumber: 'A12345678',
      nationality: 'Iranian',
      totalFlights: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: cuid(),
      firstName: 'Maryam',
      lastName: 'Karimi',
      gender: 'Female',
      passportNumber: 'B87654321',
      nationality: 'Iranian',
      totalFlights: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const ticketHistoryItems = [
    {
      id: cuid(),
      ticketId: 'SKY00123456',
      pnr: 'ABC123',
      passengerName: 'Ahmad Rezaei',
      route: 'MHD - THR',
      date: '2025-12-20',
      issuedBy: 'System Administrator',
      status: 'CONFIRMED',
      price: '$150.00',
      paymentMethod: 'Wallet',
      userId: 'admin-user-id',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: cuid(),
      ticketId: 'SKY00123457',
      pnr: 'DEF456',
      passengerName: 'Maryam Karimi',
      route: 'THR - IST',
      date: '2025-12-21',
      issuedBy: 'Sales Agent',
      status: 'CONFIRMED',
      price: '$320.00',
      paymentMethod: 'Gateway',
      userId: 'agent-user-id',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const transactions = [
    {
      id: cuid(),
      date: '2025-12-20',
      amount: '$150.00',
      status: 'SUCCESS',
      description: 'Ticket Issue #SKY00123456',
      userId: 'admin-user-id',
      createdAt: new Date().toISOString()
    },
    {
      id: cuid(),
      date: '2025-12-21',
      amount: '$320.00',
      status: 'SUCCESS',
      description: 'Ticket Issue #SKY00123457',
      userId: 'agent-user-id',
      createdAt: new Date().toISOString()
    }
  ];

  const ads = [
    {
      id: cuid(),
      location: 'SPOT_1',
      title: 'Special Discount',
      description: 'Get 20% off on international flights!',
      ctaText: 'Book Now',
      linkUrl: '#',
      imageUrl: null,
      colorFrom: 'from-blue-600',
      colorTo: 'to-blue-400',
      iconName: 'Sparkles',
      isActive: true,
      startDate: null,
      endDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: cuid(),
      location: 'SPOT_2',
      title: 'Winter Sale',
      description: 'Exclusive winter offers on all routes.',
      ctaText: 'View Offers',
      linkUrl: '#',
      imageUrl: null,
      colorFrom: 'from-green-600',
      colorTo: 'to-green-400',
      iconName: 'Gift',
      isActive: true,
      startDate: null,
      endDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const blogPosts = [
    {
      id: cuid(),
      title: 'Travel Tips for International Flights',
      excerpt: 'Essential tips for a smooth international journey.',
      content: 'When traveling internationally, always verify passport validity, arriving at least 3 hours prior to departure.',
      author: 'Admin',
      date: '2025-12-01',
      imageUrl: null,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: cuid(),
      title: 'Airport Security Guidelines',
      excerpt: 'What you need to know about airport security procedures.',
      content: 'Modern airport security procedures ensure passenger safety. Keep liquids in 100ml containers.',
      author: 'Admin',
      date: '2025-12-05',
      imageUrl: null,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const footerConfigs = [
    {
      id: cuid(),
      description: 'Leading ticket booking and itinerary generation service for airlines worldwide.',
      address: '123 Airport Road, Aviation City, AC 12345',
      phone: '+1 (555) 123-4567',
      email: 'support@skyticket.com',
      copyright: `© ${new Date().getFullYear()} SkyTicket. All rights reserved.`,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      updatedAt: new Date().toISOString()
    }
  ];

  const staticPages = [
    {
      id: cuid(),
      slug: 'terms',
      title: 'Terms & Conditions',
      content: 'Standard terms and conditions for flight ticket generation and reservations.',
      updatedAt: new Date().toISOString()
    },
    {
      id: cuid(),
      slug: 'privacy',
      title: 'Privacy Policy',
      content: 'We value your privacy. Data collected is used solely for generating flight tickets.',
      updatedAt: new Date().toISOString()
    }
  ];

  const revenueConfigId = cuid();
  const revenueConfigs = [
    {
      id: revenueConfigId,
      modelType: 'TIERED',
      fixedPrice: 10.0,
      globalFreeLimit: 5,
      updatedAt: new Date().toISOString()
    }
  ];

  const revenueTiers = [
    { id: cuid(), revenueConfigId, minQty: 1, maxQty: 10, pricePerTicket: 15.0 },
    { id: cuid(), revenueConfigId, minQty: 11, maxQty: 50, pricePerTicket: 12.0 },
    { id: cuid(), revenueConfigId, minQty: 51, maxQty: 100, pricePerTicket: 10.0 },
    { id: cuid(), revenueConfigId, minQty: 101, maxQty: null, pricePerTicket: 8.0 }
  ];

  const ticketTemplates = [
    {
      id: cuid(),
      name: 'Standard Template',
      description: 'Standard airline ticket layout with clean blue theme',
      thumbnailColor: '#0b74de',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const ticketPricingConfigs = [
    {
      id: 'default-pricing-id',
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
      ],
      updatedAt: new Date().toISOString()
    }
  ];

  return {
    users,
    permissions,
    ticketHistoryItems,
    savedPassengers,
    transactions,
    airlines,
    airports,
    savedFlights,
    ads,
    blogPosts,
    footerConfigs,
    staticPages,
    revenueConfigs,
    revenueTiers,
    ticketTemplates,
    ticketPricingConfigs
  };
}

function matchCondition(itemVal: any, cond: any): boolean {
  if (cond === undefined) return true;
  if (cond === null) return itemVal === null;
  if (typeof cond === 'object' && !(cond instanceof Date)) {
    if ('equals' in cond && itemVal !== cond.equals) return false;
    if ('not' in cond && itemVal === cond.not) return false;
    if ('in' in cond && Array.isArray(cond.in) && !cond.in.includes(itemVal)) return false;
    if ('notIn' in cond && Array.isArray(cond.notIn) && cond.notIn.includes(itemVal)) return false;
    if ('contains' in cond) {
      const s1 = String(itemVal || '').toLowerCase();
      const s2 = String(cond.contains || '').toLowerCase();
      if (!s1.includes(s2)) return false;
    }
    if ('startsWith' in cond && !String(itemVal || '').startsWith(String(cond.startsWith || ''))) return false;
    if ('endsWith' in cond && !String(itemVal || '').endsWith(String(cond.endsWith || ''))) return false;
    if ('gte' in cond && itemVal < cond.gte) return false;
    if ('lte' in cond && itemVal > cond.lte) return false;
    if ('gt' in cond && itemVal <= cond.gt) return false;
    if ('lt' in cond && itemVal >= cond.lt) return false;
    if ('some' in cond) {
      if (!Array.isArray(itemVal)) return false;
      return itemVal.some(elem => matchWhere(elem, cond.some));
    }
    return true;
  }
  return itemVal === cond;
}

function matchWhere(item: any, where?: any): boolean {
  if (!where || typeof where !== 'object') return true;
  for (const key of Object.keys(where)) {
    if (key === 'OR') {
      const orList = where[key];
      if (Array.isArray(orList) && orList.length > 0) {
        if (!orList.some(cond => matchWhere(item, cond))) return false;
      }
      continue;
    }
    if (key === 'AND') {
      const andList = where[key];
      if (Array.isArray(andList)) {
        if (!andList.every(cond => matchWhere(item, cond))) return false;
      }
      continue;
    }
    if (key === 'NOT') {
      if (matchWhere(item, where[key])) return false;
      continue;
    }
    if (!matchCondition(item[key], where[key])) {
      return false;
    }
  }
  return true;
}

function applySelectOrInclude(item: any, select?: any, include?: any): any {
  if (!item) return item;
  let res = { ...item };
  if (select && typeof select === 'object') {
    res = {};
    for (const k of Object.keys(select)) {
      if (select[k]) {
        res[k] = item[k];
      }
    }
  }
  return res;
}

function applySort(list: any[], orderBy?: any): any[] {
  if (!orderBy) return list;
  const res = [...list];
  const keys = Object.keys(orderBy);
  if (keys.length === 0) return res;
  const k = keys[0];
  const dir = String(orderBy[k]).toLowerCase() === 'asc' ? 1 : -1;
  res.sort((a, b) => {
    if (a[k] < b[k]) return -1 * dir;
    if (a[k] > b[k]) return 1 * dir;
    return 0;
  });
  return res;
}

function persistStoreInternal(store: InMemStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist in-memory store:', err);
  }
}

export function createInMemPrismaClient() {
  let store: InMemStore;
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      store = JSON.parse(raw);
    } else {
      store = createInitialStore();
      persistStoreInternal(store);
    }
  } catch (e) {
    store = createInitialStore();
  }

  // Ensure ticketPricingConfigs exists
  if (!store.ticketPricingConfigs || store.ticketPricingConfigs.length === 0) {
    store.ticketPricingConfigs = [
      {
        id: 'default-pricing-id',
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
        ],
        updatedAt: new Date().toISOString()
      }
    ];
    persistStoreInternal(store);
  }

  // Ensure aliali@gmail.com exists with password '123456789' and active status
  const existingAli = store.users.find(u => (u.email || '').toLowerCase() === 'aliali@gmail.com');
  if (!existingAli) {
    store.users.push({
      id: 'aliali-user-id',
      name: 'علی رضایی',
      email: 'aliali@gmail.com',
      mobile: '+989123456789',
      password: ALIALI_PASSWORD_HASH,
      role: 'USER',
      status: 'ACTIVE',
      credit: 10000000,
      creditIrr: 10000000,
      creditUsd: 100,
      giftCredit: 2000000,
      giftCreditIrr: 2000000,
      giftCreditUsd: 20,
      isUnlimited: false,
      bonusFreeTickets: 5,
      permissions: [{ id: 'p_issue', name: 'ISSUE_TICKET' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    persistStoreInternal(store);
  } else {
    // Ensure credentials and dual currency balances are set
    existingAli.password = ALIALI_PASSWORD_HASH;
    existingAli.status = 'ACTIVE';
    if (existingAli.creditIrr === undefined) existingAli.creditIrr = existingAli.credit || 10000000;
    if (existingAli.creditUsd === undefined) existingAli.creditUsd = 100;
    if (existingAli.giftCreditIrr === undefined) existingAli.giftCreditIrr = 2000000;
    if (existingAli.giftCreditUsd === undefined) existingAli.giftCreditUsd = 20;
    if (existingAli.bonusFreeTickets === undefined) existingAli.bonusFreeTickets = 5;
    persistStoreInternal(store);
  }

  const createModelHandler = (list: any[], populateFn?: (item: any) => any) => ({
    async findMany(args?: any) {
      let filtered = list.filter(item => matchWhere(item, args?.where));
      if (populateFn) {
        filtered = filtered.map(populateFn);
      }
      if (args?.orderBy) {
        filtered = applySort(filtered, args.orderBy);
      }
      if (typeof args?.skip === 'number') {
        filtered = filtered.slice(args.skip);
      }
      if (typeof args?.take === 'number') {
        filtered = filtered.slice(0, args.take);
      }
      return filtered.map(item => applySelectOrInclude(item, args?.select, args?.include));
    },
    async findFirst(args?: any) {
      let item = list.find(it => matchWhere(it, args?.where));
      if (!item) return null;
      if (populateFn) item = populateFn(item);
      return applySelectOrInclude(item, args?.select, args?.include);
    },
    async findUnique(args?: any) {
      let item = list.find(it => matchWhere(it, args?.where));
      if (!item) return null;
      if (populateFn) item = populateFn(item);
      return applySelectOrInclude(item, args?.select, args?.include);
    },
    async create(args: any) {
      const data = { ...args.data };
      if (!data.id) data.id = cuid();
      if (!data.createdAt) data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();

      if (data.permissions && typeof data.permissions === 'object') {
        if (data.permissions.connectOrCreate) {
          data.permissions = data.permissions.connectOrCreate.map((p: any) => ({
            id: cuid(),
            name: p.where.name
          }));
        }
      }

      list.push(data);
      persistStoreInternal(store);
      let res = populateFn ? populateFn(data) : data;
      return applySelectOrInclude(res, args.select, args.include);
    },
    async createMany(args: any) {
      let count = 0;
      for (const raw of args.data || []) {
        const data = { ...raw };
        if (!data.id) data.id = cuid();
        if (args.skipDuplicates) {
          const exists = list.some(item => item.name === data.name || (data.code && item.code === data.code));
          if (exists) continue;
        }
        list.push(data);
        count++;
      }
      if (count > 0) persistStoreInternal(store);
      return { count };
    },
    async update(args: any) {
      const index = list.findIndex(it => matchWhere(it, args.where));
      if (index === -1) {
        throw new Error('Record to update not found.');
      }
      const existing = list[index];
      const data = { ...args.data };

      if (data.permissions && typeof data.permissions === 'object') {
        if (data.permissions.connectOrCreate) {
          data.permissions = data.permissions.connectOrCreate.map((p: any) => ({
            id: cuid(),
            name: p.where.name
          }));
        }
      }

      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString()
      };
      list[index] = updated;
      persistStoreInternal(store);
      let res = populateFn ? populateFn(updated) : updated;
      return applySelectOrInclude(res, args.select, args.include);
    },
    async upsert(args: any) {
      const existing = list.find(it => matchWhere(it, args.where));
      if (existing) {
        const updated = { ...existing, ...args.update, updatedAt: new Date().toISOString() };
        const index = list.indexOf(existing);
        list[index] = updated;
        persistStoreInternal(store);
        return populateFn ? populateFn(updated) : updated;
      }
      return this.create({ data: args.create });
    },
    async delete(args: any) {
      const index = list.findIndex(it => matchWhere(it, args.where));
      if (index === -1) {
        throw new Error('Record to delete not found.');
      }
      const removed = list.splice(index, 1)[0];
      persistStoreInternal(store);
      return removed;
    },
    async deleteMany(args?: any) {
      let count = 0;
      for (let i = list.length - 1; i >= 0; i--) {
        if (matchWhere(list[i], args?.where)) {
          list.splice(i, 1);
          count++;
        }
      }
      if (count > 0) persistStoreInternal(store);
      return { count };
    },
    async count(args?: any) {
      return list.filter(it => matchWhere(it, args?.where)).length;
    }
  });

  const client: any = {
    user: createModelHandler(store.users),
    permission: createModelHandler(store.permissions),
    ticketHistoryItem: createModelHandler(store.ticketHistoryItems),
    savedPassenger: createModelHandler(store.savedPassengers),
    transaction: createModelHandler(store.transactions),
    airline: createModelHandler(store.airlines),
    airport: createModelHandler(store.airports),
    savedFlight: createModelHandler(store.savedFlights, (flight) => {
      const airline = store.airlines.find(a => a.id === flight.airlineId);
      const originAirport = store.airports.find(a => a.code === flight.originCode);
      const destAirport = store.airports.find(a => a.code === flight.destCode);
      return {
        ...flight,
        airline,
        originAirport,
        destAirport
      };
    }),
    ad: createModelHandler(store.ads),
    blogPost: createModelHandler(store.blogPosts),
    footerConfig: createModelHandler(store.footerConfigs),
    staticPage: createModelHandler(store.staticPages),
    revenueConfig: createModelHandler(store.revenueConfigs, (config) => {
      const tiers = store.revenueTiers.filter(t => t.revenueConfigId === config.id);
      return { ...config, tiers };
    }),
    revenueTier: createModelHandler(store.revenueTiers),
    ticketTemplate: createModelHandler(store.ticketTemplates),
    ticketPricingConfig: createModelHandler(store.ticketPricingConfigs),
    $connect: async () => {},
    $disconnect: async () => {},
    $transaction: async (arg: any) => {
      if (typeof arg === 'function') {
        return arg(client);
      }
      if (Array.isArray(arg)) {
        return Promise.all(arg);
      }
      return arg;
    }
  };

  return client;
}
