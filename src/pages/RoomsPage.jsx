import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SubHeader } from "../components/common/SubHeader";
import { RoomCard } from "../components/rooms/RoomCard";
import { dbService } from "../services/dbService";
import { useLanguage } from "../context/LanguageContext";
import {
  Maximize2,
  Users,
  CheckCircle2,
  XCircle,
  Check,
  Filter,
  Sparkles,
  MapPin,
  Calendar,
  Building
} from "lucide-react";

export const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const { t, localize, formatPrice, isEn } = useLanguage();

  const filterHotel = searchParams.get("hotel") || "all";
  const filterCheckIn = searchParams.get("checkIn") || "";
  const filterCheckOut = searchParams.get("checkOut") || "";
  const filterCapacity = searchParams.get("capacity") || searchParams.get("guests") || "all";
  const sortPrice = searchParams.get("sort") || "asc";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [hotelsData, roomsData] = await Promise.all([
          dbService.getHotels(),
          dbService.getRoomTypes({
            hotelId: filterHotel,
            checkIn: filterCheckIn,
            checkOut: filterCheckOut,
            capacity: filterCapacity
          })
        ]);

        setHotels(hotelsData);
        setRooms(roomsData);

        const selectedId = searchParams.get("selected");
        if (selectedId) {
          const match = roomsData.find((r) => String(r.id) === String(selectedId));
          if (match) setSelectedRoom(match);
        } else if (roomsData.length > 0) {
          setSelectedRoom(roomsData[0]);
        }
      } catch (err) {
        console.error("Failed to load rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterHotel, filterCheckIn, filterCheckOut, filterCapacity, searchParams]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === "all") {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    if (sortPrice === "asc") return a.base_price - b.base_price;
    return b.base_price - a.base_price;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* Sub Header */}
      <SubHeader
        title={t("nav_rooms")}
        subtitle={
          isEn
            ? "Discover exquisite coastal sanctuaries designed in graceful elegance with panoramic ocean horizons."
            : "Khám phá các hạng phòng nghỉ dưỡng sang trọng, được thiết kế tinh tế với tầm nhìn tuyệt đẹp tại Mosari Resort & Spa."
        }
        breadcrumbCurrent={t("nav_rooms")}
        bgImage="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Spotlight Featured Room Detail */}
        {selectedRoom && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-12 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image Section */}
              <div className="lg:col-span-7">
                <div className="relative h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-inner group">
                  <img
                    src={
                      selectedRoom.images?.[0] ||
                      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={localize(selectedRoom, "name")}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating Availability Badge */}
                  <div className="absolute top-5 left-5 z-10 shadow-lg">
                    {selectedRoom.available_count > 0 ? (
                      <span className="badge-status badge-available !px-4 !py-2 !text-xs">
                        <CheckCircle2 className="w-4 h-4" />{" "}
                        {t("rooms_left", { n: selectedRoom.available_count })}
                      </span>
                    ) : (
                      <span className="badge-status badge-booked !px-4 !py-2 !text-xs">
                        <XCircle className="w-4 h-4" /> {t("out_of_rooms")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Detail Info Section */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#c0a038] uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />{" "}
                    {isEn ? "Featured Signature Category" : "Hạng phòng nổi bật"}
                  </div>
                  <h2 className="font-public font-bold text-2xl md:text-3xl text-[#11171d] mb-4">
                    {localize(selectedRoom, "name")}
                  </h2>

                  {/* Specs */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 pb-4 border-b border-gray-100 mb-4">
                    <span className="flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-[#c0a038]" /> {selectedRoom.area} m²
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#c0a038]" />{" "}
                      {isEn
                        ? `Up to ${selectedRoom.capacity} guests`
                        : `Tối đa ${selectedRoom.capacity} khách`}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed text-justify mb-5 line-clamp-4">
                    {localize(selectedRoom, "long_description")}
                  </p>

                  {/* Amenities Badges */}
                  {(isEn ? selectedRoom.amenities_en : selectedRoom.amenities_vi || selectedRoom.amenities) && (
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {isEn ? "Included Privileges:" : "Đặc quyền & Tiện ích:"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(isEn ? selectedRoom.amenities_en : selectedRoom.amenities_vi || selectedRoom.amenities)
                          .slice(0, 4)
                          .map((amenity, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              {amenity}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price and Action */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                  <div>
                    <span className="text-xs text-gray-400 block uppercase font-medium">
                      {isEn ? "From" : "Giá ưu đãi từ"}
                    </span>
                    <div className="font-montserrat font-bold text-2xl text-[#11171d]">
                      {formatPrice(selectedRoom.base_price)}
                      <span className="text-xs font-normal text-gray-500"> {t("price_per_night")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/rooms/${selectedRoom.id}`}
                      className="btn-luxury-secondary text-xs !py-3 !px-5"
                    >
                      {t("details")}
                    </Link>
                    <Link
                      to={`/booking?room=${selectedRoom.id}${
                        selectedRoom.hotel_id ? `&hotel=${selectedRoom.hotel_id}` : ""
                      }${filterCheckIn ? `&checkIn=${filterCheckIn}` : ""}${
                        filterCheckOut ? `&checkOut=${filterCheckOut}` : ""
                      }`}
                      className="btn-luxury-primary text-xs !py-3 !px-6 shadow-md"
                    >
                      {t("nav_book_now")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multi-Branch & Concurrency Date Filters Bar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Branch Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {t("filter_by_branch")}
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#c0a038] absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={filterHotel}
                  onChange={(e) => updateParam("hotel", e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#c0a038] cursor-pointer"
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
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {t("check_in")}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#c0a038] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={filterCheckIn}
                  onChange={(e) => updateParam("checkIn", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#c0a038] cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Check-Out Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {t("check_out")}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#c0a038] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  min={filterCheckIn}
                  value={filterCheckOut}
                  onChange={(e) => updateParam("checkOut", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#c0a038] cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Capacity & Sort */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {t("sort_by")}
              </label>
              <select
                value={sortPrice}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#c0a038] cursor-pointer"
              >
                <option value="asc">{t("price_asc")}</option>
                <option value="desc">{t("price_desc")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* All Rooms Grid Header */}
        <div className="text-center mb-10">
          <h2 className="luxury-title-1">
            {isEn ? "All Luxury Accommodations" : "Tất Cả Hạng Phòng"}
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mt-2">
            {isEn
              ? "Select your premier retreat tailored precisely to your vacation itinerary."
              : "Lựa chọn không gian nghỉ dưỡng lý tưởng phù hợp nhất với chuyến đi của bạn."}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-[#c0a038] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              {isEn ? "Querying live room inventory from Supabase..." : "Đang kiểm tra phòng trống trên Supabase..."}
            </p>
          </div>
        ) : sortedRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedRooms.map((room) => (
              <div key={room.id} onClick={() => setSelectedRoom(room)}>
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
            <p className="text-gray-500">
              {isEn ? "No room categories match your chosen filters." : "Không tìm thấy phòng phù hợp với bộ lọc."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
