# SkyTicket Generator

یک سیستم کامل مدیریت بلیط هواپیما با داشبورد مدیریتی، شامل فرانت‌اند و بک‌اند کامل با دیتابیس PostgreSQL.

## 🌟 ویژگی‌ها

### 🔐 سیستم احراز هویت و مجوزدهی
- ورود/ثبت‌نام کاربران با JWT
- نقش‌های مختلف: مدیر، نماینده، کاربر عادی
- مجوزهای مبتنی بر نقش برای دسترسی به منابع

### 🎫 مدیریت بلیط
- ایجاد و مدیریت بلیط‌های هواپیما
- پیگیری تاریخچه بلیط‌ها
- مدیریت مسافران ذخیره‌شده
- گزارش‌گیری آماری

### 🗄️ مدیریت داده‌های پایه
- مدیریت شرکت‌های هواپیمایی
- مدیریت فرودگاه‌ها
- مدیریت پروازهای ذخیره‌شده

### 💰 مدیریت درآمد
- مدل قیمت‌گذاری ثابت یا پلکانی
- محاسبه خودکار قیمت بر اساس تعداد
- گزارش‌های مالی

### 📢 مدیریت محتوا
- تبلیغات و بنرها
- پست‌های وبلاگ
- تنظیمات فوتر و صفحات استاتیک

### 🎨 رابط کاربری
- داشبورد مدیریتی مدرن
- طراحی ریسپانسیو
- پیش‌نمایش بلیط‌های مختلف
- پشتیبانی از چند زبان (انگلیسی، فارسی، عربی)

## 🛠️ تکنولوژی‌ها

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing
- **Lucide React** - Icons

## 🚀 راه‌اندازی سریع

### پیش‌نیازها
- Node.js (نسخه 16 یا بالاتر)
- PostgreSQL (نسخه 12 یا بالاتر)
- npm یا yarn

### 1. کلون کردن پروژه
```bash
git clone <repository-url>
cd skyticket-generator
```

### 2. راه‌اندازی Backend
```bash
cd backend

# نصب وابستگی‌ها
npm install

# تنظیم متغیرهای محیطی
cp .env.example .env
# ویرایش .env با اطلاعات دیتابیس خود

# راه‌اندازی دیتابیس
npm run prisma:generate
npm run prisma:push
npm run prisma:seed

# اجرای سرور توسعه
npm run dev
```

### 3. راه‌اندازی Frontend
```bash
cd ../frontend

# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev
```

### 4. دسترسی به برنامه
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📋 اعتبارنامه‌های پیش‌فرض

بعد از اجرای seeding دیتابیس، می‌توانید با این حساب‌ها وارد شوید:

### 👑 مدیر سیستم
- **ایمیل**: `admin@skyticket.com`
- **رمز عبور**: `admin123`
- **دسترسی**: تمام قابلیت‌ها

### 👨‍💼 نماینده فروش
- **ایمیل**: `agent@skyticket.com`
- **رمز عبور**: `agent123`
- **دسترسی**: صدور بلیط، مشاهده مالی

### 👤 کاربر عادی
- **ایمیل**: `user@skyticket.com`
- **رمز عبور**: `user123`
- **دسترسی**: صدور بلیط

## 📁 ساختار پروژه

```
skyticket-generator/
├── backend/                    # Backend API
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Sample data
│   ├── src/
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic
│   │   └── server.ts         # Main server
│   ├── uploads/              # File uploads
│   └── package.json
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── api/              # API integration
│   │   ├── components/       # React components
│   │   └── types.ts          # TypeScript types
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 تنظیمات محیطی

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/skyticket_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:5000/api"
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - ورود کاربر
- `POST /api/auth/register` - ثبت‌نام کاربر
- `GET /api/auth/me` - دریافت اطلاعات کاربر فعلی
- `POST /api/auth/logout` - خروج کاربر

### Users Management
- `GET /api/users` - لیست کاربران
- `POST /api/users` - ایجاد کاربر جدید
- `PUT /api/users/:id` - بروزرسانی کاربر
- `DELETE /api/users/:id` - حذف کاربر

### Tickets Management
- `GET /api/tickets` - لیست بلیط‌ها
- `POST /api/tickets` - ایجاد بلیط جدید
- `PUT /api/tickets/:id` - بروزرسانی بلیط
- `DELETE /api/tickets/:id` - حذف بلیط

### Base Data
- `GET /api/base-data/airlines` - لیست شرکت‌های هواپیمایی
- `GET /api/base-data/airports` - لیست فرودگاه‌ها
- `GET /api/base-data/flights` - لیست پروازها

### Content Management
- `GET /api/ads` - لیست تبلیغات
- `GET /api/blog` - لیست پست‌های وبلاگ
- `GET /api/settings/footer` - تنظیمات فوتر

## 🚀 اسکریپت‌های مفید

### Backend
```bash
npm run dev          # اجرای سرور توسعه
npm run build        # ساخت برای production
npm start           # اجرای سرور production
npm run prisma:generate  # تولید Prisma client
npm run prisma:push      # اعمال schema به دیتابیس
npm run prisma:migrate   # اجرای migration
npm run prisma:seed      # افزودن داده‌های نمونه
```

### Frontend
```bash
npm run dev         # اجرای سرور توسعه
npm run build       # ساخت برای production
npm run preview     # پیش‌نمایش build
```

## 🔒 امنیت

- رمزگذاری پسوردها با bcrypt
- احراز هویت JWT
- اعتبارسنجی ورودی‌ها
- محدودیت نرخ درخواست‌ها
- CORS configuration
- Helmet برای امنیت headers

## 🌐 پشتیبانی چندزبانه

- انگلیسی (EN)
- فارسی (FA)
- عربی (AR)

## 📊 ویژگی‌های داشبورد

### 👤 مدیریت کاربران
- لیست کاربران با فیلتر و جستجو
- ایجاد/ویرایش/حذف کاربران
- تغییر وضعیت کاربران
- مدیریت اعتبار کاربران

### 🎫 مدیریت بلیط
- مشاهده لیست بلیط‌ها
- ایجاد بلیط جدید
- ویرایش اطلاعات بلیط
- آمار و گزارشات

### 👥 مدیریت مسافران
- لیست مسافران ذخیره‌شده
- افزودن مسافر جدید
- ویرایش اطلاعات مسافر

### 🗄️ داده‌های پایه
- مدیریت شرکت‌های هواپیمایی
- مدیریت فرودگاه‌ها
- مدیریت پروازهای ذخیره‌شده

### 💰 مدیریت درآمد
- تنظیم مدل قیمت‌گذاری
- تعریف سطوح قیمتی
- گزارش درآمد

### 📢 مدیریت محتوا
- تبلیغات و بنرها
- پست‌های وبلاگ
- تنظیمات فوتر

## 🔄 اتصال Frontend به Backend

Frontend از طریق Axios API به backend متصل می‌شود. تمام API calls در پوشه `src/api/services/` سازماندهی شده‌اند.

برای تغییر URL API، متغیر `VITE_API_URL` را در فایل `.env` ویرایش کنید.

## 🤝 مشارکت

1. Fork پروژه
2. ایجاد branch feature جدید
3. اعمال تغییرات
4. اضافه کردن تست‌ها در صورت نیاز
5. ارسال Pull Request

## 📄 لایسنس

این پروژه تحت لایسنس ISC منتشر شده است.

---

**توسعه‌دهنده**: تیم SkyTicket
**تماس**: support@skyticket.com


# skyticket
