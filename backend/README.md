# SkyTicket Backend API

A comprehensive backend API for the SkyTicket airline ticket generation system, built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based permissions
- **User Management**: Admin, Agent, and User roles with different permissions
- **Ticket Management**: Complete ticket lifecycle management
- **Base Data Management**: Airlines, airports, and flight data
- **Revenue Management**: Fixed and tiered pricing models
- **Content Management**: Blog posts, ads, and static pages
- **File Upload**: Support for images and documents
- **Transaction Management**: Payment tracking and financial reports

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Multer
- **Validation**: Express Validator

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Create database schema
   npm run prisma:push

   # Seed with sample data
   npm run prisma:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### User Management

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Ticket Management

- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `GET /api/tickets/stats/overview` - Get ticket statistics

### Base Data Management

- `GET /api/base-data/airlines` - Get all airlines
- `POST /api/base-data/airlines` - Create airline
- `PUT /api/base-data/airlines/:id` - Update airline
- `DELETE /api/base-data/airlines/:id` - Delete airline

- `GET /api/base-data/airports` - Get all airports
- `POST /api/base-data/airports` - Create airport
- `PUT /api/base-data/airports/:id` - Update airport
- `DELETE /api/base-data/airports/:id` - Delete airport

- `GET /api/base-data/flights` - Get all saved flights
- `POST /api/base-data/flights` - Create flight
- `PUT /api/base-data/flights/:id` - Update flight
- `DELETE /api/base-data/flights/:id` - Delete flight

### Content Management

- `GET /api/ads` - Get all ads
- `POST /api/ads` - Create ad
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Delete ad

- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

### Settings

- `GET /api/settings/footer` - Get footer config
- `PUT /api/settings/footer` - Update footer config

- `GET /api/settings/static-pages` - Get static pages
- `POST /api/settings/static-pages` - Create static page
- `PUT /api/settings/static-pages/:id` - Update static page
- `DELETE /api/settings/static-pages/:id` - Delete static page

### Revenue Management

- `GET /api/revenue/config` - Get revenue config
- `PUT /api/revenue/config` - Update revenue config
- `GET /api/revenue/calculate-price` - Calculate price
- `GET /api/revenue/stats` - Get revenue statistics

## 🔐 Default Credentials

After seeding the database, you can use these credentials:

- **Admin**: `admin@skyticket.com` / `admin123`
- **Agent**: `agent@skyticket.com` / `agent123`
- **User**: `user@skyticket.com` / `user123`

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Database seeding
├── src/
│   ├── middleware/     # Express middleware
│   ├── routes/         # API route handlers
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── server.ts       # Main server file
├── uploads/            # File uploads directory
├── .env.example        # Environment variables template
└── setup.sh           # Setup script
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 📜 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:migrate` - Create and run migrations
- `npm run prisma:seed` - Seed database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.


