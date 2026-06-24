import { useState, useMemo } from "react";
import {
  Search, Phone, MessageCircle, Star, MapPin, Clock, Shield, Menu, X,
  Users, CheckCircle, Award, Calendar, Eye, Heart, Filter,
  BarChart3, UserPlus, Mail, AlertCircle, Building2,
  GraduationCap, BadgeCheck, ChevronDown, ArrowRight,
  Check, XCircle, TrendingUp, Stethoscope, ChevronLeft
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

type Page = "home" | "directory" | "profile" | "register" | "contact" | "admin";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  subspecialty: string;
  governorate: string;
  city: string;
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
  experience: number;
  priceRange: string;
  phone: string;
  whatsapp: string;
  clinic: string;
  address: string;
  available: boolean;
  bio: string;
  education: string[];
  workingHours: string;
}

const DOCTORS: Doctor[] = [
  {
    id: 1, name: "د. فاطمة أحمد حسن", specialty: "أمراض النساء والتوليد",
    subspecialty: "الحمل عالي الخطورة", governorate: "القاهرة", city: "المعادي",
    rating: 4.9, reviews: 234,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format",
    verified: true, experience: 18, priceRange: "400 - 600 جنيه",
    phone: "01001234567", whatsapp: "201001234567",
    clinic: "عيادة الأمل للنساء", address: "15 شارع النيل، المعادي، القاهرة",
    available: true,
    bio: "دكتورة متخصصة في أمراض النساء والتوليد مع خبرة 18 عامًا في مجال الحمل عالي الخطورة والولادة الطبيعية. تتابع الدكتورة فاطمة آلاف الحالات بنجاح وتقدم رعاية شاملة للمرأة الحامل في جميع مراحل الحمل والوضع.",
    education: ["بكالوريوس الطب والجراحة، جامعة القاهرة 2006", "ماجستير أمراض النساء والتوليد، جامعة القاهرة 2010", "دكتوراه في الطب، جامعة عين شمس 2014"],
    workingHours: "السبت - الخميس: 4م - 9م",
  },
  {
    id: 2, name: "د. منى محمد إبراهيم", specialty: "أمراض النساء والتوليد",
    subspecialty: "تنظيم الأسرة والصحة الإنجابية", governorate: "القاهرة", city: "مدينة نصر",
    rating: 4.8, reviews: 187,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&auto=format",
    verified: true, experience: 12, priceRange: "300 - 500 جنيه",
    phone: "01112345678", whatsapp: "201112345678",
    clinic: "مركز شفاء للمرأة", address: "22 شارع محمد نجيب، مدينة نصر، القاهرة",
    available: true,
    bio: "أخصائية في تنظيم الأسرة وصحة المرأة الإنجابية مع خبرة واسعة في الموجات فوق الصوتية التشخيصية. تهتم الدكتورة منى بتقديم الاستشارة الطبية الشاملة لكل مريضة وتوعيتها بحقوقها الصحية.",
    education: ["بكالوريوس الطب والجراحة، جامعة عين شمس 2012", "دبلوم أمراض النساء والتوليد 2015"],
    workingHours: "الأحد - الأربعاء: 5م - 10م",
  },
  {
    id: 3, name: "د. نهاد علي يوسف", specialty: "أمراض النساء والتوليد",
    subspecialty: "جراحة المناظير النسائية", governorate: "الجيزة", city: "الدقي",
    rating: 4.7, reviews: 156,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&auto=format",
    verified: true, experience: 20, priceRange: "500 - 800 جنيه",
    phone: "01223456789", whatsapp: "201223456789",
    clinic: "مستشفى النيل التخصصي", address: "8 شارع التحرير، الدقي، الجيزة",
    available: false,
    bio: "استشارية جراحة المناظير النسائية والتوليد مع خبرة 20 عامًا وإجراء آلاف العمليات الناجحة. عضو في الجمعية الأوروبية لجراحة المناظير النسائية وحاصلة على عدة جوائز طبية دولية.",
    education: ["بكالوريوس الطب والجراحة، جامعة القاهرة 2004", "فيلوشيب جراحة المناظير، فرنسا 2010", "عضوية الجمعية الأوروبية لأمراض النساء"],
    workingHours: "الاثنين والأربعاء والخميس: 3م - 8م",
  },
  {
    id: 4, name: "د. سمر حسين رضا", specialty: "أمراض النساء والتوليد",
    subspecialty: "الحمل والولادة الطبيعية", governorate: "الإسكندرية", city: "سموحة",
    rating: 4.9, reviews: 312,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&auto=format",
    verified: true, experience: 15, priceRange: "350 - 550 جنيه",
    phone: "01334567890", whatsapp: "201334567890",
    clinic: "عيادة سمر للنساء والتوليد", address: "45 شارع فتح الله، سموحة، الإسكندرية",
    available: true,
    bio: "متخصصة في الحمل والولادة الطبيعية مع التركيز على صحة الأم والجنين. تتابع الدكتورة سمر حالات الحمل باهتمام بالغ وتحرص على التواصل الدائم مع مريضاتها وتوعيتهن.",
    education: ["بكالوريوس الطب والجراحة، جامعة الإسكندرية 2009", "ماجستير أمراض النساء والتوليد، جامعة الإسكندرية 2013"],
    workingHours: "السبت - الخميس: 6م - 10م",
  },
  {
    id: 5, name: "د. إيمان خالد محمود", specialty: "أمراض النساء والتوليد",
    subspecialty: "أمراض الجهاز التناسلي والعقم", governorate: "الجيزة", city: "أكتوبر",
    rating: 4.6, reviews: 98,
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&auto=format",
    verified: true, experience: 10, priceRange: "250 - 400 جنيه",
    phone: "01445678901", whatsapp: "201445678901",
    clinic: "عيادة إيمان النسائية", address: "الحي الثاني، مدينة أكتوبر، الجيزة",
    available: true,
    bio: "أخصائية في أمراض الجهاز التناسلي والعقم وعلاج اضطرابات الدورة الشهرية. حاصلة على تدريب متخصص في جامعة الملك فيصل ومتابعة لأحدث الأبحاث في مجال الصحة الإنجابية للمرأة.",
    education: ["بكالوريوس الطب والجراحة، جامعة أسيوط 2014", "ماجستير أمراض النساء والتوليد 2018"],
    workingHours: "الأحد والثلاثاء والخميس: 4م - 9م",
  },
  {
    id: 6, name: "د. هالة عبد الرحمن السيد", specialty: "أمراض النساء والتوليد",
    subspecialty: "صحة المرأة الشاملة والمنظار", governorate: "القاهرة", city: "الزمالك",
    rating: 4.8, reviews: 201,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&auto=format",
    verified: true, experience: 22, priceRange: "600 - 1000 جنيه",
    phone: "01556789012", whatsapp: "201556789012",
    clinic: "عيادة الزمالك التخصصية", address: "12 شارع الجزيرة، الزمالك، القاهرة",
    available: true,
    bio: "استشارية أمراض النساء والتوليد بخبرة 22 عامًا وعضوية في الجمعية الأوروبية والأمريكية لأمراض النساء. تقدم الدكتورة هالة خدمة متميزة بأعلى معايير الرعاية الصحية الدولية.",
    education: ["بكالوريوس الطب، جامعة القاهرة 2002", "دكتوراه أمراض النساء والتوليد 2008", "زمالة أوروبية في جراحة المناظير 2011"],
    workingHours: "السبت والاثنين والأربعاء: 5م - 9م",
  },
  {
    id: 7, name: "د. رانيا سعد طه", specialty: "أمراض النساء والتوليد",
    subspecialty: "الرعاية السابقة للولادة", governorate: "الشرقية", city: "الزقازيق",
    rating: 4.7, reviews: 143,
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&auto=format",
    verified: true, experience: 14, priceRange: "200 - 350 جنيه",
    phone: "01667890123", whatsapp: "201667890123",
    clinic: "عيادة رانيا للنساء والتوليد", address: "25 شارع الجمهورية، الزقازيق، الشرقية",
    available: true,
    bio: "متخصصة في الرعاية السابقة للولادة ومتابعة الحمل الطبيعي والمعقد. تهتم بتوعية المرأة الحامل بأهمية المتابعة الدورية والتغذية السليمة خلال فترة الحمل.",
    education: ["بكالوريوس الطب والجراحة، جامعة الزقازيق 2010", "ماجستير التوليد وأمراض النساء 2014"],
    workingHours: "يومياً (ما عدا الجمعة): 5م - 9م",
  },
  {
    id: 8, name: "د. نادية فتحي عمر", specialty: "أمراض النساء والتوليد",
    subspecialty: "علاج العقم والحقن المجهري", governorate: "الإسكندرية", city: "المنتزه",
    rating: 4.9, reviews: 278,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&auto=format",
    verified: true, experience: 16, priceRange: "500 - 900 جنيه",
    phone: "01778901234", whatsapp: "201778901234",
    clinic: "مركز نادية للخصوبة", address: "8 شارع أبو قير، المنتزه، الإسكندرية",
    available: false,
    bio: "متخصصة في علاج العقم والحقن المجهري مع معدل نجاح مرتفع. أجرت الدكتورة نادية آلاف حالات الحقن المجهري بنجاح وتقدم استشارات متخصصة لحالات العقم بأحدث التقنيات الطبية.",
    education: ["بكالوريوس الطب، جامعة الإسكندرية 2008", "ماجستير علاج العقم 2012", "فيلوشيب من بلجيكا في تقنيات المساعدة على الإنجاب 2015"],
    workingHours: "السبت والثلاثاء والخميس: 3م - 8م",
  },
];

const GOVERNORATES = [
  "الكل", "القاهرة", "الجيزة", "الإسكندرية", "الشرقية", "الدقهلية",
  "البحيرة", "المنوفية", "الغربية", "كفر الشيخ", "دمياط", "بورسعيد",
  "الإسماعيلية", "السويس", "الفيوم", "بني سويف", "المنيا",
  "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
];

const CITIES_MAP: Record<string, string[]> = {
  "القاهرة": ["الكل", "المعادي", "مدينة نصر", "الزمالك", "هليوبوليس", "المطرية", "شبرا", "حدائق القبة", "عين شمس", "الرحاب", "التجمع الخامس"],
  "الجيزة": ["الكل", "الدقي", "المهندسين", "العجوزة", "أكتوبر", "الشيخ زايد", "إمبابة", "فيصل"],
  "الإسكندرية": ["الكل", "سموحة", "المنتزه", "الرمل", "العجمي", "الجمرك", "المنشية", "سيدي بشر"],
  "الشرقية": ["الكل", "الزقازيق", "العاشر من رمضان", "بلبيس", "الإبراهيمية"],
};

const PENDING_REQUESTS = [
  { id: 1, name: "د. سارة محمد علي", specialty: "أمراض النساء", governorate: "القاهرة", city: "حلوان", phone: "01001111111", date: "15 يناير 2025", status: "pending" },
  { id: 2, name: "د. أسماء حسن عبد الله", specialty: "التوليد", governorate: "الجيزة", city: "أكتوبر", phone: "01002222222", date: "14 يناير 2025", status: "pending" },
  { id: 3, name: "د. لبنى أحمد رضوان", specialty: "أمراض النساء والتوليد", governorate: "الإسكندرية", city: "المنتزه", phone: "01003333333", date: "13 يناير 2025", status: "approved" },
  { id: 4, name: "د. دينا مصطفى كمال", specialty: "أمراض النساء", governorate: "الشرقية", city: "الزقازيق", phone: "01004444444", date: "12 يناير 2025", status: "rejected" },
];

const CHART_DATA = [
  { month: "يوليو", doctors: 3 }, { month: "أغسطس", doctors: 5 }, { month: "سبتمبر", doctors: 4 },
  { month: "أكتوبر", doctors: 8 }, { month: "نوفمبر", doctors: 6 }, { month: "ديسمبر", doctors: 9 },
  { month: "يناير", doctors: 12 },
];

// ─── Utility Components ────────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5"} ${
            i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
      available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${available ? "bg-emerald-500" : "bg-red-400"}`} />
      {available ? "متاحة الآن" : "محجوزة"}
    </span>
  );
}

function DoctorCard({ doctor, onView }: { doctor: Doctor; onView: () => void }) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-5">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-20 h-20 rounded-xl object-cover bg-muted"
            />
            <div className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white ${
              doctor.available ? "bg-emerald-500" : "bg-gray-400"
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-foreground text-base leading-tight">{doctor.name}</h3>
                {doctor.verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
              </div>
              <AvailabilityBadge available={doctor.available} />
            </div>
            <p className="text-primary text-sm font-semibold mb-2">{doctor.subspecialty}</p>
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={doctor.rating} />
              <span className="text-sm font-bold text-amber-600">{doctor.rating}</span>
              <span className="text-xs text-muted-foreground">({doctor.reviews} تقييم)</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {doctor.city}، {doctor.governorate}
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {doctor.experience} سنة خبرة
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 pt-4 border-t border-border">
          <div>
            <p className="text-[11px] text-muted-foreground mb-0.5">رسوم الكشف</p>
            <p className="text-sm font-bold text-foreground">{doctor.priceRange}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${doctor.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              اتصال
            </a>
            <a
              href={`https://wa.me/${doctor.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              واتساب
            </a>
            <button
              onClick={onView}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              الملف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navigation ────────────────────────────────────────────────────────────

function Navigation({ page, navigate, menuOpen, setMenuOpen }: {
  page: Page;
  navigate: (p: Page) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  const navLinks = [
    { label: "الرئيسية", page: "home" as Page },
    { label: "دليل الأطباء", page: "directory" as Page },
    { label: "سجّلي عيادتك", page: "register" as Page },
    { label: "تواصل معنا", page: "contact" as Page },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => navigate("home")} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-foreground leading-tight">طبيبات مصر</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Female Doctors Egypt</p>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => navigate(link.page)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                page === link.page
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("admin")}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            لوحة الإدارة
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => navigate(link.page)}
              className={`w-full text-right px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                page === link.page ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => navigate("admin")}
            className="w-full text-right px-4 py-3 rounded-xl text-sm font-semibold text-primary bg-secondary"
          >
            لوحة الإدارة
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────

function HomePage({ navigate }: { navigate: (p: Page, d?: Doctor) => void }) {
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearch = () => {
    navigate("directory");
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b6e72 0%, #0d7a7f 40%, #0f8c8c 70%, #1a9e9e 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-black/10" />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 rounded-full bg-white/40" />
          <div className="absolute top-1/4 left-2/3 w-3 h-3 rounded-full bg-white/30" />
          <div className="absolute top-3/4 left-1/4 w-2 h-2 rounded-full bg-white/30" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              أكثر من 500 طبيبة موثّقة في مصر
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              ابحثي عن طبيبتك
              <span className="block text-white/80">بكل ثقة وأمان</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              دليلك الشامل لأفضل طبيبات أمراض النساء والتوليد في مصر. جميع الطبيبات موثّقات ومعتمدات لضمان أعلى معايير الرعاية الصحية.
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-2xl shadow-xl p-2 flex gap-2 mb-8">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="ابحثي عن طبيبة، تخصص، أو مدينة..."
                  className="flex-1 bg-transparent outline-none text-foreground text-sm placeholder:text-muted-foreground"
                  onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
                />
              </div>
              <button
                onClick={handleHeroSearch}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                بحث
              </button>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2">
              {["القاهرة", "الجيزة", "الإسكندرية", "الشرقية"].map((gov) => (
                <button
                  key={gov}
                  onClick={() => navigate("directory")}
                  className="bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  {gov}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "+500", label: "طبيبة موثّقة", icon: Stethoscope },
              { value: "+20", label: "محافظة مغطّاة", icon: MapPin },
              { value: "+15,000", label: "مريضة استفادت", icon: Users },
              { value: "100%", label: "طبيبات موثّقات", icon: Shield },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured doctors */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-foreground mb-1">طبيبات مميّزات</h2>
            <p className="text-muted-foreground text-sm">الأعلى تقييمًا في الدليل</p>
          </div>
          <button
            onClick={() => navigate("directory")}
            className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
          >
            عرض الكل
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOCTORS.slice(0, 4).map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onView={() => navigate("profile", doctor)} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-border py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-foreground mb-2">كيف يعمل الدليل؟</h2>
            <p className="text-muted-foreground">ابحثي عن طبيبتك في 3 خطوات بسيطة</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: Search, title: "ابحثي عن طبيبة", desc: "استخدمي الفلاتر للبحث بالمحافظة والمدينة والتخصص للعثور على طبيبتك المناسبة." },
              { step: "02", icon: Eye, title: "اطّلعي على الملف", desc: "اقرأي ملف الطبيبة الكامل من خبرات وتعليم وتقييمات المريضات وأوقات العمل." },
              { step: "03", icon: Phone, title: "تواصلي مباشرة", desc: "تواصلي مع الطبيبة عبر الهاتف أو واتساب مباشرةً لحجز موعدك." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-flex mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why trust us */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-black text-foreground mb-4">لماذا تثقين بطبيبات مصر؟</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              نحن نؤمن بحق كل امرأة في الحصول على رعاية طبية موثوقة من قِبَل طبيبات متخصصات ومعتمدات. لذلك نتحقق من بيانات كل طبيبة قبل نشرها.
            </p>
            <div className="space-y-4">
              {[
                { icon: BadgeCheck, title: "توثيق مكتمل", desc: "نتحقق من مؤهلات كل طبيبة قبل إضافتها للدليل" },
                { icon: Star, title: "تقييمات حقيقية", desc: "آراء مريضات حقيقيات لضمان الشفافية والمصداقية" },
                { icon: Shield, title: "بيانات محمية", desc: "بياناتك الشخصية وبيانات الطبيبات محمية بالكامل" },
                { icon: Clock, title: "دائماً محدّث", desc: "نحدّث معلومات الطبيبات باستمرار لضمان الدقة" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm mb-0.5">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=500&fit=crop&auto=format"
              alt="رعاية طبية للمرأة"
              className="rounded-3xl object-cover w-full h-80 lg:h-96 bg-muted"
            />
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">موثّقة ومعتمدة</p>
                <p className="text-xs text-muted-foreground">جميع الطبيبات</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b6e72 0%, #0d7a7f 50%, #c43d5e 150%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-60 h-60 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/10" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
            هل أنتِ طبيبة متخصصة في أمراض النساء؟
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            سجّلي عيادتك في الدليل وتواصلي مع آلاف المريضات الباحثات عن رعاية موثوقة
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("register")}
              className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              سجّلي الآن مجانًا
            </button>
            <button
              onClick={() => navigate("contact")}
              className="bg-white/15 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/25 transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              تواصلي معنا
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Directory Page ────────────────────────────────────────────────────────

function DirectoryPage({
  navigate, filteredDoctors, searchQuery, setSearchQuery,
  selectedGov, setSelectedGov, selectedCity, setSelectedCity,
}: {
  navigate: (p: Page, d?: Doctor) => void;
  filteredDoctors: Doctor[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedGov: string;
  setSelectedGov: (v: string) => void;
  selectedCity: string;
  setSelectedCity: (v: string) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const cities = selectedGov !== "الكل" ? (CITIES_MAP[selectedGov] || ["الكل"]) : ["الكل"];

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGov("الكل");
    setSelectedCity("الكل");
  };

  const FilterPanel = () => (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">الفلاتر</h3>
        <button onClick={resetFilters} className="text-xs text-primary font-semibold hover:underline">
          إعادة ضبط
        </button>
      </div>

      <div>
        <label className="text-sm font-semibold text-foreground block mb-3">المحافظة</label>
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
          {GOVERNORATES.map((gov) => (
            <button
              key={gov}
              onClick={() => { setSelectedGov(gov); setSelectedCity("الكل"); }}
              className={`text-right px-3 py-2 rounded-xl text-sm transition-colors font-medium ${
                selectedGov === gov ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              {gov}
            </button>
          ))}
        </div>
      </div>

      {selectedGov !== "الكل" && cities.length > 1 && (
        <div>
          <label className="text-sm font-semibold text-foreground block mb-3">المدينة</label>
          <div className="flex flex-col gap-1.5">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`text-right px-3 py-2 rounded-xl text-sm transition-colors font-medium ${
                  selectedCity === city ? "bg-primary text-white" : "hover:bg-muted text-foreground"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground mb-1">دليل الطبيبات</h1>
        <p className="text-muted-foreground text-sm">
          {filteredDoctors.length} طبيبة متاحة
          {selectedGov !== "الكل" && ` في ${selectedGov}`}
          {selectedCity !== "الكل" && ` - ${selectedCity}`}
        </p>
      </div>

      {/* Search bar */}
      <div className="bg-card rounded-2xl border border-border p-2 flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-3 px-3">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحثي عن اسم الطبيبة أو التخصص أو المدينة..."
            className="flex-1 bg-transparent outline-none text-foreground text-sm placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            showFilters ? "bg-primary text-white" : "bg-secondary text-primary"
          }`}
        >
          <Filter className="w-4 h-4" />
          الفلاتر
        </button>
      </div>

      {/* Active filters */}
      {(selectedGov !== "الكل" || selectedCity !== "الكل") && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedGov !== "الكل" && (
            <span className="flex items-center gap-1.5 bg-secondary text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
              {selectedGov}
              <button onClick={() => { setSelectedGov("الكل"); setSelectedCity("الكل"); }}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCity !== "الكل" && (
            <span className="flex items-center gap-1.5 bg-secondary text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
              {selectedCity}
              <button onClick={() => setSelectedCity("الكل")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Mobile filter panel */}
      {showFilters && (
        <div className="md:hidden mb-4">
          <FilterPanel />
        </div>
      )}

      {/* Layout */}
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <FilterPanel />
          </div>
        </div>

        {/* Doctor grid */}
        <div className="flex-1">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">لا توجد نتائج</h3>
              <p className="text-muted-foreground text-sm mb-4">لم نجد طبيبات بهذه المعايير. جربي فلاتر مختلفة.</p>
              <button onClick={resetFilters} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                عرض الكل
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} onView={() => navigate("profile", doctor)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Doctor Profile Page ───────────────────────────────────────────────────

function ProfilePage({ doctor, navigate }: { doctor: Doctor; navigate: (p: Page) => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("directory")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold mb-6 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للدليل
      </button>

      {/* Profile header */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden mb-6">
        <div
          className="h-28"
          style={{ background: "linear-gradient(135deg, #0b6e72 0%, #0d7a7f 60%, #1a9e9e 100%)" }}
        />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
            <div className="relative flex-shrink-0">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-muted"
              />
              {doctor.verified && (
                <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-primary border-2 border-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-foreground">{doctor.name}</h1>
                <AvailabilityBadge available={doctor.available} />
              </div>
              <p className="text-primary font-semibold text-sm mb-2">{doctor.subspecialty}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <StarRating rating={doctor.rating} />
                  <strong className="text-amber-600 mr-1">{doctor.rating}</strong>
                  ({doctor.reviews} تقييم)
                </span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {doctor.city}، {doctor.governorate}</span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {doctor.experience} سنة خبرة</span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${doctor.phone}`}
              className="flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              <Phone className="w-5 h-5" />
              اتصال مباشر: {doctor.phone}
            </a>
            <a
              href={`https://wa.me/${doctor.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              واتساب
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Bio */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              نبذة عن الطبيبة
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{doctor.bio}</p>
          </div>

          {/* Education */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              المؤهلات والشهادات
            </h2>
            <div className="space-y-2">
              {doctor.education.map((edu, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-foreground">{edu}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Clinic info */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-bold text-foreground mb-4 text-sm">معلومات العيادة</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">اسم العيادة</p>
                  <p className="text-sm font-semibold text-foreground">{doctor.clinic}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">العنوان</p>
                  <p className="text-sm font-semibold text-foreground">{doctor.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">أوقات العمل</p>
                  <p className="text-sm font-semibold text-foreground">{doctor.workingHours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">رسوم الكشف</p>
                  <p className="text-sm font-bold text-foreground">{doctor.priceRange}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="bg-muted h-40 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-medium">{doctor.city}، {doctor.governorate}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground text-center">{doctor.address}</p>
            </div>
          </div>

          {/* Verified badge */}
          {doctor.verified && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
              <BadgeCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-800">طبيبة موثّقة</p>
                <p className="text-xs text-emerald-600">تم التحقق من بياناتها ومؤهلاتها</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Registration Page ─────────────────────────────────────────────────────

function RegisterPage() {
  const [form, setForm] = useState({
    name: "", specialty: "", phone: "", whatsapp: "", email: "",
    governorate: "", city: "", clinic: "", address: "", bio: "", experience: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "الاسم مطلوب";
    if (!form.phone) e.phone = "رقم الهاتف مطلوب";
    if (!form.governorate) e.governorate = "المحافظة مطلوبة";
    if (!form.clinic) e.clinic = "اسم العيادة مطلوب";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-3">تم استلام طلبك!</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          شكرًا لتسجيلك في دليل طبيبات مصر. سيقوم فريقنا بمراجعة بياناتك والتواصل معك خلال 24-48 ساعة للتحقق وإتمام التسجيل.
        </p>
        <div className="bg-secondary rounded-2xl p-4 text-sm text-primary font-semibold">
          رقم الطلب: #REG-{Math.floor(Math.random() * 9000 + 1000)}
        </div>
      </div>
    );
  }

  const Field = ({ label, name, type = "text", placeholder, required = false, as = "input" }: {
    label: string; name: string; type?: string; placeholder?: string; required?: boolean; as?: "input" | "textarea" | "select";
  }) => (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          name={name}
          value={(form as Record<string, string>)[name]}
          onChange={handleChange}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition resize-none"
        />
      ) : as === "select" ? (
        <select
          name={name}
          value={(form as Record<string, string>)[name]}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition appearance-none"
        >
          <option value="">اختاري المحافظة</option>
          {GOVERNORATES.filter(g => g !== "الكل").map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={(form as Record<string, string>)[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
        />
      )}
      {errors[name] && <p className="text-accent text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UserPlus className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-black text-foreground mb-2">سجّلي عيادتك</h1>
        <p className="text-muted-foreground text-sm">انضمي لدليل طبيبات مصر وتواصلي مع آلاف المريضات</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal info */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
            بياناتك الشخصية
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="الاسم الكامل" name="name" placeholder="د. ..." required />
            <Field label="التخصص" name="specialty" placeholder="أمراض النساء والتوليد" />
            <Field label="رقم الهاتف" name="phone" type="tel" placeholder="01X XXXXXXXX" required />
            <Field label="رقم واتساب" name="whatsapp" type="tel" placeholder="01X XXXXXXXX" />
            <div className="sm:col-span-2">
              <Field label="البريد الإلكتروني" name="email" type="email" placeholder="doctor@example.com" />
            </div>
            <Field label="سنوات الخبرة" name="experience" type="number" placeholder="مثال: 10" />
          </div>
        </div>

        {/* Clinic info */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">2</span>
            بيانات العيادة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="اسم العيادة / المستشفى" name="clinic" placeholder="عيادة ..." required />
            <Field label="المحافظة" name="governorate" required as="select" />
            <Field label="المدينة / الحي" name="city" placeholder="اكتبي اسم المدينة" />
            <div className="sm:col-span-2">
              <Field label="العنوان التفصيلي" name="address" placeholder="الشارع، الحي، المدينة" />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">3</span>
            نبذة تعريفية
          </h2>
          <Field
            label="نبذة مختصرة عن تجربتك وتخصصك"
            name="bio"
            placeholder="اكتبي نبذة مختصرة تصف خبرتك وتخصصاتك لتظهر في ملفك الشخصي..."
            as="textarea"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          إرسال طلب التسجيل
        </button>

        <p className="text-center text-xs text-muted-foreground">
          سيتم مراجعة طلبك والتواصل معك خلال 24-48 ساعة
        </p>
      </form>
    </div>
  );
}

// ─── Contact Page ──────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-3">تم إرسال رسالتك!</h2>
        <p className="text-muted-foreground">سيتواصل معك فريقنا في أقرب وقت ممكن. شكرًا لتواصلك معنا.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-black text-foreground mb-2">تواصلي معنا</h1>
        <p className="text-muted-foreground">نحن هنا للإجابة على استفساراتك ومساعدتك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: Mail, title: "البريد الإلكتروني", value: "info@femaledoctorsegypt.com" },
            { icon: Phone, title: "هاتف الدعم", value: "01000000000" },
            { icon: MessageCircle, title: "واتساب", value: "01000000000" },
            { icon: Clock, title: "ساعات العمل", value: "السبت - الخميس: 9ص - 5م" },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.title}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
          <div className="bg-primary rounded-2xl p-5 text-white">
            <h3 className="font-bold mb-2">هل أنتِ طبيبة؟</h3>
            <p className="text-white/80 text-sm mb-3">سجّلي عيادتك في الدليل واستقطبي مريضات جدد</p>
            <div className="text-sm font-bold underline">سجّلي مجانًا ←</div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-foreground mb-5">أرسلي رسالتك</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">الاسم</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="اسمك الكامل"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="01X XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">رسالتك</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="اكتبي رسالتك هنا..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────

function AdminPage() {
  const [tab, setTab] = useState<"overview" | "requests" | "doctors">("overview");
  const [requests, setRequests] = useState(PENDING_REQUESTS);

  const handleApprove = (id: number) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r));
  };
  const handleReject = (id: number) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r));
  };

  const stats = [
    { label: "إجمالي الطبيبات", value: DOCTORS.length, icon: Users, color: "bg-secondary text-primary", trend: "+2 هذا الشهر" },
    { label: "طلبات معلّقة", value: requests.filter(r => r.status === "pending").length, icon: AlertCircle, color: "bg-amber-50 text-amber-600", trend: "تحتاج مراجعة" },
    { label: "طبيبات متاحات", value: DOCTORS.filter(d => d.available).length, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600", trend: "متاح الآن" },
    { label: "زيارات هذا الشهر", value: "1,847", icon: TrendingUp, color: "bg-purple-50 text-purple-600", trend: "+23% عن الشهر الماضي" },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700",
      approved: "bg-emerald-50 text-emerald-700",
      rejected: "bg-red-50 text-red-600",
    };
    const labels = { pending: "معلّق", approved: "مقبول", rejected: "مرفوض" };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground mb-1">لوحة الإدارة</h1>
        <p className="text-muted-foreground text-sm">إدارة الطبيبات والطلبات وإحصائيات الموقع</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl mb-8 w-fit">
        {[
          { key: "overview", label: "نظرة عامة", icon: BarChart3 },
          { key: "requests", label: "الطلبات", icon: UserPlus },
          { key: "doctors", label: "الطبيبات", icon: Users },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-6">تسجيلات الطبيبات - آخر 7 أشهر</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CHART_DATA} barSize={32}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b6b82" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b6b82" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(v) => [`${v} طبيبة`, "التسجيلات"]}
                />
                <Bar dataKey="doctors" fill="#0d7a7f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent requests */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-4">أحدث الطلبات</h3>
            <div className="space-y-3">
              {requests.slice(0, 3).map((req) => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{req.name}</p>
                    <p className="text-xs text-muted-foreground">{req.specialty} • {req.city}، {req.governorate}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Requests tab */}
      {tab === "requests" && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">طلبات التسجيل ({requests.length})</h2>
            <span className="text-sm text-muted-foreground">{requests.filter(r => r.status === "pending").length} معلّق</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["الاسم", "التخصص", "المنطقة", "الهاتف", "التاريخ", "الحالة", "إجراء"].map((h) => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-bold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">{req.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{req.specialty}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{req.city}، {req.governorate}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap" dir="ltr">{req.phone}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{req.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                    <td className="px-4 py-3">
                      {req.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Doctors tab */}
      {tab === "doctors" && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">الطبيبات المسجّلات ({DOCTORS.length})</h2>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              <UserPlus className="w-4 h-4" />
              إضافة طبيبة
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["الطبيبة", "التخصص الفرعي", "المنطقة", "التقييم", "الخبرة", "الحالة"].map((h) => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-bold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DOCTORS.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={doctor.image} alt={doctor.name} className="w-9 h-9 rounded-xl object-cover bg-muted flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-foreground whitespace-nowrap">{doctor.name}</p>
                          {doctor.verified && <p className="text-[10px] text-primary font-semibold">موثّقة</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{doctor.subspecialty}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{doctor.city}، {doctor.governorate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold">{doctor.rating}</span>
                        <span className="text-xs text-muted-foreground">({doctor.reviews})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{doctor.experience} سنة</td>
                    <td className="px-4 py-3"><AvailabilityBadge available={doctor.available} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer className="bg-white border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">طبيبات مصر</p>
                <p className="text-[10px] text-muted-foreground">Female Doctors Egypt</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              دليلك الموثوق للعثور على أفضل طبيبات أمراض النساء والتوليد في مصر.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-foreground text-sm mb-4">الموقع</h4>
            <div className="space-y-2">
              {[["الرئيسية", "home" as Page], ["دليل الطبيبات", "directory" as Page], ["سجّلي عيادتك", "register" as Page], ["تواصل معنا", "contact" as Page]].map(([label, page]) => (
                <button key={page} onClick={() => navigate(page as Page)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="font-bold text-foreground text-sm mb-4">التخصصات</h4>
            <div className="space-y-2">
              {["الحمل والتوليد", "علاج العقم", "الحقن المجهري", "جراحة المناظير", "تنظيم الأسرة", "الصحة الإنجابية"].map((s) => (
                <p key={s} className="text-sm text-muted-foreground">{s}</p>
              ))}
            </div>
          </div>

          {/* Governorates */}
          <div>
            <h4 className="font-bold text-foreground text-sm mb-4">أبرز المحافظات</h4>
            <div className="space-y-2">
              {["القاهرة", "الجيزة", "الإسكندرية", "الشرقية", "الدقهلية", "المنوفية"].map((g) => (
                <button key={g} onClick={() => navigate("directory")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2025 طبيبات مصر. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-foreground transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGov, setSelectedGov] = useState("الكل");
  const [selectedCity, setSelectedCity] = useState("الكل");

  const navigate = (p: Page, doctor?: Doctor) => {
    setPage(p);
    if (doctor) setSelectedDoctor(doctor);
    setMenuOpen(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        d.name.includes(searchQuery) ||
        d.city.includes(searchQuery) ||
        d.subspecialty.includes(searchQuery) ||
        d.clinic.includes(searchQuery) ||
        d.governorate.includes(searchQuery);
      const matchGov = selectedGov === "الكل" || d.governorate === selectedGov;
      const matchCity = selectedCity === "الكل" || d.city === selectedCity;
      return matchSearch && matchGov && matchCity;
    });
  }, [searchQuery, selectedGov, selectedCity]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Cairo', 'Tajawal', system-ui, sans-serif" }}
    >
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
        * { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.15) transparent; }
      `}</style>

      <Navigation page={page} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main>
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "directory" && (
          <DirectoryPage
            navigate={navigate}
            filteredDoctors={filteredDoctors}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedGov={selectedGov}
            setSelectedGov={setSelectedGov}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        )}
        {page === "profile" && selectedDoctor && (
          <ProfilePage doctor={selectedDoctor} navigate={navigate} />
        )}
        {page === "register" && <RegisterPage />}
        {page === "contact" && <ContactPage />}
        {page === "admin" && <AdminPage />}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}
