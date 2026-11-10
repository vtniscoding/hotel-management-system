import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Maximize2, Users, CheckCircle2, XCircle, Wrench } from "lucide-react";

export const RoomCard = ({ room }) => {
  const { t, localize, formatPrice, isEn } = useLanguage();

  const images = Array.isArray(room.images) ? room.images : [];
  const thumbnail =
    images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80";

  const roomName = localize(room, "name");
  const roomDesc = localize(room, "description");

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full">
      {/* Thumbnail with floating badge */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-black/10">
        <img
          src={thumbnail}
          alt={roomName}
          className="w-full h-full object-cover brightness-[0.9] group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10 shadow-md">
          {room.available_count > 0 ? (
            <span className="badge-status badge-available">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t("rooms_left", { n: room.available_count })}
            </span>
          ) : room.maintenance_count > 0 ? (
            <span className="badge-status badge-maintenance">
              <Wrench className="w-3.5 h-3.5" /> {t("status_maintenance")}
            </span>
          ) : (
            <span className="badge-status badge-booked">
              <XCircle className="w-3.5 h-3.5" /> {t("out_of_rooms")}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-public font-bold text-lg text-[#11171d] mb-2 line-clamp-1 group-hover:text-[#c0a038] transition-colors">
          {roomName}
        </h3>

        {/* Room Specs */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-[#c0a038]" /> {room.area} m²
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#c0a038]" /> {isEn ? `Up to ${room.capacity} guests` : `Tối đa ${room.capacity} khách`}
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-6">
          {roomDesc}
        </p>

        {/* Price & CTA Button */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-medium">
              {t("price_per_night")}
            </span>
            <span className="font-montserrat font-bold text-base sm:text-lg text-[#11171d]">
              {formatPrice(room.base_price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/rooms/${room.id}`}
              className="btn-luxury-secondary text-xs !py-2 !px-3.5"
            >
              {t("details")}
            </Link>
            <Link
              to={`/booking?room=${room.id}${room.hotel_id ? `&hotel=${room.hotel_id}` : ""}`}
              className="btn-luxury-primary text-xs !py-2 !px-3.5"
            >
              {t("nav_book_now")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
