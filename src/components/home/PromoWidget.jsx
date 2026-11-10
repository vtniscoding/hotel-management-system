import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { dbService } from "../../services/dbService";
import { MapPin, Calendar, Users, Search, Sparkles } from "lucide-react";

export const PromoWidget = () => {
  const { t, localize, isEn } = useLanguage();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("all");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextThreeDays = new Date();
  nextThreeDays.setDate(nextThreeDays.getDate() + 3);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(nextThreeDays.toISOString().split("T")[0]);
  const [guests, setGuests] = useState("2");

  useEffect(() => {
    const fetchHotels = async () => {
      const data = await dbService.getHotels();
      setHotels(data);
    };
    fetchHotels();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedHotel && selectedHotel !== "all") params.set("hotel", selectedHotel);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    navigate(`/rooms?${params.toString()}`);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div id="explore" className="relative z-30 max-w-6xl mx-auto px-4 -mt-16 md:-mt-20">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/60 p-5 sm:p-7 transition-transform duration-300">
        {/* Top Mini Promo Bar */}
        <div className="flex flex-wrap items-center justify-between pb-5 mb-5 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#c0a038]/10 text-[#c0a038] border border-[#c0a038]/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t("promo_badge")}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#11171d]">
              {t("promo_title")}
            </span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline">
            {isEn ? "Direct booking guaranteed lowest rates" : "Cam kết giá trực tuyến tốt nhất"}
          </span>
        </div>

        {/* Quick Search Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* 1. Branch / Hotel Selection */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {t("branch_select")}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#c0a038] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c0a038] appearance-none cursor-pointer"
              >
                <option value="all">{t("branch_all")}</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {localize(h, "name")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Check-In Date */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {t("check_in")}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#c0a038] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                min={todayStr}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (new Date(e.target.value) >= new Date(checkOut)) {
                    const next = new Date(e.target.value);
                    next.setDate(next.getDate() + 1);
                    setCheckOut(next.toISOString().split("T")[0]);
                  }
                }}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c0a038] cursor-pointer"
              />
            </div>
          </div>

          {/* 3. Check-Out Date */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {t("check_out")}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#c0a038] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c0a038] cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Guests & Search Button */}
          <div className="lg:col-span-3 flex gap-2">
            <div className="w-1/3 space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {t("guests")}
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-[#c0a038] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full pl-8 pr-2 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c0a038] appearance-none cursor-pointer"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            <div className="w-2/3">
              <button
                type="submit"
                className="w-full btn-luxury-primary !py-3.5 !px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#c0a038]/20"
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{t("hero_search_btn")}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
