import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SubHeader } from "../components/common/SubHeader";
import { dbService } from "../services/dbService";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import confetti from "canvas-confetti";
import {
  Calendar,
  Users,
  CreditCard,
  QrCode,
  Building,
  Sparkles,
  MapPin,
  ShieldAlert
} from "lucide-react";

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t, localize, formatPrice, language } = useLanguage();

  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(searchParams.get("hotel") || "");
  const [selectedRoomId, setSelectedRoomId] = useState(searchParams.get("room") || "");

  const [checkIn, setCheckIn] = useState(() => {
    return searchParams.get("checkIn") || (() => {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      return today.toISOString().split("T")[0];
    })();
  });

  const [checkOut, setCheckOut] = useState(() => {
    return searchParams.get("checkOut") || (() => {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 3);
      return nextDay.toISOString().split("T")[0];
    })();
  });

  const [guests, setGuests] = useState(() => {
    return Number(searchParams.get("guests")) || 2;
  });

  const [customerName, setCustomerName] = useState(currentUser?.full_name || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("VietQR");
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  // Load Hotels and Room Types
  useEffect(() => {
    const loadData = async () => {
      try {
        const [hotelsData, roomsData] = await Promise.all([
          dbService.getHotels(),
          dbService.getRoomTypes()
        ]);
        setHotels(hotelsData);
        setRooms(roomsData);

        // If query param hotel or room
        const paramHotel = searchParams.get("hotel");
        const paramRoom = searchParams.get("room");

        if (paramHotel) {
          setSelectedHotelId(paramHotel);
        } else if (hotelsData.length > 0 && !selectedHotelId) {
          setSelectedHotelId(hotelsData[0].id);
        }

        if (paramRoom) {
          setSelectedRoomId(paramRoom);
        } else if (roomsData.length > 0 && !selectedRoomId) {
          setSelectedRoomId(roomsData[0].id);
        }
      } catch (err) {
        console.error("Error loading booking options:", err);
      }
    };
    loadData();
  }, [searchParams]);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.full_name || "");
      if (!customerEmail) setCustomerEmail(currentUser.email || "");
      if (!customerPhone && currentUser.phone) setCustomerPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Filter rooms by hotel if hotel selected
  const availableRoomTypes = selectedHotelId
    ? rooms.filter((r) => !r.hotel_id || r.hotel_id === selectedHotelId)
    : rooms;

  const selectedRoom = rooms.find((r) => String(r.id) === String(selectedRoomId)) || availableRoomTypes[0];
  const selectedHotel = hotels.find((h) => String(h.id) === String(selectedHotelId)) ||
    (selectedRoom?.hotel_id ? hotels.find((h) => String(h.id) === String(selectedRoom.hotel_id)) : null);

  // Calculate nights
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const totalPrice = selectedRoom ? selectedRoom.base_price * nights : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBanner(null);

    if (!selectedRoom) return;

    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorBanner({
        type: "VALIDATION",
        title: language === "vi" ? "Ngày lưu trú không hợp lệ" : "Invalid Stay Dates",
        message: t("err_invalid_dates")
      });
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        user_id: currentUser ? currentUser.id : "guest_" + Date.now(),
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        hotel_id: selectedHotel?.id || selectedRoom.hotel_id || "h_danang",
        hotel_name: selectedHotel ? localize(selectedHotel, "name") : (selectedRoom.hotel_name || "Mosari Resort Đà Nẵng"),
        room_type_id: selectedRoom.id,
        room_type_name: localize(selectedRoom, "name"),
        check_in_date: checkIn,
        check_out_date: checkOut,
        nights,
        guests: Number(guests),
        total_price: totalPrice,
        special_requests: specialRequests,
        payment_method: paymentMethod
      };

      const result = await dbService.createBooking(bookingData);

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

      // Navigate to success page
      navigate("/booking-success", { state: { booking: result, room: selectedRoom, hotel: selectedHotel } });
    } catch (err) {
      console.error("Booking error caught in UI:", err);

      // Check for 409 Conflict / Double-booking exclusion violation
      const isConflict =
        err.status === 409 ||
        err.code === "23P01" ||
        err.message === "ROOM_UNAVAILABLE_FOR_DATES" ||
        err.message === "DOUBLE_BOOKING_CONFLICT" ||
        (typeof err.message === "string" && err.message.toLowerCase().includes("exclusion"));

      if (isConflict) {
        setErrorBanner({
          type: "409_CONFLICT",
          title: t("err_double_booking_title"),
          message: t("err_double_booking_desc", { checkIn, checkOut }),
          code: "HTTP 409 Conflict • PostgreSQL GIST [room_id, daterange) Violation"
        });
      } else {
        setErrorBanner({
          type: "SERVER_ERROR",
          title: language === "vi" ? "Lỗi hệ thống" : "Booking Error",
          message: err.message || t("err_server_error")
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <SubHeader
        title={t("booking_title")}
        subtitle={t("booking_subtitle")}
        breadcrumbCurrent={t("nav_booking")}
        bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Double-Booking 409 Alert Banner */}
        {errorBanner && (
          <div
            className={`mb-8 p-6 rounded-3xl border shadow-lg animate-fade-in ${
              errorBanner.type === "409_CONFLICT"
                ? "bg-rose-50 border-rose-300 text-rose-900"
                : "bg-amber-50 border-amber-300 text-amber-900"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl flex-shrink-0 ${
                  errorBanner.type === "409_CONFLICT" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                }`}
              >
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-montserrat font-bold text-lg">{errorBanner.title}</h4>
                  {errorBanner.code && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-200 text-rose-800">
                      {errorBanner.code}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed opacity-90">{errorBanner.message}</p>
                {errorBanner.type === "409_CONFLICT" && (
                  <p className="text-xs text-rose-700 font-semibold pt-1">
                    {language === "vi"
                      ? "💡 Gợi ý: Hãy thử chọn ngày nhận phòng / trả phòng khác hoặc chọn chi nhánh / hạng phòng khác bên dưới."
                      : "💡 Tip: Try adjusting your check-in/check-out dates or select another luxury suite or destination."}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Booking Details & Guest Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Chọn Chi Nhánh, Hạng Phòng & Ngày */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#c0a038]/10 text-[#c0a038] font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-montserrat font-bold text-lg text-[#11171d]">
                  {t("booking_step1")}
                </h3>
              </div>

              {/* Destination & Room Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Branch Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    {t("branch_select")}
                  </label>
                  <select
                    value={selectedHotelId}
                    onChange={(e) => {
                      setSelectedHotelId(e.target.value);
                      const branchRooms = rooms.filter((r) => !r.hotel_id || r.hotel_id === e.target.value);
                      if (branchRooms.length > 0) {
                        setSelectedRoomId(branchRooms[0].id);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                  >
                    {hotels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {localize(h, "name")} ({h.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    {language === "vi" ? "Lựa chọn hạng phòng" : "Select Room Suite"}
                  </label>
                  <select
                    value={selectedRoom?.id || ""}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                  >
                    {availableRoomTypes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {localize(r, "name")} — {formatPrice(r.base_price)}/đêm ({r.area}m², tối đa {r.capacity} khách)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates & Guests Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    {t("check_in")} *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    {t("check_out")} *
                  </label>
                  <input
                    type="date"
                    required
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    {t("guests")}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {t("guest_count", { n: num })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Thông tin liên hệ */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#c0a038]/10 text-[#c0a038] font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-montserrat font-bold text-lg text-[#11171d]">
                  {t("booking_step2")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    {t("customer_fullname")} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    {t("customer_phone")} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0901234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  {t("customer_email")} *
                </label>
                <input
                  type="email"
                  required
                  placeholder="VD: nguyenvana@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  {t("special_requests")}
                </label>
                <textarea
                  rows={2}
                  placeholder={t("special_requests_placeholder")}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                />
              </div>
            </div>

            {/* Step 3: Phương thức thanh toán */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#c0a038]/10 text-[#c0a038] font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-montserrat font-bold text-lg text-[#11171d]">
                  {t("booking_step3")}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: "VietQR",
                    title: language === "vi" ? "Chuyển khoản VietQR 24/7" : "VietQR Instant Mobile Wire",
                    desc: language === "vi" ? "Tạo mã QR tự động kèm nội dung đơn" : "Automatic QR code with reservation reference",
                    icon: QrCode
                  },
                  {
                    id: "Credit Card",
                    title: language === "vi" ? "Thẻ Tín Dụng Quốc Tế" : "International Credit Card",
                    desc: language === "vi" ? "Visa, Mastercard, JCB an toàn" : "Secure Visa, Mastercard, JCB hold",
                    icon: CreditCard
                  },
                  {
                    id: "Cash",
                    title: language === "vi" ? "Thanh toán tại quầy lễ tân" : "Pay at Reception",
                    desc: language === "vi" ? "Thanh toán bằng tiền mặt khi nhận phòng" : "Settle balance upon check-in",
                    icon: Building
                  }
                ].map((item) => {
                  const Icon = item.icon || QrCode;
                  const isChecked = paymentMethod === item.id;
                  return (
                    <label
                      key={item.id}
                      className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isChecked
                          ? "border-[#c0a038] bg-[#c0a038]/5 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={item.id}
                        checked={isChecked}
                        onChange={() => setPaymentMethod(item.id)}
                        className="mt-1 text-[#c0a038] focus:ring-[#c0a038]"
                      />
                      <Icon className="w-5 h-5 text-[#c0a038] flex-shrink-0 mt-0.5" />
                      <div className="flex-grow">
                        <span className="font-semibold text-sm text-[#11171d] block">
                          {item.title}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 block">
                          {item.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-6">
              <h3 className="font-montserrat font-bold text-lg text-[#11171d] pb-3 border-b border-gray-100">
                {t("booking_summary")}
              </h3>

              {selectedRoom && (
                <div className="space-y-4">
                  <div className="relative h-36 rounded-2xl overflow-hidden bg-black/10">
                    <img
                      src={selectedRoom.images?.[0]}
                      alt={localize(selectedRoom, "name")}
                      className="w-full h-full object-cover"
                    />
                    {selectedHotel && (
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 text-white backdrop-blur-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#c0a038]" /> {localize(selectedHotel, "name")}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-public font-bold text-base text-[#11171d]">
                      {localize(selectedRoom, "name")}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {selectedRoom.area} m² • {t("guest_count", { n: selectedRoom.capacity })}
                    </span>
                  </div>
                </div>
              )}

              {/* Time Breakdown */}
              <div className="space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>{t("check_in")}:</span>
                  <strong className="text-gray-900">{checkIn} (14:00)</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t("check_out")}:</span>
                  <strong className="text-gray-900">{checkOut} (12:00)</strong>
                </div>
                <div className="flex justify-between">
                  <span>{language === "vi" ? "Thời lượng lưu trú:" : "Duration:"}</span>
                  <strong className="text-[#c0a038] font-bold">{t("night_count", { n: nights })}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{language === "vi" ? "Đơn giá mỗi đêm:" : "Rate per night:"}</span>
                  <strong className="text-gray-900">{formatPrice(selectedRoom?.base_price || 0)}</strong>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm text-gray-800">{t("total_price")}:</span>
                  <span className="font-montserrat font-bold text-2xl text-[#11171d]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  {language === "vi" ? "(Đã bao gồm 10% thuế VAT và 5% phí phục vụ cao cấp)" : "(Includes 10% VAT & 5% luxury service charge)"}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-luxury-primary text-center !py-4 text-sm font-semibold shadow-lg shadow-[#c0a038]/20 disabled:opacity-50"
              >
                {loading ? t("booking_processing") : t("booking_confirm_btn")}
              </button>

              <div className="text-center">
                <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#c0a038]" /> {language === "vi" ? "Cam kết bảo mật thông tin 100%" : "100% Secure & Confidential"}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
