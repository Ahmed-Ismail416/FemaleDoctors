import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });


const GOVERNORATE = {
  id: 17,
  name_ar: "الفيوم",
  name_en: "Faiyum",
  slug: "faiyum",
};

const CITIES = [
  { id: 1, governorate_id: 17, name_ar: "الفيوم", name_en: "Faiyum", slug: "faiyum" },
  { id: 2, governorate_id: 17, name_ar: "المسلة", name_en: "Al-Masala", slug: "al-masala" },
  { id: 3, governorate_id: 17, name_ar: "دلة", name_en: "Dala", slug: "dala" },
  { id: 4, governorate_id: 17, name_ar: "سنورس", name_en: "Sinuris", slug: "sinuris" },
  { id: 5, governorate_id: 17, name_ar: "أبشواي", name_en: "Abshaway", slug: "abshaway" },
  { id: 6, governorate_id: 17, name_ar: "البحاري", name_en: "Al-Bahari", slug: "al-bahari" },
  { id: 7, governorate_id: 17, name_ar: "التسعاوى", name_en: "Al-Tasaawi", slug: "al-tasaawi" },
  { id: 8, governorate_id: 17, name_ar: "لطف الله", name_en: "Lotf Allah", slug: "lotf-allah" },
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

  // Upsert governorate
  await prisma.governorate.upsert({
    where: { slug: GOVERNORATE.slug },
    update: {},
    create: GOVERNORATE,
  });
  console.log(`✅ Governorate seeded: ${GOVERNORATE.name_ar}`);

  // Upsert cities
  for (const city of CITIES) {
    await prisma.city.upsert({
      where: { governorate_id_slug: { governorate_id: city.governorate_id, slug: city.slug } },
      update: {},
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
