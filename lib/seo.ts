// ─── Shared SEO constants ──────────────────────────────────────────────────
export const SITE_URL = "https://female-doctors.vercel.app";
export const SITE_NAME = "دليل طبيبات مصر";
export const SITE_DESCRIPTION =
  "دليل موثوق لطبيبات مصر في جميع التخصصات الطبية والمحافظات. ابحثي عن طبيبة نساء، جراحة، باطنة، وغيرها.";

export const OG_IMAGE = {
  url: "/veiled_doctors.png",
  width: 1200,
  height: 630,
  alt: "دليل طبيبات مصر",
};

// Arabic local-SEO keyword pools ─────────────────────────────────────────────
export const BASE_KEYWORDS = [
  "دليل طبيبات مصر",
  "طبيبة نساء وتوليد",
  "دكتورة نساء",
  "طبيبة موثوقة مصر",
  "متابعة حمل",
  "أفضل طبيبة في مصر",
  "female doctors egypt",
  "women doctors egypt",
  "طبيبات مصر",
  "عيادة طبيبة",
];

export const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  "النساء والتوليد": [
    "طبيبة نساء وتوليد",
    "دكتورة نساء",
    "متابعة حمل",
    "طبيبة ولادة",
    "دكتورة نساء وتوليد",
  ],
  "الجراحة العامة": ["طبيبة جراحة عامة", "جراحة نساء"],
  "باطنة عامة": ["طبيبة باطنة", "دكتورة باطنة"],
  "الجلدية": ["طبيبة جلدية", "دكتورة جلدية", "علاج جلد"],
  "الطب النفسي": ["طبيبة نفسية", "دكتورة نفسية"],
  "القلب والأوعية الدموية": ["طبيبة قلب", "دكتورة قلب"],
  "المخ والأعصاب": ["طبيبة مخ وأعصاب", "دكتورة أعصاب"],
  "طب الأورام": ["طبيبة أورام", "دكتورة أورام"],
  "السكر والغدد الصماء": ["طبيبة سكر", "دكتورة غدد"],
  "التغذية والسمنة والنحافة": ["طبيبة تغذية", "دكتورة تخسيس"],
  "الجهاز الهضمي والمناظير": ["طبيبة هضمية", "دكتورة مناظير"],
  "الرمد": ["طبيبة عيون", "دكتورة رمد"],
  "طب الأطفال وحديثي الولادة": ["طبيبة أطفال", "دكتورة أطفال", "حديثي الولادة", "طبيب أطفال أخصائي"],
  "طب وجراحة الفم والأسنان": ["طبيبة أسنان", "دكتورة أسنان", "تجميل أسنان", "علاج جذور"],
  "جراحة العظام": ["طبيبة عظام", "دكتورة عظام", "جراحة العظام والكسور"],
  "الأنف والأذن والحنجرة": ["طبيبة أنف وأذن", "دكتورة أنف وأذن وحنجرة"],
  "العلاج الطبيعي والتأهيل": ["طبيبة علاج طبيعي", "دكتورة علاج طبيعي"],
  "أمراض وجراحة المسالك البولية": ["طبيبة مسالك بولية", "دكتورة مسالك بولية"],
  "الأمراض الصدرية والجهاز التنفسي": ["طبيبة صدر", "دكتورة أمراض صدرية"],
  "أمراض الدم": ["طبيبة أمراض دم", "دكتورة أمراض الدم"],
  "جراحة المخ والأعصاب": ["طبيبة جراحة مخ وأعصاب", "دكتورة جراحة أعصاب"],
  "جراحة التجميل": ["طبيبة تجميل", "دكتورة جراحة تجميل"],
  "أمراض الكلى": ["طبيبة كلى", "دكتورة أمراض كلى"],
  "الروماتيزم والتأهيل": ["طبيبة روماتيزم", "دكتورة روماتيزم ومفاصل"],
  "الأشعة والتشخيص": ["طبيبة أشعة", "دكتورة أشعة وتشخيص"],
  "التحاليل الطبية": ["طبيبة تحاليل", "دكتورة تحاليل طبية"],
  "طب الأسرة": ["طبيبة أسرة", "دكتورة طب أسرة"],
};

// Helpers ────────────────────────────────────────────────────────────────────

/** Build the canonical URL for a given path */
export function canonical(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build doctor metadata title */
export function doctorTitle(name: string, specialty: string, governorate: string): string {
  const cleanName = name.startsWith("د.") ? name : `د. ${name}`;
  return `${cleanName} | طبيبة ${specialty} في ${governorate}`;
}

/** Build doctor metadata description */
export function doctorDescription(
  name: string,
  specialty: string,
  governorate: string,
  city?: string | null,
  address?: string,
): string {
  const cleanName = name.startsWith("د.") ? name : `د. ${name}`;
  const location = city ? `${governorate} - ${city}` : governorate;
  return (
    `تعرفي على ${cleanName}، طبيبة ${specialty} في ${location}. ` +
    `احصلي على معلومات التواصل وعنوان العيادة${address ? ` (${address})` : ""}. ` +
    `دليل طبيبات مصر — أكبر دليل لطبيبات مصر الموثوقات.`
  );
}

/** Return specialty + location keyword list */
export function buildKeywords(specialty: string, governorateName: string): string[] {
  const specKw = SPECIALTY_KEYWORDS[specialty] ?? [];
  return [
    ...BASE_KEYWORDS,
    ...specKw,
    `طبيبة ${specialty} في ${governorateName}`,
    `دكتورة ${specialty} ${governorateName}`,
    `طبيبة في ${governorateName}`,
  ];
}
