import { Users, Building2, MapPin, Award } from "lucide-react";

interface StatsSectionProps {
  totalDoctors: number;
  totalGovernorates: number;
  totalCities: number;
}

export default function StatsSection({ totalDoctors, totalGovernorates, totalCities }: StatsSectionProps) {
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      value: `${totalDoctors}+`,
      label: "طبيبة مسجلة",
      bg: "bg-purple-50",
    },
    {
      icon: <Building2 className="w-8 h-8 text-pink-600" />,
      value: `${totalGovernorates}`,
      label: "محافظة مصرية",
      bg: "bg-pink-50",
    },
    {
      icon: <MapPin className="w-8 h-8 text-indigo-600" />,
      value: `${totalCities}+`,
      label: "منطقة وحي",
      bg: "bg-indigo-50",
    },
    {
      icon: <Award className="w-8 h-8 text-rose-600" />,
      value: "100%",
      label: "طبيبات موثوقات",
      bg: "bg-rose-50",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">الدليل في أرقام</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            نفخر بتقديم أكبر دليل لطبيبات أمراض النساء والتوليد في مصر
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`${stat.bg} rounded-2xl p-6 text-center hover:shadow-md transition-shadow duration-300 group`}
            >
              <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
