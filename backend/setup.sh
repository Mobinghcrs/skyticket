#!/bin/bash

echo "🚀 Setting up SkyTicket Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Please make sure PostgreSQL is installed and running."
    echo "💡 You may need to create a database manually or update DATABASE_URL in .env"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npm run prisma:generate

# Create database tables
echo "🏗️  Creating database schema..."
npm run prisma:push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run prisma:seed

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Update DATABASE_URL in .env if needed"
echo "2. Run 'npm run dev' to start the development server"
echo "3. The server will start on http://localhost:5000"
echo ""
echo "📋 Default login credentials:"
echo "Admin: admin@skyticket.com / admin123"
echo "Agent: agent@skyticket.com / agent123"
echo "User: user@skyticket.com / user123"


