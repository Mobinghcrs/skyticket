import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { buildPermissionRelation } from '../src/utils/permissions';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skyticket.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@skyticket.com',
      mobile: '+1234567890',
      password: adminPassword,
      role: 'ADMIN',
      credit: 10000,
      isUnlimited: true,
      permissions: buildPermissionRelation([
        'ISSUE_TICKET',
        'MANAGE_USERS',
        'MANAGE_BASE_DATA',
        'VIEW_FINANCIALS',
        'MANAGE_REVENUE',
        'MANAGE_ADS',
        'MANAGE_SETTINGS',
        'MANAGE_BLOG'
      ])
    }
  });

  // Create sample agent
  const agentPassword = await bcrypt.hash('agent123', 10);
  const agent = await prisma.user.upsert({
    where: { email: 'agent@skyticket.com' },
    update: {},
    create: {
      name: 'Sales Agent',
      email: 'agent@skyticket.com',
      mobile: '+1234567891',
      password: agentPassword,
      role: 'AGENT',
      credit: 5000,
      permissions: buildPermissionRelation(['ISSUE_TICKET', 'VIEW_FINANCIALS'])
    }
  });

  // Create sample user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@skyticket.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@skyticket.com',
      mobile: '+1234567892',
      password: userPassword,
      role: 'USER',
      credit: 100,
      permissions: buildPermissionRelation(['ISSUE_TICKET'])
    }
  });

  console.log('✅ Users created');

  // Create sample airlines
  const airlines = await Promise.all([
    prisma.airline.upsert({
      where: { code: 'IR' },
      update: {},
      create: { name: 'Iran Air', code: 'IR' }
    }),
    prisma.airline.upsert({
      where: { code: 'EK' },
      update: {},
      create: { name: 'Emirates', code: 'EK' }
    }),
    prisma.airline.upsert({
      where: { code: 'TK' },
      update: {},
      create: { name: 'Turkish Airlines', code: 'TK' }
    }),
    prisma.airline.upsert({
      where: { code: 'QR' },
      update: {},
      create: { name: 'Qatar Airways', code: 'QR' }
    })
  ]);

  console.log('✅ Airlines created');

  // Create sample airports
  const airports = await Promise.all([
    prisma.airport.upsert({
      where: { code: 'MHD' },
      update: {},
      create: { name: 'Shahid Hashemi Nejad Airport', code: 'MHD', city: 'Mashhad', country: 'Iran' }
    }),
    prisma.airport.upsert({
      where: { code: 'THR' },
      update: {},
      create: { name: 'Imam Khomeini International Airport', code: 'THR', city: 'Tehran', country: 'Iran' }
    }),
    prisma.airport.upsert({
      where: { code: 'IST' },
      update: {},
      create: { name: 'Istanbul Airport', code: 'IST', city: 'Istanbul', country: 'Turkey' }
    }),
    prisma.airport.upsert({
      where: { code: 'DOH' },
      update: {},
      create: { name: 'Hamad International Airport', code: 'DOH', city: 'Doha', country: 'Qatar' }
    }),
    prisma.airport.upsert({
      where: { code: 'DXB' },
      update: {},
      create: { name: 'Dubai International Airport', code: 'DXB', city: 'Dubai', country: 'UAE' }
    })
  ]);

  console.log('✅ Airports created');

  // Create sample flights
  await Promise.all([
    prisma.savedFlight.create({
      data: {
        flightNumber: 'IR-123',
        airlineId: airlines[0].id, // Iran Air
        originCode: 'MHD',
        destCode: 'THR',
        departureTime: '08:00',
        arrivalTime: '09:30',
        date: '2025-12-20'
      }
    }),
    prisma.savedFlight.create({
      data: {
        flightNumber: 'TK-456',
        airlineId: airlines[2].id, // Turkish Airlines
        originCode: 'THR',
        destCode: 'IST',
        departureTime: '14:00',
        arrivalTime: '16:30',
        date: '2025-12-21'
      }
    })
  ]);

  console.log('✅ Flights created');

  // Create sample passengers
  await Promise.all([
    prisma.savedPassenger.create({
      data: {
        firstName: 'Ahmad',
        lastName: 'Rezaei',
        gender: 'Male',
        passportNumber: 'A12345678',
        nationality: 'Iranian',
        totalFlights: 5
      }
    }),
    prisma.savedPassenger.create({
      data: {
        firstName: 'Maryam',
        lastName: 'Karimi',
        gender: 'Female',
        passportNumber: 'B87654321',
        nationality: 'Iranian',
        totalFlights: 3
      }
    })
  ]);

  console.log('✅ Passengers created');

  // Create sample tickets
  await Promise.all([
    prisma.ticketHistoryItem.create({
      data: {
        ticketId: 'SKY00123456',
        pnr: 'ABC123',
        passengerName: 'Ahmad Rezaei',
        route: 'MHD - THR',
        date: '2025-12-20',
        issuedBy: admin.name,
        status: 'CONFIRMED',
        price: '$150.00',
        paymentMethod: 'Wallet',
        userId: admin.id
      }
    }),
    prisma.ticketHistoryItem.create({
      data: {
        ticketId: 'SKY00123457',
        pnr: 'DEF456',
        passengerName: 'Maryam Karimi',
        route: 'THR - IST',
        date: '2025-12-21',
        issuedBy: agent.name,
        status: 'CONFIRMED',
        price: '$320.00',
        paymentMethod: 'Gateway',
        userId: agent.id
      }
    })
  ]);

  console.log('✅ Tickets created');

  // Create sample transactions
  await Promise.all([
    prisma.transaction.create({
      data: {
        date: '2025-12-20',
        amount: '$150.00',
        status: 'SUCCESS',
        description: 'Ticket Issue #SKY00123456',
        userId: admin.id
      }
    }),
    prisma.transaction.create({
      data: {
        date: '2025-12-21',
        amount: '$320.00',
        status: 'SUCCESS',
        description: 'Ticket Issue #SKY00123457',
        userId: agent.id
      }
    })
  ]);

  console.log('✅ Transactions created');

  // Create sample ads
  await Promise.all([
    prisma.ad.create({
      data: {
        location: 'SPOT_1',
        title: 'Special Discount',
        description: 'Get 20% off on international flights!',
        ctaText: 'Book Now',
        linkUrl: '/book',
        colorFrom: 'from-blue-600',
        colorTo: 'to-blue-400',
        iconName: 'Sparkles',
        isActive: true
      }
    }),
    prisma.ad.create({
      data: {
        location: 'SPOT_2',
        title: 'Winter Sale',
        description: 'Exclusive winter offers on all routes.',
        ctaText: 'View Offers',
        linkUrl: '/offers',
        colorFrom: 'from-green-600',
        colorTo: 'to-green-400',
        iconName: 'Gift',
        isActive: true
      }
    })
  ]);

  console.log('✅ Ads created');

  // Create sample blog posts
  await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'Travel Tips for International Flights',
        excerpt: 'Essential tips for a smooth international journey.',
        content: 'When traveling internationally, there are several important things to consider...',
        author: 'Admin',
        date: '2025-12-01',
        status: 'PUBLISHED'
      }
    }),
    prisma.blogPost.create({
      data: {
        title: 'Airport Security Guidelines',
        excerpt: 'What you need to know about airport security procedures.',
        content: 'Modern airport security procedures are designed to ensure passenger safety...',
        author: 'Admin',
        date: '2025-12-05',
        status: 'PUBLISHED'
      }
    })
  ]);

  console.log('✅ Blog posts created');

  // Create default revenue config
  await prisma.revenueConfig.create({
    data: {
      modelType: 'TIERED',
      fixedPrice: 10.00,
      globalFreeLimit: 5,
      tiers: {
        create: [
          { minQty: 1, maxQty: 10, pricePerTicket: 15.00 },
          { minQty: 11, maxQty: 50, pricePerTicket: 12.00 },
          { minQty: 51, maxQty: 100, pricePerTicket: 10.00 },
          { minQty: 101, maxQty: null, pricePerTicket: 8.00 }
        ]
      }
    }
  });

  console.log('✅ Revenue config created');

  // Create default footer config
  await prisma.footerConfig.create({
    data: {
      description: 'Leading ticket booking service for airlines worldwide.',
      address: '123 Airport Road, Aviation City, AC 12345',
      phone: '+1 (555) 123-4567',
      email: 'support@skyticket.com',
      copyright: `© ${new Date().getFullYear()} SkyTicket. All rights reserved.`,
      facebook: 'https://facebook.com/skyticket',
      twitter: 'https://twitter.com/skyticket',
      instagram: 'https://instagram.com/skyticket',
      linkedin: 'https://linkedin.com/company/skyticket'
    }
  });

  console.log('✅ Footer config created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Default login credentials:');
  console.log('Admin: admin@skyticket.com / admin123');
  console.log('Agent: agent@skyticket.com / agent123');
  console.log('User: user@skyticket.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

