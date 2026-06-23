import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Send, ArrowRight, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Ahmed Ismail - Software Engineer",
  description:
    "Ahmed Ismail — Software Engineer & Developer of دليل طبيبات مصر. Connect on LinkedIn and Telegram.",
};

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/[0.01] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-white/[0.01] blur-[100px] pointer-events-none" />

      {/* Subtle grid/grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-sm w-full text-center">
        {/* Role badge */}
        <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-full px-4 py-1.5 text-xs text-gray-500 font-medium mb-8 backdrop-blur-sm">
          <Code2 className="w-3.5 h-3.5" />
          Software Engineer
        </div>

        {/* Photo with glow */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-white/[0.03] blur-md" />
          <div className="relative w-32 h-32 rounded-full overflow-hidden ring-1 ring-white/[0.08]">
            <Image
              src="/ahmed-ismail.jpg"
              alt="Ahmed Ismail"
              fill
              sizes="128px"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-3xl font-bold text-white/90 mb-1 tracking-tight">
          Ahmed Ismail
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 font-medium mb-6">Software Engineer</p>

        {/* Divider */}
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-6" />

        {/* Project Link */}
        <div className="mb-8 px-2">
          <Link
            href="/doctors"
            className="text-gray-600 text-sm leading-relaxed hover:text-gray-400 transition-colors"
          >
            مطور{" "}
            <span className="text-white/70 hover:text-white font-medium transition-colors">
              دليل طبيبات مصر
            </span>
          </Link>
        </div>

        {/* Social Buttons */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <a
            href="https://www.linkedin.com/in/ahmed-ismail-536a71191"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] text-white/80 border border-white/[0.08] px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:border-white/[0.15] hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)] active:scale-95"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <a
            href="https://t.me/heymate416"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] text-white/80 border border-white/[0.08] px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:border-white/[0.15] hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)] active:scale-95"
          >
            <Send className="w-4 h-4" />
            Telegram
          </a>
        </div>

        {/* Back to site */}
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-500 text-sm transition-colors group"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          العودة للدليل
        </Link>
      </div>
    </div>
  );
}