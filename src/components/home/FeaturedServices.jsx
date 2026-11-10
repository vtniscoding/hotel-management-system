import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { ArrowRight } from "lucide-react";

export const FeaturedServices = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t, isEn } = useLanguage();

  const slides = [
    {
      id: 0,
      title: isEn
        ? "Exquisite Michelin-Inspired Beachfront Dining"
        : "Trải nghiệm nhà hàng chất lượng 5 sao ven biển",
      image: "https://images.unsplash.com/photo-1712746785126-e9f28b5b3cc0?q=80&w=1171&auto=format&fit=crop",
      badge: isEn ? "Haute Cuisine" : "Ẩm Thực Thượng Hạng"
    },
    {
      id: 1,
      title: isEn
        ? "Panoramic Oceanfront Infinity Horizon Pool"
        : "Hồ bơi tràn viền vô cực hướng đại dương",
      image: "https://images.unsplash.com/photo-1598095511385-216a40c514fc?q=80&w=1074&auto=format&fit=crop",
      badge: "Panorama 180°"
    },
    {
      id: 2,
      title: isEn
        ? "Holistic Herbal Therapy & Royal Lotus Spa"
        : "Dịch vụ Spa & Massage trị liệu thảo mộc cung đình",
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1170&auto=format&fit=crop",
      badge: "Lotus Wellness"
    }
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="luxury-title-1">{t("featured_services_title")}</h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mt-3">
          {t("featured_services_sub")}
        </p>
      </div>

      {/* Interactive Expandable Material Slider */}
      <div className="flex flex-col md:flex-row h-[550px] md:h-[450px] gap-4 p-2 select-none">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.id}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-lg ${
                isActive ? "md:flex-[3.5] flex-[2.5]" : "md:flex-[1] flex-[1]"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t from-[#11171d]/90 via-[#11171d]/40 to-transparent transition-opacity duration-500 ${
                  isActive ? "opacity-90" : "opacity-75"
                }`}
              />

              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                <span className="self-start px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#c0a038]/80 text-[#11171d] mb-2 backdrop-blur-sm">
                  {slide.badge}
                </span>

                <h3
                  className={`font-montserrat font-bold text-white transition-all duration-300 ${
                    isActive ? "text-lg md:text-2xl leading-snug" : "text-sm line-clamp-1 opacity-70"
                  }`}
                >
                  {slide.title}
                </h3>

                {isActive && (
                  <div className="mt-4 animate-fade-in flex items-center gap-2">
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-1.5 text-xs text-[#c0a038] hover:text-white font-semibold transition-colors"
                    >
                      <span>{t("view_details")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
