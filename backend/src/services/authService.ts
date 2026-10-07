import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { buildPermissionRelation } from '../utils/permissions';
import { getJwtExpiresIn, getJwtSecret } from '../config/env';

export interface LoginData {
  identifier: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role?: 'ADMIN' | 'AGENT' | 'USER';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}

export class AuthService {
  static async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const { identifier, password } = loginData;
      const cleanId = (identifier || '').trim();
      const lowerId = cleanId.toLowerCase();
      const digitsId = cleanId
        .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
        .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
        .replace(/[\s\-\(\)]/g, '');

      // Find user by email or mobile (case-insensitive)
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: lowerId, mode: 'insensitive' } },
            { email: cleanId },
            { mobile: cleanId },
            { mobile: digitsId }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          role: true,
          status: true,
          credit: true,
          creditIrr: true,
          creditUsd: true,
          giftCredit: true,
          giftCreditIrr: true,
          giftCreditUsd: true,
          isUnlimited: true,
          bonusFreeTickets: true,
          password: true,
          permissions: true
        }
      });

      // Fallback: check all users in store if findFirst missed casing
      if (!user) {
        const allUsers = await prisma.user.findMany();
        const matched = allUsers.find((u: any) =>
          (u.email || '').toLowerCase() === lowerId ||
          u.mobile === cleanId ||
          u.mobile === digitsId
        );
        if (matched) {
          user = matched;
        }
      }

      if (!user) {
        return { success: false, error: 'نام کاربری یا رمز عبور اشتباه است (Invalid credentials)' };
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { success: false, error: 'نام کاربری یا رمز عبور اشتباه است (Invalid credentials)' };
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        return { success: false, error: 'حساب کاربری شما غیرفعال است (Account is inactive)' };
      }

      // Generate token
      const token = this.generateToken(user.id);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        token,
        user: {
          ...userWithoutPassword,
          credit: userWithoutPassword.creditIrr ?? userWithoutPassword.credit ?? 0,
          creditIrr: userWithoutPassword.creditIrr ?? userWithoutPassword.credit ?? 0,
          creditUsd: userWithoutPassword.creditUsd ?? 0,
          giftCredit: userWithoutPassword.giftCreditIrr ?? userWithoutPassword.giftCredit ?? 0,
          giftCreditIrr: userWithoutPassword.giftCreditIrr ?? userWithoutPassword.giftCredit ?? 0,
          giftCreditUsd: userWithoutPassword.giftCreditUsd ?? 0
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'خطا در ورود به سیستم (Login failed)' };
    }
  }

  static async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const { name, email, mobile, password, role = 'USER' } = registerData;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          mobile,
          password: hashedPassword,
          role,
          permissions: buildPermissionRelation(this.getDefaultPermissions(role))
        },
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          role: true,
          status: true,
          credit: true,
          isUnlimited: true,
          bonusFreeTickets: true,
          permissions: true
        }
      });

      // Generate token
      const token = this.generateToken(user.id);

      return {
        success: true,
        token,
        user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  static async getCurrentUser(userId: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          role: true,
          status: true,
          credit: true,
          creditIrr: true,
          creditUsd: true,
          giftCredit: true,
          giftCreditIrr: true,
          giftCreditUsd: true,
          isUnlimited: true,
          bonusFreeTickets: true,
          permissions: true
        }
      });

      if (!user) return null;

      return {
        ...user,
        credit: user.creditIrr ?? user.credit ?? 0,
        creditIrr: user.creditIrr ?? user.credit ?? 0,
        creditUsd: user.creditUsd ?? 0,
        giftCredit: user.giftCreditIrr ?? user.giftCredit ?? 0,
        giftCreditIrr: user.giftCreditIrr ?? user.giftCredit ?? 0,
        giftCreditUsd: user.giftCreditUsd ?? 0
      };
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  private static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, getJwtSecret(), {
      expiresIn: getJwtExpiresIn() as jwt.SignOptions['expiresIn']
    });
  }

  private static getDefaultPermissions(role: string): string[] {
    switch (role) {
      case 'ADMIN':
        return [
          'ISSUE_TICKET',
          'MANAGE_USERS',
          'MANAGE_BASE_DATA',
          'VIEW_FINANCIALS',
          'MANAGE_REVENUE',
          'MANAGE_ADS',
          'MANAGE_SETTINGS',
          'MANAGE_BLOG'
        ];
      case 'AGENT':
        return [
          'ISSUE_TICKET',
          'VIEW_FINANCIALS'
        ];
      case 'USER':
      default:
        return ['ISSUE_TICKET'];
    }
  }
}
