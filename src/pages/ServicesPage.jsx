import React from "react";
import { SubHeader } from "../components/common/SubHeader";
import { RESORT_SERVICES } from "../data/seedData";
import { useLanguage } from "../context/LanguageContext";
import { Clock, Check, PhoneCall } from "lucide-react";

export const ServicesPage = () => {
  const { t, localize, language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <SubHeader
        title={t("services_page_title")}
        subtitle={t("services_page_subtitle")}
        breadcrumbCurrent={t("nav_services")}
        bgImage="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
        {RESORT_SERVICES.map((service, index) => {
          const isEven = index % 2 === 1;
          const serviceTitle = localize(service, "title");
          const serviceSubtitle = localize(service, "subtitle");
          const serviceDesc = localize(service, "description");
          const features = language === "en" && service.features_en ? service.features_en : service.features_vi || [];

          return (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl overflow-hidden"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Service Image */}
                <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                    <img
                      src={service.image}
                      alt={serviceTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#c0a038]" />
                      <span>{service.hours}</span>
                    </div>
                  </div>
                </div>

                {/* Service Content */}
                <div className={`lg:col-span-6 space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div>
                    <span className="text-xs font-semibold text-[#c0a038] uppercase tracking-wider block mb-1">
                      {serviceSubtitle}
                    </span>
                    <h3 className="font-public font-bold text-2xl sm:text-3xl text-[#11171d]">
                      {serviceTitle}
                    </h3>
                  </div>

                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {serviceDesc}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#c0a038]/10 text-[#c0a038] flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA consultation */}
                  <div className="pt-4 flex items-center gap-4">
                    <a
                      href="tel:0901234567"
                      className="btn-luxury-primary text-xs !py-3 !px-6 inline-flex items-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{t("reserve_service")}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
