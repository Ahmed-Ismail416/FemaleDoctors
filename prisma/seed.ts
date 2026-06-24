import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });


const GOVERNORATES = [
  { id: 1, name_ar: "القاهرة", name_en: "Cairo", slug: "cairo" },
  { id: 2, name_ar: "الجيزة", name_en: "Giza", slug: "giza" },
  { id: 3, name_ar: "الإسكندرية", name_en: "Alexandria", slug: "alexandria" },
  { id: 4, name_ar: "القليوبية", name_en: "Qalyubia", slug: "qalyubia" },
  { id: 5, name_ar: "الدقهلية", name_en: "Dakahlia", slug: "dakahlia" },
  { id: 6, name_ar: "الغربية", name_en: "Gharbia", slug: "gharbia" },
  { id: 7, name_ar: "المنوفية", name_en: "Monufia", slug: "monufia" },
  { id: 8, name_ar: "الشرقية", name_en: "Sharqia", slug: "sharqia" },
  { id: 9, name_ar: "البحيرة", name_en: "Beheira", slug: "beheira" },
  { id: 10, name_ar: "دمياط", name_en: "Damietta", slug: "damietta" },
  { id: 11, name_ar: "بورسعيد", name_en: "Port Said", slug: "port-said" },
  { id: 12, name_ar: "الإسماعيلية", name_en: "Ismailia", slug: "ismailia" },
  { id: 13, name_ar: "السويس", name_en: "Suez", slug: "suez" },
  { id: 14, name_ar: "كفر الشيخ", name_en: "Kafr El-Sheikh", slug: "kafr-el-sheikh" },
  { id: 15, name_ar: "بني سويف", name_en: "Beni Suef", slug: "beni-suef" },
  { id: 16, name_ar: "المنيا", name_en: "Minya", slug: "minya" },
  { id: 17, name_ar: "الفيوم", name_en: "Faiyum", slug: "faiyum" },
  { id: 18, name_ar: "أسيوط", name_en: "Asyut", slug: "asyut" },
  { id: 19, name_ar: "سوهاج", name_en: "Sohag", slug: "sohag" },
  { id: 20, name_ar: "قنا", name_en: "Qena", slug: "qena" },
  { id: 21, name_ar: "الأقصر", name_en: "Luxor", slug: "luxor" },
  { id: 22, name_ar: "أسوان", name_en: "Aswan", slug: "aswan" },
  { id: 23, name_ar: "البحر الأحمر", name_en: "Red Sea", slug: "red-sea" },
  { id: 24, name_ar: "الوادي الجديد", name_en: "New Valley", slug: "new-valley" },
  { id: 25, name_ar: "مطروح", name_en: "Matrouh", slug: "matrouh" },
  { id: 26, name_ar: "شمال سيناء", name_en: "North Sinai", slug: "north-sinai" },
  { id: 27, name_ar: "جنوب سيناء", name_en: "South Sinai", slug: "south-sinai" },
];

const CITIES = [
  // Cairo (id: 1)
  { id: 9, governorate_id: 1, name_ar: "وسط البلد", name_en: "Downtown", slug: "downtown" },
  { id: 10, governorate_id: 1, name_ar: "مصر الجديدة", name_en: "Heliopolis", slug: "heliopolis" },
  { id: 11, governorate_id: 1, name_ar: "مدينة نصر", name_en: "Nasr City", slug: "nasr-city" },
  { id: 12, governorate_id: 1, name_ar: "المعادي", name_en: "Maadi", slug: "maadi" },
  { id: 13, governorate_id: 1, name_ar: "التجمع الخامس", name_en: "Fifth Settlement", slug: "fifth-settlement" },
  { id: 14, governorate_id: 1, name_ar: "الشروق", name_en: "Al-Shorouk", slug: "al-shorouk" },
  { id: 15, governorate_id: 1, name_ar: "حلوان", name_en: "Helwan", slug: "helwan" },
  { id: 16, governorate_id: 1, name_ar: "شبرا", name_en: "Shubra", slug: "shubra" },
  { id: 17, governorate_id: 1, name_ar: "الزمالك", name_en: "Zamalek", slug: "zamalek" },
  { id: 18, governorate_id: 1, name_ar: "الرحاب", name_en: "Al-Rehab", slug: "al-rehab" },
  { id: 19, governorate_id: 1, name_ar: "مدينتي", name_en: "Madinaty", slug: "madinaty" },
  { id: 20, governorate_id: 1, name_ar: "بدر", name_en: "Badr", slug: "badr" },

  // Giza (id: 2)
  { id: 21, governorate_id: 2, name_ar: "المهندسين", name_en: "Mohandessin", slug: "mohandessin" },
  { id: 22, governorate_id: 2, name_ar: "الدقي", name_en: "Dokki", slug: "dokki" },
  { id: 23, governorate_id: 2, name_ar: "الهرم", name_en: "Haram", slug: "haram" },
  { id: 24, governorate_id: 2, name_ar: "فيصل", name_en: "Faisal", slug: "faisal" },
  { id: 25, governorate_id: 2, name_ar: "6 أكتوبر", name_en: "6th of October", slug: "6th-of-october" },
  { id: 26, governorate_id: 2, name_ar: "الشيخ زايد", name_en: "Sheikh Zayed", slug: "sheikh-zayed" },
  { id: 27, governorate_id: 2, name_ar: "العمرانية", name_en: "Omraneya", slug: "omraneya" },
  { id: 28, governorate_id: 2, name_ar: "إمبابة", name_en: "Imbaba", slug: "imbaba" },
  { id: 29, governorate_id: 2, name_ar: "البدرشين", name_en: "Al-Badrashein", slug: "al-badrashein" },
  { id: 30, governorate_id: 2, name_ar: "العياط", name_en: "Al-Ayyat", slug: "al-ayyat" },

  // Alexandria (id: 3)
  { id: 31, governorate_id: 3, name_ar: "سموحة", name_en: "Smouha", slug: "smouha" },
  { id: 32, governorate_id: 3, name_ar: "الرمل", name_en: "Al-Raml", slug: "al-raml" },
  { id: 33, governorate_id: 3, name_ar: "المنشية", name_en: "Al-Mansheya", slug: "al-mansheya" },
  { id: 34, governorate_id: 3, name_ar: "المنتزة", name_en: "Al-Montazah", slug: "al-montazah" },
  { id: 35, governorate_id: 3, name_ar: "سيدي بشر", name_en: "Sidi Bishr", slug: "sidi-bishr" },
  { id: 36, governorate_id: 3, name_ar: "العجمي", name_en: "Al-Ajami", slug: "al-ajami" },
  { id: 37, governorate_id: 3, name_ar: "العامرية", name_en: "Al-Amriya", slug: "al-amriya" },
  { id: 38, governorate_id: 3, name_ar: "برج العرب", name_en: "Borg El-Arab", slug: "borg-el-arab" },
  { id: 39, governorate_id: 3, name_ar: "ميامي", name_en: "Miami", slug: "miami" },

  // Qalyubia (id: 4)
  { id: 40, governorate_id: 4, name_ar: "بنها", name_en: "Banha", slug: "banha" },
  { id: 41, governorate_id: 4, name_ar: "شبرا الخيمة", name_en: "Shubra El-Kheima", slug: "shubra-el-kheima" },
  { id: 42, governorate_id: 4, name_ar: "قليوب", name_en: "Qalyub", slug: "qalyub" },
  { id: 43, governorate_id: 4, name_ar: "الخانكة", name_en: "Al-Khankah", slug: "al-khankah" },
  { id: 44, governorate_id: 4, name_ar: "القناطر الخيرية", name_en: "Al-Qanatir Al-Khayriyyah", slug: "al-qanatir-al-khayriyyah" },
  { id: 45, governorate_id: 4, name_ar: "طوخ", name_en: "Toukh", slug: "toukh" },
  { id: 46, governorate_id: 4, name_ar: "شبين القناطر", name_en: "Shebin Al-Qanatir", slug: "shebin-al-qanatir" },

  // Dakahlia (id: 5)
  { id: 47, governorate_id: 5, name_ar: "المنصورة", name_en: "Mansoura", slug: "mansoura" },
  { id: 48, governorate_id: 5, name_ar: "ميت غمر", name_en: "Mit Ghamr", slug: "mit-ghamr" },
  { id: 49, governorate_id: 5, name_ar: "السنبلاوين", name_en: "Al-Senbellawein", slug: "al-senbellawein" },
  { id: 50, governorate_id: 5, name_ar: "طلخا", name_en: "Talkha", slug: "talkha" },
  { id: 51, governorate_id: 5, name_ar: "دكرنس", name_en: "Dekernes", slug: "dekernes" },
  { id: 52, governorate_id: 5, name_ar: "بلقاس", name_en: "Belqas", slug: "belqas" },
  { id: 53, governorate_id: 5, name_ar: "شربين", name_en: "Sherbin", slug: "sherbin" },

  // Gharbia (id: 6)
  { id: 54, governorate_id: 6, name_ar: "طنطا", name_en: "Tanta", slug: "tanta" },
  { id: 55, governorate_id: 6, name_ar: "المحلة الكبرى", name_en: "El-Mahalla El-Kubra", slug: "el-mahalla-el-kubra" },
  { id: 56, governorate_id: 6, name_ar: "كفر الزيات", name_en: "Kafr El-Zayat", slug: "kafr-el-zayat" },
  { id: 57, governorate_id: 6, name_ar: "زفتى", name_en: "Zefta", slug: "zefta" },
  { id: 58, governorate_id: 6, name_ar: "بسيون", name_en: "Basyoun", slug: "basyoun" },
  { id: 59, governorate_id: 6, name_ar: "سمنود", name_en: "Samanoud", slug: "samanoud" },

  // Monufia (id: 7)
  { id: 60, governorate_id: 7, name_ar: "شبين الكوم", name_en: "Shebin El-Kom", slug: "shebin-el-kom" },
  { id: 61, governorate_id: 7, name_ar: "أشمون", name_en: "Ashmoun", slug: "ashmoun" },
  { id: 62, governorate_id: 7, name_ar: "منوف", name_en: "Menouf", slug: "menouf" },
  { id: 63, governorate_id: 7, name_ar: "تلا", name_en: "Tala", slug: "tala" },
  { id: 64, governorate_id: 7, name_ar: "الباجور", name_en: "Al-Bagour", slug: "al-bagour" },
  { id: 65, governorate_id: 7, name_ar: "قويسنا", name_en: "Quwaysna", slug: "quwaysna" },
  { id: 66, governorate_id: 7, name_ar: "مدينة السادات", name_en: "Sadat City", slug: "sadat-city" },

  // Sharqia (id: 8)
  { id: 67, governorate_id: 8, name_ar: "الزقازيق", name_en: "Zagazig", slug: "zagazig" },
  { id: 68, governorate_id: 8, name_ar: "العاشر من رمضان", name_en: "10th of Ramadan", slug: "10th-of-ramadan" },
  { id: 69, governorate_id: 8, name_ar: "بلبيس", name_en: "Belbeis", slug: "belbeis" },
  { id: 70, governorate_id: 8, name_ar: "منيا القمح", name_en: "Minya El-Qamh", slug: "minya-el-qamh" },
  { id: 71, governorate_id: 8, name_ar: "فاقوس", name_en: "Faqous", slug: "faqous" },
  { id: 72, governorate_id: 8, name_ar: "أبو حماد", name_en: "Abu Hammad", slug: "abu-hammad" },
  { id: 73, governorate_id: 8, name_ar: "ديرب نجم", name_en: "Deyarb Negm", slug: "deyarb-negm" },

  // Beheira (id: 9)
  { id: 74, governorate_id: 9, name_ar: "دمنهور", name_en: "Damanhour", slug: "damanhour" },
  { id: 75, governorate_id: 9, name_ar: "كفر الدوار", name_en: "Kafr El-Dawar", slug: "kafr-el-dawar" },
  { id: 76, governorate_id: 9, name_ar: "كوم حمادة", name_en: "Kom Hamada", slug: "kom-hamada" },
  { id: 77, governorate_id: 9, name_ar: "إيتاي البارود", name_en: "Itay El-Baroud", slug: "itay-el-baroud" },
  { id: 78, governorate_id: 9, name_ar: "أبو حمص", name_en: "Abu Hummus", slug: "abu-hummus" },
  { id: 79, governorate_id: 9, name_ar: "رشيد", name_en: "Rosetta", slug: "rosetta" },
  { id: 80, governorate_id: 9, name_ar: "وادي النطرون", name_en: "Wadi El-Natrun", slug: "wadi-el-natrun" },

  // Damietta (id: 10)
  { id: 81, governorate_id: 10, name_ar: "دمياط", name_en: "Damietta", slug: "damietta" },
  { id: 82, governorate_id: 10, name_ar: "دمياط الجديدة", name_en: "New Damietta", slug: "new-damietta" },
  { id: 83, governorate_id: 10, name_ar: "رأس البر", name_en: "Ras El-Bar", slug: "ras-el-bar" },
  { id: 84, governorate_id: 10, name_ar: "فارسكور", name_en: "Faraskur", slug: "faraskur" },
  { id: 85, governorate_id: 10, name_ar: "الزرقا", name_en: "Al-Zarqa", slug: "al-zarqa" },

  // Port Said (id: 11)
  { id: 86, governorate_id: 11, name_ar: "بورفؤاد", name_en: "Port Fouad", slug: "port-fouad" },
  { id: 87, governorate_id: 11, name_ar: "حي الشرق", name_en: "Sharq District", slug: "sharq-district" },
  { id: 88, governorate_id: 11, name_ar: "حي العرب", name_en: "Arab District", slug: "arab-district" },
  { id: 89, governorate_id: 11, name_ar: "حي المناخ", name_en: "Manakh District", slug: "manakh-district" },

  // Ismailia (id: 12)
  { id: 90, governorate_id: 12, name_ar: "الإسماعيلية", name_en: "Ismailia", slug: "ismailia" },
  { id: 91, governorate_id: 12, name_ar: "التل الكبير", name_en: "El-Tell El-Kebir", slug: "el-tell-el-kebir" },
  { id: 92, governorate_id: 12, name_ar: "فايد", name_en: "Fayed", slug: "fayed" },
  { id: 93, governorate_id: 12, name_ar: "القنطرة غرب", name_en: "Qantara West", slug: "qantara-west" },

  // Suez (id: 13)
  { id: 94, governorate_id: 13, name_ar: "حي السويس", name_en: "Suez District", slug: "suez-district" },
  { id: 95, governorate_id: 13, name_ar: "حي الأربعين", name_en: "Arbaeen District", slug: "arbaeen-district" },
  { id: 96, governorate_id: 13, name_ar: "حي عتاقة", name_en: "Attaka District", slug: "attaka-district" },
  { id: 97, governorate_id: 13, name_ar: "حي فيصل", name_en: "Faisal District", slug: "faisal-district" },

  // Kafr El-Sheikh (id: 14)
  { id: 98, governorate_id: 14, name_ar: "كفر الشيخ", name_en: "Kafr El-Sheikh", slug: "kafr-el-sheikh" },
  { id: 99, governorate_id: 14, name_ar: "دسوق", name_en: "Desouk", slug: "desouk" },
  { id: 100, governorate_id: 14, name_ar: "قلين", name_en: "Qallin", slug: "qallin" },
  { id: 101, governorate_id: 14, name_ar: "سيدي سالم", name_en: "Sidi Salem", slug: "sidi-salem" },
  { id: 102, governorate_id: 14, name_ar: "بلطيم", name_en: "Baltim", slug: "baltim" },

  // Beni Suef (id: 15)
  { id: 103, governorate_id: 15, name_ar: "بني سويف", name_en: "Beni Suef", slug: "beni-suef" },
  { id: 104, governorate_id: 15, name_ar: "ببا", name_en: "Biba", slug: "biba" },
  { id: 105, governorate_id: 15, name_ar: "ناصر", name_en: "Nasser", slug: "nasser" },
  { id: 106, governorate_id: 15, name_ar: "الفشن", name_en: "Al-Fashn", slug: "al-fashn" },
  { id: 107, governorate_id: 15, name_ar: "سمسطا", name_en: "Samasta", slug: "samasta" },
  { id: 108, governorate_id: 15, name_ar: "الواسطى", name_en: "Al-Wasta", slug: "al-wasta" },

  // Minya (id: 16)
  { id: 109, governorate_id: 16, name_ar: "المنيا", name_en: "Minya", slug: "minya" },
  { id: 110, governorate_id: 16, name_ar: "ملوي", name_en: "Mallawi", slug: "mallawi" },
  { id: 111, governorate_id: 16, name_ar: "بني مزار", name_en: "Bani Mazar", slug: "bani-mazar" },
  { id: 112, governorate_id: 16, name_ar: "مغاغة", name_en: "Maghagha", slug: "maghagha" },
  { id: 113, governorate_id: 16, name_ar: "سمالوط", name_en: "Samalut", slug: "samalut" },
  { id: 114, governorate_id: 16, name_ar: "أبو قرقاص", name_en: "Abu Qurqas", slug: "abu-qurqas" },

  // Faiyum (id: 17) - Keep exact original IDs 1 to 8, add new ones starting from 115
  { id: 1, governorate_id: 17, name_ar: "الفيوم", name_en: "Faiyum", slug: "faiyum" },
  { id: 2, governorate_id: 17, name_ar: "المسلة", name_en: "Al-Masala", slug: "al-masala" },
  { id: 3, governorate_id: 17, name_ar: "دلة", name_en: "Dala", slug: "dala" },
  { id: 4, governorate_id: 17, name_ar: "سنورس", name_en: "Sinuris", slug: "sinuris" },
  { id: 5, governorate_id: 17, name_ar: "أبشواي", name_en: "Abshaway", slug: "abshaway" },
  { id: 6, governorate_id: 17, name_ar: "البحاري", name_en: "Al-Bahari", slug: "al-bahari" },
  { id: 7, governorate_id: 17, name_ar: "التسعاوى", name_en: "Al-Tasaawi", slug: "al-tasaawi" },
  { id: 8, governorate_id: 17, name_ar: "لطف الله", name_en: "Lotf Allah", slug: "lotf-allah" },
  { id: 115, governorate_id: 17, name_ar: "إطسا", name_en: "Itsa", slug: "itsa" },
  { id: 116, governorate_id: 17, name_ar: "طامية", name_en: "Tamia", slug: "tamia" },
  { id: 117, governorate_id: 17, name_ar: "يوسف الصديق", name_en: "Youssef El-Seddik", slug: "youssef-el-seddik" },

  // Asyut (id: 18)
  { id: 118, governorate_id: 18, name_ar: "أسيوط", name_en: "Asyut", slug: "asyut" },
  { id: 119, governorate_id: 18, name_ar: "ديروط", name_en: "Dairut", slug: "dairut" },
  { id: 120, governorate_id: 18, name_ar: "منفلوط", name_en: "Manfalut", slug: "manfalut" },
  { id: 121, governorate_id: 18, name_ar: "القوصية", name_en: "Al-Qusiya", slug: "al-qusiya" },
  { id: 122, governorate_id: 18, name_ar: "أبو تيج", name_en: "Abu Tig", slug: "abu-tig" },
  { id: 123, governorate_id: 18, name_ar: "صدفا", name_en: "Sedfa", slug: "sedfa" },

  // Sohag (id: 19)
  { id: 124, governorate_id: 19, name_ar: "سوهاج", name_en: "Sohag", slug: "sohag" },
  { id: 125, governorate_id: 19, name_ar: "طما", name_en: "Tama", slug: "tama" },
  { id: 126, governorate_id: 19, name_ar: "طهطا", name_en: "Tahta", slug: "tahta" },
  { id: 127, governorate_id: 19, name_ar: "المراغة", name_en: "Al-Maragha", slug: "al-maragha" },
  { id: 128, governorate_id: 19, name_ar: "جرجا", name_en: "Girga", slug: "girga" },
  { id: 129, governorate_id: 19, name_ar: "البلينا", name_en: "Al-Balyana", slug: "al-balyana" },

  // Qena (id: 20)
  { id: 130, governorate_id: 20, name_ar: "قنا", name_en: "Qena", slug: "qena" },
  { id: 131, governorate_id: 20, name_ar: "نجع حمادي", name_en: "Nag Hammadi", slug: "nag-hammadi" },
  { id: 132, governorate_id: 20, name_ar: "دشنا", name_en: "Dishna", slug: "dishna" },
  { id: 133, governorate_id: 20, name_ar: "قوص", name_en: "Qus", slug: "qus" },
  { id: 134, governorate_id: 20, name_ar: "نقادة", name_en: "Naqada", slug: "naqada" },

  // Luxor (id: 21)
  { id: 135, governorate_id: 21, name_ar: "الأقصر", name_en: "Luxor", slug: "luxor" },
  { id: 136, governorate_id: 21, name_ar: "إسنا", name_en: "Esna", slug: "esna" },
  { id: 137, governorate_id: 21, name_ar: "أرمنت", name_en: "Armant", slug: "armant" },

  // Aswan (id: 22)
  { id: 138, governorate_id: 22, name_ar: "أسوان", name_en: "Aswan", slug: "aswan" },
  { id: 139, governorate_id: 22, name_ar: "كوم أمبو", name_en: "Kom Ombo", slug: "kom-ombo" },
  { id: 140, governorate_id: 22, name_ar: "إدفو", name_en: "Edfu", slug: "edfu" },

  // Red Sea (id: 23)
  { id: 141, governorate_id: 23, name_ar: "الغردقة", name_en: "Hurghada", slug: "hurghada" },
  { id: 142, governorate_id: 23, name_ar: "سفاجا", name_en: "Safaga", slug: "safaga" },
  { id: 143, governorate_id: 23, name_ar: "القصير", name_en: "Al-Qusayr", slug: "al-qusayr" },
  { id: 144, governorate_id: 23, name_ar: "مرسى علم", name_en: "Marsa Alam", slug: "marsa-alam" },

  // New Valley (id: 24)
  { id: 145, governorate_id: 24, name_ar: "الخارجة", name_en: "Al-Kharga", slug: "al-kharga" },
  { id: 146, governorate_id: 24, name_ar: "الداخلة", name_en: "Al-Dakhla", slug: "al-dakhla" },

  // Matrouh (id: 25)
  { id: 147, governorate_id: 25, name_ar: "مرسى مطروح", name_en: "Marsa Matrouh", slug: "marsa-matrouh" },
  { id: 148, governorate_id: 25, name_ar: "العلمين", name_en: "Al-Alamein", slug: "al-alamein" },
  { id: 149, governorate_id: 25, name_ar: "سيوة", name_en: "Siwa", slug: "siwa" },

  // North Sinai (id: 26)
  { id: 150, governorate_id: 26, name_ar: "العريش", name_en: "Al-Arish", slug: "al-arish" },
  { id: 151, governorate_id: 26, name_ar: "الشيخ زويد", name_en: "Sheikh Zuweid", slug: "sheikh-zuweid" },

  // South Sinai (id: 27)
  { id: 152, governorate_id: 27, name_ar: "شرم الشيخ", name_en: "Sharm El-Sheikh", slug: "sharm-el-sheikh" },
  { id: 153, governorate_id: 27, name_ar: "طور سيناء", name_en: "Tor Sinai", slug: "tor-sinai" },
  { id: 154, governorate_id: 27, name_ar: "دهب", name_en: "Dahab", slug: "dahab" },
];

const DOCTORS = [
  { name: "د. مروة صالح", phone: "01554429280", whatsapp: "01554429280", governorate_id: 17, city_id: 2, address: "المسلة برج الأطباء أعلي مطعم وصايا", specialty: "الجراحة العامة", verified: true, featured: true },
  { name: "د. غادة مرشد", phone: "01064000786", whatsapp: "01064000786", governorate_id: 17, city_id: 2, address: "المسلة أعلي حلويات سابلية", specialty: "الجراحة العامة", verified: true, featured: true },
  { name: "د. إسراء لملوم", phone: "01000000001", whatsapp: "01000000001", governorate_id: 17, city_id: null, address: "الفيوم - جراحة عامة ومسالك", specialty: "الجراحة العامة", bio: "جراحة عامة ومسالك بولية", verified: true, featured: false },
  { name: "د. منار سيد فرحات", phone: "01027028780", whatsapp: "01027028780", governorate_id: 17, city_id: 2, address: "المسلة العبودي أعلي سيراميك ليسيكو امان جنة الألبان", specialty: "الجهاز الهضمي والمناظير", verified: true, featured: true },
  { name: "د. إيمان محمود فارس", phone: "01143954391", whatsapp: "01143954391", governorate_id: 17, city_id: 2, address: "ميدان المسلة بجوار مطعم أوزي وبهية وصيدلية الدكتور - الدور الأول علوي", specialty: "الجهاز الهضمي والمناظير", verified: true, featured: true },
  { name: "د. أسماء عبدالمقصود غانم", phone: "01028275155", whatsapp: "01028275155", governorate_id: 17, city_id: 2, address: "عيادات أونست التخصصية - المسلة - اتجاه العبودي - أعلي صيدلية د وليد بجوار سيراميك الجارحي", specialty: "باطنة عامة", verified: true, featured: true },
  { name: "د. مروى نبيل", phone: "01067722878", whatsapp: "01067722878", governorate_id: 17, city_id: 3, address: "دلة ـ برج الهادي بعد سوبر ماركت العماد", specialty: "طب الأورام", verified: true, featured: true },
  { name: "د. فاطمة أبو القاسم", phone: "01151333920", whatsapp: "01151333920", governorate_id: 17, city_id: 2, address: "المسله أعلي مطعم روزانا", specialty: "طب الأورام", verified: true, featured: false },
  { name: "د. هبة أشرف", phone: "01120408069", whatsapp: "01120408069", governorate_id: 17, city_id: 2, address: "المسلة برج البراء الدور الرابع", specialty: "طب الأورام", verified: true, featured: false },
  { name: "د. ريهام سمير اليزل", phone: "01065207006", whatsapp: "01065207006", governorate_id: 17, city_id: 1, address: "بجوار مسجد دار الرماد الشرقي ـ أمام كشري المصطفى ـ برج الإيمان الدور الأول - الفيوم", specialty: "السكر والغدد الصماء", verified: true, featured: true },
  { name: "د. أسماء يونس الساري", phone: "01000803833", whatsapp: "01000928268", governorate_id: 17, city_id: 1, address: "شارع النبوي المهندس، برج الندى - الفيوم", specialty: "التغذية والسمنة والنحافة", verified: true, featured: true },
  { name: "د. عبير عزت", phone: "01008897611", whatsapp: "01008897611", governorate_id: 17, city_id: 6, address: "البحاري خلف الكنيسة بجوار كلية طب اسنان", specialty: "التغذية والسمنة والنحافة", verified: true, featured: false },
  { name: "د. ريهام فارس", phone: "01010137000", whatsapp: "01010137000", governorate_id: 17, city_id: null, address: "مفارق دار رماد عند النجده أعلى سوبر ماركت بيم", specialty: "التغذية والسمنة والنحافة", verified: true, featured: false },
  { name: "د. هاله حسان", phone: "01016556723", whatsapp: "01016556723", governorate_id: 17, city_id: 7, address: "التسعاوى بجوار مسجد دار الرماد الشرقي امام كشرى المصطفي", specialty: "التغذية والسمنة والنحافة", verified: true, featured: false },
  { name: "د. دعاء العطار", phone: "01026425693", whatsapp: "01026425693", governorate_id: 17, city_id: 2, address: "المسلة أمام عمارة التأمين أعلي بنك مصر", specialty: "النساء والتوليد", verified: true, featured: true },
  { name: "د. نشوى رحيم", phone: "01060220848", whatsapp: "01060220848", governorate_id: 17, city_id: null, address: "مفارق المستشفى العام - أمام النجدة - برج الأطباء الدور الأول علوي", specialty: "النساء والتوليد", verified: true, featured: true },
  { name: "د. سمر نجيب", phone: "01001313795", whatsapp: "01001313795", governorate_id: 17, city_id: 2, address: "المسلة بجوار مستشفي الندي أمام معرض سيراميك الديب", specialty: "النساء والتوليد", verified: true, featured: false },
  { name: "د. مرام صلاح", phone: "01028194130", whatsapp: "01028194130", governorate_id: 17, city_id: 2, address: "المسلة بجوار كافيه سبيس برج المختار", specialty: "النساء والتوليد", verified: true, featured: false },
  { name: "د. آية صلاح", phone: "01500424402", whatsapp: "01500424402", governorate_id: 17, city_id: 2, address: "المسلة بجوار كافيه سبيس برج المختار", specialty: "النساء والتوليد", verified: true, featured: false },
  { name: "د. شرين صادق", phone: "01000000020", whatsapp: "01000000020", governorate_id: 17, city_id: null, address: "مركز يقين بالفنية مجمع بدر الإسلامي", specialty: "الرمد", verified: true, featured: false },
  { name: "د. مريم إيهاب", phone: "01225625940", whatsapp: "01225625940", governorate_id: 17, city_id: null, address: "أمام مدرسة المحمدية ـ الدور الثاني", specialty: "الطب النفسي", verified: true, featured: true },
  { name: "د. مروة كمال", phone: "01020059796", whatsapp: "01020059796", governorate_id: 17, city_id: 2, address: "المسلة - فوق مطعم روزانا", specialty: "الطب النفسي", verified: true, featured: false },
  { name: "د. شيماء محمد خالد", phone: "01113718333", whatsapp: "01113718333", governorate_id: 17, city_id: null, address: "أمام موقف مصر ـ أعلي فندق هاني داي", specialty: "الطب النفسي", verified: true, featured: false },
  { name: "د. هالة شاهين", phone: "01028515954", whatsapp: "01028515954", governorate_id: 17, city_id: null, address: "عند ملف النجدة - مفارق المستشفى العام", specialty: "المخ والأعصاب", verified: true, featured: true },
  { name: "د. مروة أبو عميرة", phone: "01018700204", whatsapp: "01018700204", governorate_id: 17, city_id: 2, address: "المسلة - برج البشير - بجوار سابليه للحلويات", specialty: "المخ والأعصاب", verified: true, featured: false },
  { name: "د. رنا سمير سيف اليزل", phone: "01012812548", whatsapp: "01012812548", governorate_id: 17, city_id: 4, address: "سنورس - أمام بيت العيلة - أعلى معمل القدس", specialty: "المخ والأعصاب", verified: true, featured: false },
  { name: "د. هدي القاضي", phone: "01000000027", whatsapp: "01000000027", governorate_id: 17, city_id: null, address: "الفيوم - مخ وأعصاب أطفال", specialty: "المخ والأعصاب", bio: "مخ وأعصاب أطفال", verified: true, featured: false },
  { name: "د. إيمان الشامي", phone: "01003485528", whatsapp: "01003485528", governorate_id: 17, city_id: 2, address: "المسلة - برج الأميرة الدور التالت أعلى محل تاي هاوس للملابس", specialty: "القلب والأوعية الدموية", verified: true, featured: true },
  { name: "د. سميحة جاب الله", phone: "01012389760", whatsapp: "01012389760", governorate_id: 17, city_id: 2, address: "المسلة مدخل الإصلاح الزراعي برج الرواد الدور الاول علوي", specialty: "القلب والأوعية الدموية", verified: true, featured: false },
  { name: "د. هدير مهدي", phone: "01024252061", whatsapp: "01050991277", governorate_id: 17, city_id: null, address: "مفارق الصدر اعلي سما فون", specialty: "القلب والأوعية الدموية", verified: true, featured: false },
  { name: "د. نسرين أبو ريه", phone: "01010369676", whatsapp: "01010369676", governorate_id: 17, city_id: 8, address: "لطف الله شارع النادى أمام مسجد الشبان المسلمين بجوار dejavu", specialty: "الجلدية", verified: true, featured: true },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Seed governorates
  for (const gov of GOVERNORATES) {
    await prisma.governorate.upsert({
      where: { slug: gov.slug },
      update: {
        name_ar: gov.name_ar,
        name_en: gov.name_en,
      },
      create: gov,
    });
  }
  console.log(`✅ ${GOVERNORATES.length} governorates seeded`);

  // Seed cities
  for (const city of CITIES) {
    await prisma.city.upsert({
      where: { governorate_id_slug: { governorate_id: city.governorate_id, slug: city.slug } },
      update: {
        name_ar: city.name_ar,
        name_en: city.name_en,
      },
      create: city,
    });
  }
  console.log(`✅ ${CITIES.length} cities seeded`);

  // Seed doctors (skip if exists by phone)
  let doctorCount = 0;
  for (const doctor of DOCTORS) {
    const existing = await prisma.doctor.findFirst({ where: { phone: doctor.phone } });
    if (!existing) {
      await prisma.doctor.create({ data: doctor as any });
      doctorCount++;
    }
  }
  console.log(`✅ ${doctorCount} new doctors seeded (${DOCTORS.length - doctorCount} already existed)`);

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
