import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import { buildPermissionRelation } from '../utils/permissions';

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
  isUnlimited?: boolean;
  bonusFreeTickets?: number;
  permissions: string[];
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: params.email }
  });

  if (existingUser) {
    return existingUser;
  }

  const hashedPassword = await bcrypt.hash(params.password, 10);

  return prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      mobile: params.mobile,
      password: hashedPassword,
      role: params.role,
      credit: params.credit,
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
    credit: 10000,
    isUnlimited: true,
    permissions: ADMIN_PERMISSIONS
  });

  await ensureUser({
    name: 'Sales Agent',
    email: 'agent@skyticket.com',
    mobile: '+1234567891',
    password: 'agent123',
    role: 'AGENT',
    credit: 5000,
    permissions: AGENT_PERMISSIONS
  });

  await ensureUser({
    name: 'Regular User',
    email: 'user@skyticket.com',
    mobile: '+1234567892',
    password: 'user123',
    role: 'USER',
    credit: 100,
    permissions: USER_PERMISSIONS
  });
}
