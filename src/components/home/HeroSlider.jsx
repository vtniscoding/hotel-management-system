import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HERO_SLIDES } from "../../data/seedData";
import { useLanguage } from "../../context/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const { localize } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-black select-none">
      {/* Background Slides */}
      {HERO_SLIDES.map((slide, index) => {
        const slogan = localize(slide, "slogan");
        const titleLine1 = localize(slide, "titleLine1");
        const titleLine2 = localize(slide, "titleLine2");
        const ctaText = localize(slide, "ctaText");

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Image with zoom effect */}
            <img
              src={slide.image}
              alt={titleLine1}
              className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
                index === current ? "scale-105" : "scale-100"
              }`}
            />
            {/* Luxury Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#11171d]/95 pointer-events-none" />

            {/* Slide Caption */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pt-16">
              <p className="logo-text font-montserrat font-semibold text-xs sm:text-sm md:text-base uppercase tracking-[3px] mb-3 md:mb-5 drop-shadow animate-fade-in">
                {slogan}
              </p>

              <h1 className="font-nunito font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider text-white drop-shadow-lg mb-6 md:mb-8 max-w-4xl leading-tight">
                <span className="block gray-metallic-text">{titleLine1}</span>
                <span className="block mt-1">{titleLine2}</span>
              </h1>

              <div className="mt-2">
                {slide.ctaLink.startsWith("#") ? (
                  <a
                    href={slide.ctaLink}
                    className="inline-block px-8 py-3.5 sm:px-10 sm:py-4 rounded-full border border-white/50 text-white font-montserrat font-semibold text-xs sm:text-sm uppercase tracking-[2px] bg-white/10 hover:bg-white hover:text-[#11171d] backdrop-blur-md transition-all duration-300 shadow-xl hover:-translate-y-1"
                  >
                    {ctaText}
                  </a>
                ) : (
                  <Link
                    to={slide.ctaLink}
                    className="inline-block px-8 py-3.5 sm:px-10 sm:py-4 rounded-full border border-white/50 text-white font-montserrat font-semibold text-xs sm:text-sm uppercase tracking-[2px] bg-white/10 hover:bg-white hover:text-[#11171d] backdrop-blur-md transition-all duration-300 shadow-xl hover:-translate-y-1"
                  >
                    {ctaText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full text-white/70 hover:text-white bg-black/30 hover:bg-black/60 backdrop-blur-sm transition-all duration-300"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full text-white/70 hover:text-white bg-black/30 hover:bg-black/60 backdrop-blur-sm transition-all duration-300"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-28 md:bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-10 bg-[#c0a038]" : "w-3 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
