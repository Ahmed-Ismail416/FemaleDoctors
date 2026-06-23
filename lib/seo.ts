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
};

// Helpers ────────────────────────────────────────────────────────────────────

/** Build the canonical URL for a given path */
export function canonical(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build doctor metadata title */
export function doctorTitle(name: string, specialty: string, governorate: string): string {
  return `${name} | طبيبة ${specialty} في ${governorate}`;
}

/** Build doctor metadata description */
export function doctorDescription(
  name: string,
  specialty: string,
  governorate: string,
  city?: string | null,
  address?: string,
): string {
  const location = city ? `${governorate} - ${city}` : governorate;
  return (
    `تعرفي على ${name}، طبيبة ${specialty} في ${location}. ` +
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
