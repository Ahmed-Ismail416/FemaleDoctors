# دليل دكتورات النساء والتوليد في مصر

منصة متخصصة لدليل طبيبات أمراض النساء والتوليد في مصر.

## 🚀 البدء السريع

### 1. تثبيت المتطلبات

```bash
npm install
```

### 2. إعداد متغيرات البيئة

افتح ملف `.env.local` وأضف بياناتك من لوحة تحكم Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ntzzhbnddhmxrvajhcwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  # من: Project Settings > API
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...     # من: Project Settings > API (service_role)
```

> ⚠️ **تحذير**: لا تشارك `SUPABASE_SERVICE_ROLE_KEY` أبداً في الكود العام.

### 3. إعداد قاعدة البيانات في Supabase

1. افتح [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **SQL Editor**
4. انسخ محتوى ملف `supabase/schema.sql` والصقه وشغّله

### 4. إعداد Storage في Supabase

في **Storage** بـ Supabase Dashboard، أنشئ bucket جديد:
- `doctor-images` (Public)
- `license-docs` (Private)

### 5. إنشاء حساب المشرف

في **Authentication** بـ Supabase:
1. اضغط **Add User**
2. أدخل البريد الإلكتروني وكلمة المرور للمشرف
3. استخدم هذه البيانات لتسجيل الدخول على `/admin/login`

### 6. تشغيل المشروع

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
  supabase/         # Supabase clients
  types/index.ts    # TypeScript types
  data/mock.ts      # Mock data
  utils.ts

supabase/
  schema.sql        # Database schema
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

- **governorates** - المحافظات
- **cities** - المدن والأحياء
- **doctors** - الطبيبات الموثوقات
- **applications** - طلبات التسجيل

---

## 🔐 الأمان

- الطبيبات العامة: قراءة الطبيبات الموثوقات فقط
- الطلبات: أي شخص يمكنه تقديم طلب
- لوحة الإدارة: محمية بـ Supabase Auth
- الملفات الحساسة: محفوظة في bucket خاص

---

## 📞 الدعم

للاستفسارات: info@femaldoctors.eg
