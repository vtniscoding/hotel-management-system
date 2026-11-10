import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const SubHeader = ({
  title,
  subtitle,
  breadcrumbCurrent,
  bgImage = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80"
}) => {
  const { t } = useLanguage();

  return (
    <header
      className="relative pt-36 pb-20 md:pt-44 md:pb-24 border-b-2 border-[#c0a038]/30 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(16, 20, 26, 0.96) 5%, rgba(26, 37, 47, 0.85) 45%, rgba(23, 30, 37, 0.6) 95%), url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-widest mb-4">
          <Link to="/" className="hover:text-[#c0a038] transition-colors">
            {t("nav_home")}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#c0a038]" />
          <span className="text-[#c0a038] font-medium">{breadcrumbCurrent || title}</span>
        </div>

        {/* Title & Desc */}
        <h1 className="font-nunito text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-white mb-3">
          <span className="logo-text">{title}</span>
        </h1>

        {subtitle && (
          <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed mt-2 font-light">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};
