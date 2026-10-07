import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import { buildPermissionRelation } from '../utils/permissions';
import { COMPREHENSIVE_AIRLINES } from '../data/comprehensiveAirlines';

const ADMIN_PERMISSIONS = [
  'ISSUE_TICKET',
  'MANAGE_USERS',
  'MANAGE_BASE_DATA',
  'VIEW_FINANCIALS',
  'MANAGE_REVENUE',
  'MANAGE_ADS',
  'MANAGE_SETTINGS',
  'MANAGE_BLOG'
];

const AGENT_PERMISSIONS = [
  'ISSUE_TICKET',
  'VIEW_FINANCIALS'
];

const USER_PERMISSIONS = ['ISSUE_TICKET'];

async function ensureUser(params: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'ADMIN' | 'AGENT' | 'USER';
  credit: number;
  creditIrr?: number;
  creditUsd?: number;
  giftCredit?: number;
  giftCreditIrr?: number;
  giftCreditUsd?: number;
  isUnlimited?: boolean;
  bonusFreeTickets?: number;
  permissions: string[];
}) {
  const existingUser = await prisma.user.findFirst({
    where: { email: { equals: params.email, mode: 'insensitive' } }
  });

  const hashedPassword = await bcrypt.hash(params.password, 10);

  if (existingUser) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
        status: 'ACTIVE',
        credit: params.credit,
        creditIrr: params.creditIrr ?? params.credit,
        creditUsd: params.creditUsd ?? 0,
        giftCredit: params.giftCredit ?? 0,
        giftCreditIrr: params.giftCreditIrr ?? params.giftCredit ?? 0,
        giftCreditUsd: params.giftCreditUsd ?? 0,
        bonusFreeTickets: params.bonusFreeTickets ?? 0
      }
    });
  }

  return prisma.user.create({
    data: {
      name: params.name,
      email: params.email.toLowerCase(),
      mobile: params.mobile,
      password: hashedPassword,
      role: params.role,
      status: 'ACTIVE',
      credit: params.credit,
      creditIrr: params.creditIrr ?? params.credit,
      creditUsd: params.creditUsd ?? 0,
      giftCredit: params.giftCredit ?? 0,
      giftCreditIrr: params.giftCreditIrr ?? params.giftCredit ?? 0,
      giftCreditUsd: params.giftCreditUsd ?? 0,
      isUnlimited: params.isUnlimited ?? false,
      bonusFreeTickets: params.bonusFreeTickets ?? 0,
      permissions: buildPermissionRelation(params.permissions)
    }
  });
}

export async function bootstrapDefaults() {
  await prisma.permission.createMany({
    data: [...new Set([...ADMIN_PERMISSIONS, ...AGENT_PERMISSIONS, ...USER_PERMISSIONS])].map((name) => ({ name })),
    skipDuplicates: true
  });

  await ensureUser({
    name: 'System Administrator',
    email: 'admin@skyticket.com',
    mobile: '+1234567890',
    password: 'admin123',
    role: 'ADMIN',
    credit: 100000000,
    creditIrr: 100000000,
    creditUsd: 10000,
    giftCredit: 50000000,
    giftCreditIrr: 50000000,
    giftCreditUsd: 5000,
    isUnlimited: true,
    bonusFreeTickets: 100,
    permissions: ADMIN_PERMISSIONS
  });

  await ensureUser({
    name: 'Sales Agent',
    email: 'agent@skyticket.com',
    mobile: '+1234567891',
    password: 'agent123',
    role: 'AGENT',
    credit: 50000000,
    creditIrr: 50000000,
    creditUsd: 5000,
    giftCredit: 10000000,
    giftCreditIrr: 10000000,
    giftCreditUsd: 1000,
    isUnlimited: false,
    bonusFreeTickets: 10,
    permissions: AGENT_PERMISSIONS
  });

  await ensureUser({
    name: 'Regular User',
    email: 'user@skyticket.com',
    mobile: '+1234567892',
    password: 'user123',
    role: 'USER',
    credit: 5000000,
    creditIrr: 5000000,
    creditUsd: 50,
    giftCredit: 1000000,
    giftCreditIrr: 1000000,
    giftCreditUsd: 10,
    isUnlimited: false,
    bonusFreeTickets: 2,
    permissions: USER_PERMISSIONS
  });

  await ensureUser({
    name: 'علی رضایی',
    email: 'aliali@gmail.com',
    mobile: '+989123456789',
    password: '123456789',
    role: 'USER',
    credit: 10000000,
    creditIrr: 10000000,
    creditUsd: 100,
    giftCredit: 2000000,
    giftCreditIrr: 2000000,
    giftCreditUsd: 20,
    isUnlimited: false,
    bonusFreeTickets: 5,
    permissions: USER_PERMISSIONS
  });

  // Seed or update all comprehensive airlines with their official logos in the database
  for (const item of COMPREHENSIVE_AIRLINES) {
    const existing = await prisma.airline.findFirst({
      where: {
        OR: [
          { code: item.code },
          { name: item.name }
        ]
      }
    });

    if (existing) {
      await prisma.airline.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          code: item.code,
          logoUrl: item.logoUrl
        }
      });
    } else {
      await prisma.airline.create({
        data: {
          name: item.name,
          code: item.code,
          logoUrl: item.logoUrl
        }
      });
    }
  }
}
