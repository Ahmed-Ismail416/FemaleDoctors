import Link from "next/link";
import { Heart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const benefits = [
    "ظهور مجاني في الدليل",
    "الوصول لآلاف المريضات",
    "صفحة تعريفية كاملة",
    "مراجعة وتوثيق الملف",
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-purple-600" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4 fill-pink-200 text-pink-200" />
            للطبيبات فقط
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-relaxed">
           ؟ أنت طبيبة  
            <br />
            <span className="text-pink-200">انضمي لدليلنا اليوم</span>
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            سجّلي بياناتك وانضمي لأكبر دليل لطبيبات مصر في مختلف التخصصات الطبية.
            وصولك لمريضاتك أصبح أسهل من أي وقت مضى.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-purple-100">
                <CheckCircle2 className="w-4 h-4 text-pink-300 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="xl" className="bg-white text-purple-600 hover:bg-pink-50 font-bold shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/register">
                <Heart className="w-5 h-5 fill-purple-600 text-purple-600" />
                سجّلي الآن مجاناً
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent" asChild>
              <Link href="/doctors">
                <ArrowLeft className="w-5 h-5" />
                تصفح الدليل
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
