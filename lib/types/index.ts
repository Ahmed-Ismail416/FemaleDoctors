// =============================================
// Database Types (matches Supabase schema)
// =============================================

export interface Governorate {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  created_at: string;
}

export interface City {
  id: number;
  governorate_id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  created_at: string;
  governorate?: Governorate;
}

export interface Doctor {
  id: number;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  governorate_id: number;
  city_id?: number;
  address: string;
  specialty: string;
  bio?: string;
  map_url?: string;
  image_url?: string;
  verified: boolean;
  featured: boolean;
  created_at: string;
  governorate?: Governorate;
  city?: City;
}

export interface Application {
  id: number;
  doctor_name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  governorate_id: number;
  city_id?: number;
  address: string;
  specialty: string;
  bio?: string;
  map_url?: string;
  image_url?: string;
  license_url?: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  created_at: string;
  governorate?: Governorate;
  city?: City;
}

// =============================================
// Form Types
// =============================================

export interface DoctorRegistrationFormData {
  doctor_name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  governorate_id: string;
  city_id?: string;
  address: string;
  specialty: string;
  bio?: string;
  map_url?: string;
  confirm_female: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// =============================================
// API Response Types
// =============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =============================================
// Filter Types
// =============================================

export interface DoctorFilters {
  search?: string;
  governorate_id?: number;
  city_id?: number;
  specialty?: string;
  featured?: boolean;
  verified?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ApplicationFilters {
  status?: "pending" | "approved" | "rejected" | "all";
  governorate_id?: number;
  page?: number;
  pageSize?: number;
}

// =============================================
// Admin Types
// =============================================

export interface AdminStats {
  totalDoctors: number;
  verifiedDoctors: number;
  featuredDoctors: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalGovernorates: number;
  totalCities: number;
}

// =============================================
// Specialty Options
// =============================================

export const SPECIALTIES = [
  "الجراحة العامة",
  "الجهاز الهضمي والمناظير",
  "باطنة عامة",
  "طب الأورام",
  "السكر والغدد الصماء",
  "التغذية والسمنة والنحافة",
  "النساء والتوليد",
  "الرمد",
  "الطب النفسي",
  "المخ والأعصاب",
  "القلب والأوعية الدموية",
  "الجلدية",
] as const;

export type Specialty = (typeof SPECIALTIES)[number];