import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { SubHeader } from "../components/common/SubHeader";
import { dbService } from "../services/dbService";
import { useLanguage } from "../context/LanguageContext";
import {
  CheckCircle2,
  XCircle,
  Check,
  Calendar,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowLeft,
  MapPin
} from "lucide-react";

export const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, localize, formatPrice, language } = useLanguage();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const found = await dbService.getRoomTypeById(id);
        if (found) {
          setRoom(found);
        } else {
          navigate("/rooms");
        }
      } catch (err) {
        console.error("Error loading room detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#c0a038] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{language === "vi" ? "Đang tải thông tin chi tiết phòng..." : "Loading luxury suite details..."}</p>
        </div>
      </div>
    );
  }

  if (!room) return null;

  const images = Array.isArray(room.images) && room.images.length > 0
    ? room.images
    : ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"];

  const roomName = localize(room, "name");
  const roomDesc = localize(room, "description");
  const roomLongDesc = localize(room, "long_description") || roomDesc;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* Sub Header */}
      <SubHeader
        title={roomName}
        subtitle={roomDesc}
        breadcrumbCurrent={roomName}
        bgImage={images[0]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Back Link */}
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#c0a038] transition-colors mb-6 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> {t("back_to_rooms")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery & Long Description */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Active Image */}
            <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl bg-black/5">
              <img
                src={images[activeImageIndex]}
                alt={roomName}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Status Floating Badge */}
              <div className="absolute top-5 left-5 z-10 shadow-lg flex flex-wrap gap-2">
                {room.available_count > 0 ? (
                  <span className="badge-status badge-available !px-4 !py-2 !text-xs">
                    <CheckCircle2 className="w-4 h-4" /> {t("rooms_left", { n: room.available_count })}
                  </span>
                ) : (
                  <span className="badge-status badge-booked !px-4 !py-2 !text-xs">
                    <XCircle className="w-4 h-4" /> {t("out_of_rooms")}
                  </span>
                )}
                {room.hotel_name && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md">
                    <MapPin className="w-3.5 h-3.5 text-[#c0a038]" /> {room.hotel_name}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-24 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === activeImageIndex
                        ? "border-[#c0a038] shadow-md scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Detailed Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#c0a038] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> {t("room_overview")}
              </div>
              <h2 className="font-public font-bold text-2xl text-[#11171d]">
                {t("room_design_title")}
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line text-sm sm:text-base">
                {roomLongDesc}
              </p>

              {/* Amenities Grid */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-montserrat font-bold text-base text-[#11171d] mb-4">
                  {t("room_amenities_title")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.amenities?.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-gray-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resort Privileges */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#c0a038] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 block">{t("check_in_out")}</strong>
                    <span>{t("check_in_out_time")}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#c0a038] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 block">{t("free_cancellation")}</strong>
                    <span>{t("free_cancellation_desc")}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#c0a038] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-800 block">{t("breakfast_included")}</strong>
                    <span>{t("breakfast_included_desc")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider block mb-1">
                  {language === "vi" ? "Giá nghỉ dưỡng ưu đãi" : "Exclusive Nightly Rate"}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-montserrat font-bold text-3xl text-[#11171d]">
                    {formatPrice(room.base_price)}
                  </span>
                  <span className="text-xs text-gray-500 font-normal">{t("price_per_night")}</span>
                </div>
              </div>

              {/* Specs Summary */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t("area")}:</span>
                  <strong className="text-gray-900">{room.area} m²</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t("capacity")}:</span>
                  <strong className="text-gray-900">{t("guest_count", { n: room.capacity })}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t("status")}:</span>
                  <strong className={room.available_count > 0 ? "text-emerald-600" : "text-rose-600"}>
                    {room.available_count > 0 ? t("rooms_left", { n: room.available_count }) : t("out_of_rooms")}
                  </strong>
                </div>
              </div>

              {/* CTA Booking Button */}
              <div>
                <Link
                  to={`/booking?room=${room.id}${room.hotel_id ? `&hotel=${room.hotel_id}` : ""}`}
                  className="w-full btn-luxury-primary text-center !py-4 text-sm font-semibold shadow-lg shadow-[#c0a038]/20 block"
                >
                  {t("book_now_btn")}
                </Link>
                <p className="text-center text-[11px] text-gray-400 mt-3">
                  {t("instant_confirmation")}
                </p>
              </div>

              {/* Direct Support */}
              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">{t("need_help")}</p>
                <a
                  href="tel:0901234567"
                  className="text-sm font-bold text-[#c0a038] hover:underline block mt-1"
                >
                  Hotline: 090 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
