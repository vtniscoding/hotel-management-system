import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { SubHeader } from "../components/common/SubHeader";
import { dbService } from "../services/dbService";
import { isSupabaseConfigured } from "../config/supabase";
import { useLanguage } from "../context/LanguageContext";
import {
  Shield,
  Layers,
  CalendarCheck,
  DollarSign,
  Database,
  RotateCw,
  Search,
  MapPin,
  CreditCard
} from "lucide-react";

export const AdminPage = () => {
  const { isAdmin, isStaff, loginDemoAdmin } = useAuth();
  const { t, formatPrice, localize, language } = useLanguage();

  const [activeTab, setActiveTab] = useState("bookings");
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterHotel, setFilterHotel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(null);

  const loadData = async () => {
    try {
      const [hotelsData, bookingsData, roomsData, paymentsData] = await Promise.all([
        dbService.getHotels(),
        dbService.getBookings(),
        dbService.getRooms(),
        dbService.getPayments()
      ]);
      setHotels(hotelsData);
      setBookings(bookingsData);
      setRooms(roomsData);
      setPayments(paymentsData);
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
  };

  useEffect(() => {
    if (isAdmin || isStaff) {
      loadData();
    }
  }, [isAdmin, isStaff]);

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await dbService.updateBookingStatus(id, status);
      loadData();
    } catch (err) {
      alert("Error updating booking status: " + err.message);
    }
  };

  const handleUpdateRoomStatus = async (id, status) => {
    try {
      await dbService.updateRoomStatus(id, status);
      loadData();
    } catch (err) {
      alert("Error updating room status: " + err.message);
    }
  };

  const handleUpdatePaymentStatus = async (id, status) => {
    try {
      await dbService.updatePaymentStatus(id, status);
      loadData();
    } catch (err) {
      alert("Error updating payment status: " + err.message);
    }
  };

  const handleSeedSupabase = async () => {
    setSeedLoading(true);
    setSeedSuccess(null);
    try {
      const res = await dbService.seedSupabaseData();
      setSeedSuccess(
        language === "vi"
          ? `Đã đồng bộ thành công dữ liệu mẫu lên Supabase PostgreSQL! (${res.hotels || 3} chi nhánh, ${res.room_types || 5} hạng phòng, ${res.rooms || 9} phòng vật lý)`
          : `Successfully synchronized seed dataset to Supabase Cloud PostgreSQL!`
      );
      loadData();
    } catch (err) {
      setSeedSuccess("Error: " + err.message);
    } finally {
      setSeedLoading(false);
    }
  };

  if (!isAdmin && !isStaff) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] pb-24">
        <SubHeader
          title={t("forbidden_title")}
          subtitle={t("forbidden_desc")}
          breadcrumbCurrent="Admin"
        />

        <div className="max-w-md mx-auto px-4 mt-16 text-center">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#c0a038] flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-montserrat font-bold text-xl text-[#11171d]">
              {t("forbidden_title")}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t("forbidden_desc")}
            </p>

            <button
              onClick={loginDemoAdmin}
              className="w-full btn-luxury-primary text-xs !py-3.5 shadow-md"
            >
              {t("forbidden_switch_admin")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Statistics
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
  const availableRoomsCount = rooms.filter((r) => r.status === "Available").length;

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchHotel = filterHotel === "all" || b.hotel_id === filterHotel;
    const matchSearch =
      searchTerm === "" ||
      b.booking_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_phone?.includes(searchTerm);
    return matchStatus && matchHotel && matchSearch;
  });

  const filteredRooms = rooms.filter((r) => {
    const matchHotel = filterHotel === "all" || r.hotel_id === filterHotel;
    return matchHotel;
  });

  const filteredPayments = payments.filter((p) => {
    const matchHotel = filterHotel === "all" || p.hotel_id === filterHotel;
    const matchSearch =
      searchTerm === "" ||
      p.transaction_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.booking_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchHotel && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <SubHeader
        title={t("admin_title")}
        subtitle={t("admin_subtitle")}
        breadcrumbCurrent={t("nav_admin")}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#c0a038] flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">
                {t("admin_total_bookings")}
              </span>
              <strong className="font-montserrat text-2xl text-[#11171d]">{totalBookings}</strong>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">
                {t("admin_revenue")}
              </span>
              <strong className="font-montserrat text-xl text-[#11171d]">{formatPrice(totalRevenue)}</strong>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">
                {t("admin_ready_rooms")}
              </span>
              <strong className="font-montserrat text-2xl text-[#11171d]">{availableRoomsCount} / {rooms.length}</strong>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">
                {t("admin_db_status")}
              </span>
              <strong className="text-sm font-semibold text-emerald-700 block">
                {isSupabaseConfigured ? "⚡ Supabase Cloud PostgreSQL" : "Local Mock Fallback"}
              </strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-gray-200 gap-6">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === "bookings" ? "text-[#c0a038]" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {t("admin_tab_bookings")} ({bookings.length})
            {activeTab === "bookings" && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#c0a038] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === "payments" ? "text-[#c0a038]" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {language === "vi" ? "Quản Lý Thanh Toán" : "Payments Ledger"} ({payments.length})
            {activeTab === "payments" && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#c0a038] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("rooms")}
            className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === "rooms" ? "text-[#c0a038]" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {t("admin_tab_rooms")} ({rooms.length})
            {activeTab === "rooms" && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#c0a038] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("sync")}
            className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === "sync" ? "text-[#c0a038]" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {t("admin_tab_seed")}
            {activeTab === "sync" && (
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#c0a038] rounded-full" />
            )}
          </button>
        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            {/* Filter toolbar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t("admin_search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#c0a038]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Hotel Branch Filter */}
                <select
                  value={filterHotel}
                  onChange={(e) => setFilterHotel(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs border border-gray-200 bg-white text-gray-700"
                >
                  <option value="all">{t("branch_all")}</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {localize(h, "name")}
                    </option>
                  ))}
                </select>

                {/* Status filter buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {["all", "Pending", "Confirmed", "Completed", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        filterStatus === st
                          ? "bg-[#c0a038] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {st === "all" ? t("all") : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600 border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-4">{language === "vi" ? "Mã Đơn" : "Code"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Khách Hàng" : "Guest"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Chi Nhánh & Hạng Phòng" : "Destination & Suite"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Phòng Cấp" : "Room"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Ngày Lưu Trú" : "Dates"}</th>
                    <th className="py-3 px-4">{t("total_price")}</th>
                    <th className="py-3 px-4">{t("status")}</th>
                    <th className="py-3 px-4 text-right">{t("action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-gray-900">{b.booking_code}</td>
                      <td className="py-4 px-4">
                        <strong className="text-gray-900 block">{b.customer_name}</strong>
                        <span className="text-gray-400">{b.customer_phone}</span>
                      </td>
                      <td className="py-4 px-4">
                        <strong className="text-gray-800 block">{b.room_type_name}</strong>
                        <span className="text-gray-400 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#c0a038]" /> {b.hotel_name || "Mosari Resort"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                          {b.room_number ? `P.${b.room_number}` : "Auto"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span>{b.check_in_date} ➔ {b.check_out_date}</span>
                        <span className="block text-gray-400">({t("night_count", { n: b.nights })})</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900">{formatPrice(b.total_price)}</td>
                      <td className="py-4 px-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                            b.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : b.status === "Completed"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : b.status === "Cancelled"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <option value="Pending">Pending (Chờ duyệt)</option>
                          <option value="Confirmed">Confirmed (Đã xác nhận)</option>
                          <option value="Completed">Completed (Hoàn tất)</option>
                          <option value="Cancelled">Cancelled (Đã hủy)</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {b.status === "Pending" && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, "Confirmed")}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-medium text-[11px] hover:bg-emerald-700 transition-colors"
                          >
                            {language === "vi" ? "Duyệt Nhanh" : "Approve"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBookings.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">
                  {language === "vi" ? "Không tìm thấy đơn đặt phòng nào phù hợp." : "No matching bookings found."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENTS LEDGER MANAGEMENT */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div>
                <h3 className="font-montserrat font-bold text-lg text-[#11171d] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#c0a038]" />
                  <span>{language === "vi" ? "Sổ Cái Giao Dịch Thanh Toán (public.payments)" : "Payment Transactions Ledger (public.payments)"}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {language === "vi"
                    ? "Đồng bộ 2 chiều tự động với bảng Bookings thông qua PostgreSQL Trigger (trg_sync_payment_to_booking)."
                    : "Bidirectionally synchronized with Bookings via PostgreSQL Trigger (trg_sync_payment_to_booking)."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={language === "vi" ? "Tìm mã GD (TXN-...), mã đơn..." : "Search TXN code, booking..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#c0a038]"
                  />
                </div>

                <select
                  value={filterHotel}
                  onChange={(e) => setFilterHotel(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs border border-gray-200 bg-white text-gray-700"
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

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600 border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-4">{language === "vi" ? "Mã Giao Dịch" : "Txn Code"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Mã Đặt Phòng" : "Booking Ref"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Khách Hàng" : "Guest"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Phương Thức & Cổng" : "Method & Provider"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Số Tiền" : "Amount"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Thời Gian TT" : "Paid At"}</th>
                    <th className="py-3 px-4">{language === "vi" ? "Trạng Thái TT" : "Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#c0a038]">{p.transaction_code}</td>
                      <td className="py-4 px-4 font-mono font-bold text-gray-900">{p.booking_code}</td>
                      <td className="py-4 px-4 font-medium text-gray-800">{p.customer_name}</td>
                      <td className="py-4 px-4">
                        <strong className="text-gray-900 block">{p.payment_method}</strong>
                        <span className="text-[11px] text-gray-400">{p.provider}</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900">{formatPrice(p.amount)}</td>
                      <td className="py-4 px-4 text-gray-500">
                        {p.paid_at ? new Date(p.paid_at).toLocaleString(language === "vi" ? "vi-VN" : "en-US") : "—"}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdatePaymentStatus(p.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                            p.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : p.status === "Refunded"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : p.status === "Failed"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <option value="Pending">Pending (Chờ TT)</option>
                          <option value="Completed">Completed (Đã thu tiền)</option>
                          <option value="Failed">Failed (Thất bại)</option>
                          <option value="Refunded">Refunded (Đã hoàn tiền)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPayments.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">
                  {language === "vi" ? "Chưa có giao dịch thanh toán nào." : "No payment transactions found."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ROOMS MANAGEMENT */}
        {activeTab === "rooms" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-montserrat font-bold text-lg text-[#11171d]">
                {t("admin_tab_rooms")}
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">{t("filter_by_branch")}:</span>
                <select
                  value={filterHotel}
                  onChange={(e) => setFilterHotel(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 bg-white text-gray-700"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredRooms.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-bold text-gray-900">
                        Phòng {r.room_number}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.status === "Available"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.status === "Maintenance"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    {r.hotel && (
                      <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#c0a038]" /> {r.hotel.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-semibold mb-1">
                      {t("admin_room_status")}:
                    </label>
                    <select
                      value={r.status}
                      onChange={(e) => handleUpdateRoomStatus(r.id, e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="Available">Available (Sẵn sàng)</option>
                      <option value="Maintenance">Maintenance (Bảo trì)</option>
                      <option value="Occupied">Occupied (Có khách)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SUPABASE SYNC & SEED */}
        {activeTab === "sync" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 max-w-2xl">
            <h3 className="font-montserrat font-bold text-lg text-[#11171d]">
              {t("admin_tab_seed")}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {language === "vi"
                ? "Nạp toàn bộ dữ liệu mẫu gồm 3 chi nhánh (Đà Nẵng, Phú Quốc, Nha Trang), 5 hạng phòng, 9 phòng vật lý và các đơn đặt phòng lên cơ sở dữ liệu Supabase PostgreSQL với ràng buộc chống trùng phòng GIST."
                : "Synchronize sample dataset including 3 branch resorts, 5 room types, 9 physical rooms, and sample reservations with PostgreSQL GIST anti-overlap constraint into Supabase Cloud."}
            </p>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>{language === "vi" ? "Chế độ CSDL hiện tại:" : "Database Status:"}</span>
                <strong className={isSupabaseConfigured ? "text-emerald-600 font-bold" : "text-amber-600"}>
                  {isSupabaseConfigured ? "⚡ Supabase Cloud PostgreSQL (zkzdotkppuklcbgsbtol)" : "Local Mock Store"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>{language === "vi" ? "Cơ chế chống trùng phòng:" : "Double-Booking Prevention:"}</span>
                <strong className="text-emerald-700 font-mono">PostgreSQL btree_gist [room_id, daterange)</strong>
              </div>
            </div>

            {seedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {seedSuccess}
              </div>
            )}

            <button
              onClick={handleSeedSupabase}
              disabled={seedLoading}
              className="btn-luxury-primary !py-3.5 !px-8 text-xs font-bold inline-flex items-center gap-2 shadow"
            >
              <RotateCw className={`w-4 h-4 ${seedLoading ? "animate-spin" : ""}`} />
              <span>{seedLoading ? t("admin_seeding") : t("admin_btn_seed")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
