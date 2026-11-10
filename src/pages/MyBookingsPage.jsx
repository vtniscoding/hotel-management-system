import React, { useState, useEffect } from "react";
import { SubHeader } from "../components/common/SubHeader";
import { dbService } from "../services/dbService";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Search, Calendar, Users, Clock, AlertCircle, ArrowRight, MapPin, BedDouble, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export const MyBookingsPage = () => {
  const { currentUser } = useAuth();
  const { t, formatPrice, language } = useLanguage();
  const [searchCode, setSearchCode] = useState("");
  const [searchedBooking, setSearchedBooking] = useState(null);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const fetchBookings = async () => {
    try {
      const allBookings = await dbService.getBookings();
      if (currentUser) {
        const mine = allBookings.filter(
          (b) =>
            b.user_id === currentUser.id ||
            b.customer_email?.toLowerCase() === currentUser.email?.toLowerCase()
        );
        setUserBookings(mine);
      } else {
        setUserBookings(allBookings.slice(0, 5));
      }
    } catch (err) {
      console.error("Error loading user bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setSearchNotFound(false);
    const found = await dbService.getBookingByCode(searchCode.trim());
    if (found) {
      setSearchedBooking(found);
    } else {
      setSearchedBooking(null);
      setSearchNotFound(true);
    }
  };

  const handleCancelBooking = async (booking) => {
    const confirmText = t("cancel_confirm", { code: booking.booking_code });
    if (!window.confirm(confirmText)) return;

    try {
      await dbService.updateBookingStatus(booking.id, "Cancelled");
      setActionMsg(t("cancel_success"));
      setTimeout(() => setActionMsg(""), 3500);
      fetchBookings();
      if (searchedBooking && searchedBooking.id === booking.id) {
        setSearchedBooking({ ...searchedBooking, status: "Cancelled" });
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">{t("status_confirmed")}</span>;
      case "Completed":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{t("status_completed")}</span>;
      case "Cancelled":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">{t("status_cancelled")}</span>;
      case "Pending":
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">{t("status_pending")}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <SubHeader
        title={t("my_bookings_title")}
        subtitle={t("my_bookings_subtitle")}
        breadcrumbCurrent={t("nav_my_bookings")}
        bgImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {actionMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fade-in shadow-sm">
            {actionMsg}
          </div>
        )}

        {/* Search by Booking Code Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg">
          <h3 className="font-montserrat font-bold text-lg text-[#11171d] mb-2">
            {t("lookup_by_code")}
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            {t("lookup_hint")}
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t("lookup_input_placeholder")}
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038] uppercase font-mono"
              />
            </div>
            <button type="submit" className="btn-luxury-primary !py-3.5 !px-8">
              {t("lookup_btn")}
            </button>
          </form>

          {/* Searched Booking Result */}
          {searchedBooking && (
            <div className="mt-8 p-6 rounded-2xl bg-amber-500/5 border border-[#c0a038]/30 animate-fade-in space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-xs text-gray-500">{language === "vi" ? "Mã đơn đặt:" : "Booking Code:"}</span>
                  <h4 className="font-mono text-xl font-bold text-[#11171d]">
                    {searchedBooking.booking_code}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(searchedBooking.status)}
                  {searchedBooking.status === "Pending" && (
                    <button
                      onClick={() => handleCancelBooking(searchedBooking)}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                    >
                      {t("cancel_booking_btn")}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200/60 text-xs">
                <div>
                  <span className="text-gray-500 block">{language === "vi" ? "Hạng phòng:" : "Suite:"}</span>
                  <strong className="text-gray-900 text-sm">{searchedBooking.room_type_name}</strong>
                  {searchedBooking.hotel_name && (
                    <span className="text-[11px] text-gray-500 block mt-0.5">{searchedBooking.hotel_name}</span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500 block">{language === "vi" ? "Thời gian lưu trú:" : "Dates:"}</span>
                  <strong className="text-gray-900 text-sm">
                    {searchedBooking.check_in_date} ➔ {searchedBooking.check_out_date}
                  </strong>
                  <span className="text-[11px] text-[#c0a038] font-semibold block">
                    ({t("night_count", { n: searchedBooking.nights })})
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">{language === "vi" ? "Phòng cấp:" : "Room Allocated:"}</span>
                  <strong className="text-gray-900 text-sm font-mono">
                    {searchedBooking.room_number ? `P.${searchedBooking.room_number}` : (language === "vi" ? "Đang xếp phòng" : "Assigning")}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500 block">{t("total_price")}:</span>
                  <strong className="text-[#c0a038] text-sm font-bold">
                    {formatPrice(searchedBooking.total_price)}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {searchNotFound && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{t("lookup_not_found", { code: searchCode })}</span>
            </div>
          )}
        </div>

        {/* User Bookings History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-montserrat font-bold text-xl text-[#11171d]">
              {currentUser ? t("history_title") : (language === "vi" ? "Các Đơn Đặt Gần Đây" : "Recent Reservations")}
            </h3>
            <Link to="/booking" className="text-xs text-[#c0a038] font-bold hover:underline">
              + {language === "vi" ? "Đặt thêm phòng mới" : "Make New Reservation"}
            </Link>
          </div>

          {loading ? (
            <p className="text-center py-10 text-gray-500 text-sm">{language === "vi" ? "Đang tải lịch sử..." : "Loading history..."}</p>
          ) : userBookings.length > 0 ? (
            <div className="space-y-4">
              {userBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <strong className="font-mono text-base text-[#11171d] font-bold">
                        {b.booking_code}
                      </strong>
                      {getStatusBadge(b.status)}
                      {b.room_number && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gray-100 text-gray-700">
                          {b.room_number}
                        </span>
                      )}
                    </div>
                    <h4 className="font-public font-bold text-lg text-gray-900">
                      {b.room_type_name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      {b.hotel_name && (
                        <span className="flex items-center gap-1 font-medium text-gray-700">
                          <MapPin className="w-3.5 h-3.5 text-[#c0a038]" />
                          {b.hotel_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#c0a038]" />
                        {b.check_in_date} ➔ {b.check_out_date} ({t("night_count", { n: b.nights })})
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#c0a038]" />
                        {t("guest_count", { n: b.guests })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(b.created_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                      </span>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 gap-2">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">{t("total_price")}</span>
                      <strong className="font-montserrat text-lg text-[#c0a038] font-bold">
                        {formatPrice(b.total_price)}
                      </strong>
                    </div>

                    {b.status === "Pending" && (
                      <button
                        onClick={() => handleCancelBooking(b)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t("cancel_booking_btn")}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <p className="text-gray-500 text-sm mb-4">{t("no_bookings_yet")}</p>
              <Link to="/booking" className="btn-luxury-primary text-xs !py-3 !px-6">
                {t("book_today")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
