# دليل دكتورات النساء والتوليد في مصر

منصة متخصصة لدليل طبيبات أمراض النساء والتوليد في مصر.

## 🚀 البدء السريع

### 1. تثبيت المتطلبات

```bash
npm install
```

### 2. إعداد متغيرات البيئة

افتح ملف `.env.local` وأضف بيانات الاتصال بقاعدة بيانات Neon PostgreSQL والمشرف:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

ADMIN_EMAIL="admin@admin.com"
ADMIN_PASSWORD="admin123"
SESSION_SECRET="your-32-character-random-session-secret"
```

### 3. إعداد قاعدة البيانات وتوليد الجداول

لتزامن وتوليد الجداول وتغذية البيانات محلياً:

```bash
npx prisma db push
npm run db:seed
```

### 4. تشغيل المشروع

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

---

## 📁 هيكل المشروع

```
app/
  page.tsx              # الصفحة الرئيسية
  doctors/
    page.tsx            # دليل الطبيبات
    [id]/page.tsx       # ملف الطبيبة
  register/page.tsx     # تسجيل طبيبة جديدة
  contact/page.tsx      # تواصل معنا
  admin/
    page.tsx            # لوحة التحكم
    login/page.tsx      # تسجيل دخول المشرف
    doctors/page.tsx    # إدارة الطبيبات
    applications/page.tsx  # مراجعة الطلبات
    governorates/page.tsx  # إدارة المحافظات
    cities/page.tsx     # إدارة المدن
    featured/page.tsx   # الطبيبات المميزات
  api/
    doctors/route.ts    # API الطبيبات
    applications/route.ts  # API الطلبات

components/
  layout/Header.tsx
  layout/Footer.tsx
  admin/AdminSidebar.tsx
  doctors/DoctorCard.tsx
  doctors/DoctorFilters.tsx
  home/HeroSearch.tsx
  home/StatsSection.tsx
  home/CTASection.tsx
  ui/               # shadcn components

lib/
  auth/
    session.ts      # iron-session authentication
  prisma.ts         # Singleton Prisma client
  types/index.ts    # TypeScript types
  data/mock.ts      # Mock data
  utils.ts

prisma/
  schema.prisma     # Prisma database schema
  seed.ts           # Database seeding script
```

---

## 🎨 نظام الألوان

| اللون | الكود |
|-------|-------|
| وردي فاتح | `#FCE7F3` |
| بنفسجي | `#A855F7` |
| بنفسجي داكن | `#7E22CE` |
| أبيض | `#FFFFFF` |
| رمادي فاتح | `#F9FAFB` |

---

## 🗄️ جداول قاعدة البيانات

- **Governorate** - المحافظات
- **City** - المدن والأحياء
- **Doctor** - الطبيبات الموثوقات
- **Application** - طلبات التسجيل

---

## 🔐 الأمان

- الطبيبات العامة: قراءة الطبيبات الموثوقات فقط
- الطلبات: أي شخص يمكنه تقديم طلب
- لوحة الإدارة: محمية بـ iron-session (جلسات آمنة للمشرفين)

---


