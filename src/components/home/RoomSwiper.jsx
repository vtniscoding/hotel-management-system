import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RoomCard } from "../rooms/RoomCard";
import { useLanguage } from "../../context/LanguageContext";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export const RoomSwiper = ({ rooms = [] }) => {
  const [startIndex, setStartIndex] = useState(0);
  const { t } = useLanguage();
  const itemsPerPage = 3;

  const maxIndex = Math.max(0, rooms.length - itemsPerPage);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleRooms = rooms.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-20 bg-gray-50/50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="luxury-title-1">{t("featured_rooms_title")}</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mt-3">
            {t("featured_rooms_sub")}
          </p>
        </div>

        {/* Carousel Grid with controls */}
        <div className="relative">
          {/* Navigation Controls */}
          {rooms.length > itemsPerPage && (
            <div className="hidden md:flex justify-end gap-3 mb-6">
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white text-gray-700 hover:text-[#c0a038] hover:border-[#c0a038] disabled:opacity-40 disabled:hover:text-gray-700 disabled:hover:border-gray-200 flex items-center justify-center shadow-sm transition-all"
                aria-label="Previous Rooms"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={startIndex >= maxIndex}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white text-gray-700 hover:text-[#c0a038] hover:border-[#c0a038] disabled:opacity-40 disabled:hover:text-gray-700 disabled:hover:border-gray-200 flex items-center justify-center shadow-sm transition-all"
                aria-label="Next Rooms"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-14">
          <Link
            to="/rooms"
            className="btn-luxury-outline inline-flex items-center gap-2 px-8 py-3.5 shadow-sm hover:shadow"
          >
            <span>{t("explore_rooms")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
