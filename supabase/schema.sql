-- =============================================
-- دليل دكتورات النساء والتوليد في مصر
-- Supabase SQL Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- GOVERNORATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.governorates (
  id SERIAL PRIMARY KEY,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CITIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.cities (
  id SERIAL PRIMARY KEY,
  governorate_id INTEGER NOT NULL REFERENCES public.governorates(id) ON DELETE CASCADE,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(governorate_id, slug)
);

-- =============================================
-- DOCTORS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  governorate_id INTEGER NOT NULL REFERENCES public.governorates(id),
  city_id INTEGER REFERENCES public.cities(id),
  address TEXT NOT NULL,
  specialty VARCHAR(200) NOT NULL,
  bio TEXT,
  map_url TEXT,
  image_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- APPLICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.applications (
  id SERIAL PRIMARY KEY,
  doctor_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  governorate_id INTEGER NOT NULL REFERENCES public.governorates(id),
  city_id INTEGER REFERENCES public.cities(id),
  address TEXT NOT NULL,
  specialty VARCHAR(200) NOT NULL,
  bio TEXT,
  map_url TEXT,
  image_url TEXT,
  license_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_doctors_governorate ON public.doctors(governorate_id);
CREATE INDEX IF NOT EXISTS idx_doctors_city ON public.doctors(city_id);
CREATE INDEX IF NOT EXISTS idx_doctors_verified ON public.doctors(verified);
CREATE INDEX IF NOT EXISTS idx_doctors_featured ON public.doctors(featured);
CREATE INDEX IF NOT EXISTS idx_doctors_name ON public.doctors USING gin(to_tsvector('arabic', name));
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_cities_governorate ON public.cities(governorate_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.governorates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Public read access for governorates and cities
CREATE POLICY "Public read governorates" ON public.governorates FOR SELECT USING (true);
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (true);

-- Public read access for verified doctors only
CREATE POLICY "Public read verified doctors" ON public.doctors
  FOR SELECT USING (verified = true);

-- Authenticated (admin) full access on doctors
CREATE POLICY "Admin full access doctors" ON public.doctors
  FOR ALL USING (auth.role() = 'authenticated');

-- Public can insert applications
CREATE POLICY "Public insert applications" ON public.applications
  FOR INSERT WITH CHECK (true);

-- Admin only reads/updates applications
CREATE POLICY "Admin manage applications" ON public.applications
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- SEED: GOVERNORATES
-- =============================================
INSERT INTO public.governorates (name_ar, name_en, slug) VALUES
  ('القاهرة', 'Cairo', 'cairo'),
  ('الجيزة', 'Giza', 'giza'),
  ('الإسكندرية', 'Alexandria', 'alexandria'),
  ('القليوبية', 'Qalyubia', 'qalyubia'),
  ('الشرقية', 'Sharqia', 'sharqia'),
  ('الدقهلية', 'Dakahlia', 'dakahlia'),
  ('البحيرة', 'Beheira', 'beheira'),
  ('المنوفية', 'Monufia', 'monufia'),
  ('الغربية', 'Gharbia', 'gharbia'),
  ('كفر الشيخ', 'Kafr El-Sheikh', 'kafr-el-sheikh'),
  ('أسيوط', 'Assiut', 'assiut'),
  ('سوهاج', 'Sohag', 'sohag'),
  ('أسوان', 'Aswan', 'aswan'),
  ('الأقصر', 'Luxor', 'luxor'),
  ('بني سويف', 'Beni Suef', 'beni-suef'),
  ('المنيا', 'Minya', 'minya'),
  ('الفيوم', 'Faiyum', 'faiyum'),
  ('بورسعيد', 'Port Said', 'port-said'),
  ('الإسماعيلية', 'Ismailia', 'ismailia'),
  ('السويس', 'Suez', 'suez'),
  ('دمياط', 'Damietta', 'damietta'),
  ('شمال سيناء', 'North Sinai', 'north-sinai'),
  ('جنوب سيناء', 'South Sinai', 'south-sinai'),
  ('البحر الأحمر', 'Red Sea', 'red-sea'),
  ('مطروح', 'Matrouh', 'matrouh'),
  ('الوادي الجديد', 'New Valley', 'new-valley'),
  ('قنا', 'Qena', 'qena')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED: CITIES (Cairo)
-- =============================================
INSERT INTO public.cities (governorate_id, name_ar, name_en, slug) VALUES
  (1, 'مدينة نصر', 'Nasr City', 'nasr-city'),
  (1, 'المعادي', 'Maadi', 'maadi'),
  (1, 'مصر الجديدة', 'Heliopolis', 'heliopolis'),
  (1, 'الزمالك', 'Zamalek', 'zamalek'),
  (1, 'التجمع الخامس', 'New Cairo', 'new-cairo'),
  (1, 'شبرا', 'Shubra', 'shubra'),
  (1, 'وسط البلد', 'Downtown', 'downtown'),
  (1, 'عين شمس', 'Ain Shams', 'ain-shams'),
  (1, 'المطرية', 'Matarya', 'matarya'),
  -- Giza
  (2, 'الدقي', 'Dokki', 'dokki'),
  (2, 'المهندسين', 'Mohandessin', 'mohandessin'),
  (2, '6 أكتوبر', '6th October', '6th-october'),
  (2, 'الشيخ زايد', 'Sheikh Zayed', 'sheikh-zayed'),
  (2, 'الهرم', 'Haram', 'haram'),
  (2, 'فيصل', 'Faisal', 'faisal'),
  -- Alexandria
  (3, 'سموحة', 'Smouha', 'smouha'),
  (3, 'المنتزه', 'Montaza', 'montaza'),
  (3, 'العجمي', 'Agami', 'agami'),
  (3, 'كليوباترا', 'Cleopatra', 'cleopatra'),
  (3, 'الإبراهيمية', 'Ibrahimeyya', 'ibrahimeyya')
ON CONFLICT DO NOTHING;

-- =============================================
-- STORAGE BUCKETS (run in Supabase dashboard)
-- =============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('doctor-images', 'doctor-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('license-docs', 'license-docs', false);

-- =============================================
-- STORAGE POLICIES
-- =============================================
-- CREATE POLICY "Public read doctor images" ON storage.objects FOR SELECT USING (bucket_id = 'doctor-images');
-- CREATE POLICY "Public upload doctor images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'doctor-images');
-- CREATE POLICY "Admin access license docs" ON storage.objects FOR ALL USING (auth.role() = 'authenticated' AND bucket_id = 'license-docs');
