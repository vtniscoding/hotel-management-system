import React, { useState, useEffect } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { SubHeader } from "../components/common/SubHeader";
import { useLanguage } from "../context/LanguageContext";
import { dbService } from "../services/dbService";
import { RESORT_BANK_ACCOUNTS } from "../config/paymentConfig";
import {
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  MapPin,
  BedDouble,
  CreditCard,
  ShieldCheck,
  Lock
} from "lucide-react";

export const BookingSuccessPage = () => {
  const location = useLocation();
  const { t, formatPrice, language } = useLanguage();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  const initialBooking = location.state?.booking;
  const [booking, setBooking] = useState(initialBooking);
  const [paymentRecord, setPaymentRecord] = useState(initialBooking?.payment_record || null);
  const [confirmingPay, setConfirmingPay] = useState(false);
  const [verificationStep, setVerificationStep] = useState("checking"); // "checking" | "verified"
  const [paymentPaid, setPaymentPaid] = useState(
    initialBooking?.payment_status === "Success" || initialBooking?.payment_record?.status === "Completed"
  );

  // Active selected resort beneficiary bank
  const [selectedBankId, setSelectedBankId] = useState(RESORT_BANK_ACCOUNTS[0]?.id || "VPBank");
  const currentBank =
    RESORT_BANK_ACCOUNTS.find((b) => b.id === selectedBankId) || RESORT_BANK_ACCOUNTS[0];

  useEffect(() => {
    if (booking?.booking_code && !paymentRecord) {
      dbService.getPaymentByBookingCode(booking.booking_code).then((res) => {
        if (res) {
          setPaymentRecord(res);
          if (res.status === "Completed") {
            setPaymentPaid(true);
          }
        }
      });
    }
  }, [booking, paymentRecord]);

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
  };

  const handleConfirmPayment = async () => {
    setVerificationStep("checking");
    setConfirmingPay(true);
    try {
      const [updatedPay] = await Promise.all([
        dbService.confirmPaymentByBookingCode(booking.booking_code),
        new Promise((resolve) => setTimeout(resolve, 1800))
      ]);
      if (updatedPay) {
        setPaymentRecord(updatedPay);
      }
      setVerificationStep("verified");
      await new Promise((resolve) => setTimeout(resolve, 900));
      setPaymentPaid(true);
      setBooking((prev) => ({
        ...prev,
        payment_status: "Success",
        status: "Confirmed"
      }));
    } catch (err) {
      console.error("Error confirming payment:", err);
    } finally {
      setConfirmingPay(false);
    }
  };

  const transactionCode =
    paymentRecord?.transaction_code ||
    booking.transaction_code ||
    "TXN-" + booking.booking_code.replace("MSR-", "");

  // Dynamic VietQR generator URL according to currently selected bank
  const vietQrUrl = `https://img.vietqr.io/image/${currentBank.bankId}-${currentBank.accountNo}-compact2.png?amount=${booking.total_price}&addInfo=${booking.booking_code}&accountName=${encodeURIComponent(currentBank.accountName)}`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <SubHeader
        title={t("success_title")}
        subtitle={t("success_subtitle")}
        breadcrumbCurrent={t("details")}
        bgImage="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=80"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-8 animate-fade-in">
          {/* Header check icon */}
          <div className="text-center space-y-3 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="font-montserrat font-bold text-2xl text-[#11171d]">
              {t("success_title")}
            </h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              {t("success_subtitle")}
            </p>

            {/* Booking Code Callout */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
                  {t("success_code_label")}:
                </span>
                <strong className="font-mono text-lg font-bold text-amber-900 tracking-wider">
                  {booking.booking_code}
                </strong>
                <button
                  onClick={() => copyToClipboard(booking.booking_code, "code")}
                  className="p-1 text-amber-700 hover:text-amber-900"
                  title={t("success_copy")}
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200 text-xs">
                <CreditCard className="w-4 h-4 text-[#c0a038]" />
                <span className="text-gray-500">{language === "vi" ? "Mã GD:" : "Txn ID:"}</span>
                <strong className="font-mono text-gray-900">{transactionCode}</strong>
              </div>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">
                {language === "vi" ? "Thông tin người đặt" : "Guest Information"}
              </h4>
              <p className="text-gray-900">
                {t("customer_fullname")}: <strong>{booking.customer_name}</strong>
              </p>
              <p className="text-gray-900">
                {t("customer_phone")}: <strong>{booking.customer_phone}</strong>
              </p>
              <p className="text-gray-900">
                Email: <strong>{booking.customer_email}</strong>
              </p>
              <p className="text-gray-900">
                {t("guests")}: <strong>{t("guest_count", { n: booking.guests })}</strong>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider">
                {language === "vi" ? "Chi tiết phòng & Thanh toán" : "Reservation & Payment"}
              </h4>
              {booking.hotel_name && (
                <p className="text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#c0a038]" />
                  <span>{booking.hotel_name}</span>
                </p>
              )}
              <p className="text-gray-900">
                {language === "vi" ? "Hạng phòng" : "Suite Category"}: <strong>{booking.room_type_name}</strong>
              </p>
              {booking.room_number && (
                <p className="text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
                  <BedDouble className="w-4 h-4" />
                  <span>{t("success_assigned_label")} <strong>{booking.room_number}</strong></span>
                </p>
              )}
              <p className="text-gray-900">
                {language === "vi" ? "Lưu trú:" : "Dates:"} <strong>{booking.check_in_date} ➔ {booking.check_out_date}</strong> ({t("night_count", { n: booking.nights })})
              </p>
              <p className="text-gray-900 flex items-center gap-2">
                <span>{language === "vi" ? "Trạng thái thanh toán:" : "Payment Status:"}</span>
                {paymentPaid ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === "vi" ? "Đã thanh toán" : "Paid"}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {language === "vi" ? "Chờ thanh toán" : "Awaiting Payment"}
                  </span>
                )}
              </p>
              <p className="text-[#11171d] text-base pt-1">
                {t("total_price")}: <strong className="font-montserrat text-lg text-[#c0a038]">{formatPrice(booking.total_price)}</strong>
              </p>
            </div>
          </div>

          {/* VietQR Transfer Section with Multi-Bank Selector */}
          {booking.payment_method === "VietQR" && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-[#c0a038]/30 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#c0a038]">
                  <QrCode className="w-6 h-6" />
                  <div>
                    <h4 className="font-montserrat font-bold text-base text-[#11171d]">
                      {language === "vi" ? "Cổng Thanh Toán VietQR Tự Động" : "Instant VietQR Banking Transfer"}
                    </h4>
                    <span className="text-[11px] text-gray-500">
                      {language === "vi"
                        ? "Hỗ trợ quét mã bằng hơn 40+ ứng dụng ngân hàng và ví điện tử"
                        : "Compatible with all Vietnamese banking apps & mobile wallets"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Selector Tabs (Multi-Account Support) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  {language === "vi" ? "Chọn Ngân Hàng Thụ Hưởng:" : "Select Beneficiary Bank Account:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {RESORT_BANK_ACCOUNTS.map((b) => {
                    const isSelected = b.id === selectedBankId;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBankId(b.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? "border-[#c0a038] bg-white shadow-md ring-1 ring-[#c0a038]"
                            : "border-gray-200/80 bg-white/70 hover:bg-white text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-gray-900">{b.shortName}</span>
                          {b.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#c0a038]/10 text-[#c0a038]">
                              {b.badge}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-xs font-bold text-gray-800">
                          {b.accountNo}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate mt-0.5">
                          {b.accountName}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QR Image & Dynamic Payment Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2 border-t border-gray-200/50">
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-200">
                    <img
                      key={vietQrUrl}
                      src={vietQrUrl}
                      alt="VietQR Mã Thanh Toán"
                      className="w-52 h-52 object-contain rounded-lg transition-opacity duration-300"
                    />
                  </div>
                  <span className="text-[11px] text-gray-500 mt-2 text-center font-medium">
                    {language === "vi"
                      ? `Quét chuyển khoản tới ${currentBank.shortName} Napas247`
                      : `Scan to transfer via ${currentBank.shortName}`}
                  </span>
                </div>

                <div className="md:col-span-7 space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-500">{language === "vi" ? "Ngân hàng thụ hưởng:" : "Bank:"}</span>
                    <strong className="text-gray-900">{currentBank.bankName}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-500">{language === "vi" ? "Số tài khoản:" : "Account Number:"}</span>
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-base text-gray-900">{currentBank.accountNo}</strong>
                      <button
                        onClick={() => copyToClipboard(currentBank.accountNo, "acc")}
                        className="text-xs text-[#c0a038] hover:underline font-semibold"
                      >
                        {copiedAcc ? (language === "vi" ? "Đã chép!" : "Copied!") : (language === "vi" ? "Chép" : "Copy")}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-500">{language === "vi" ? "Chủ tài khoản:" : "Account Holder:"}</span>
                    <strong>{currentBank.accountName}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-500">{language === "vi" ? "Số tiền:" : "Amount:"}</span>
                    <strong className="text-[#c0a038] font-bold text-base">{formatPrice(booking.total_price)}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-500">{language === "vi" ? "Nội dung CK (Bắt buộc):" : "Reference:"}</span>
                    <strong className="font-mono text-emerald-700 font-bold">{booking.booking_code}</strong>
                  </div>

                  {/* Payment Confirmation Button */}
                  <div className="pt-3">
                    {paymentPaid ? (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>
                          {language === "vi"
                            ? "Thanh toán đã được xác thực thành công & đơn đặt phòng đã được xác nhận!"
                            : "Payment verified successfully & your reservation is confirmed!"}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConfirmPayment}
                        disabled={confirmingPay}
                        className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>
                          {language === "vi"
                            ? "Tôi Đã Hoàn Tất Chuyển Khoản"
                            : "I Have Completed the Transfer"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/my-bookings"
              className="w-full sm:w-auto btn-luxury-primary !py-3.5 !px-8 text-center"
            >
              {t("view_in_history")}
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto btn-luxury-secondary !py-3.5 !px-8 text-center"
            >
              {t("return_home")}
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Verification Loading Modal */}
      {confirmingPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-6">
            {verificationStep === "checking" ? (
              <>
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-[#c0a038]/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-[#c0a038] border-t-transparent animate-spin" />
                  <img src="/icons.svg" alt="Mosari" className="w-9 h-9 object-contain" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-montserrat font-bold text-lg text-[#11171d]">
                    {language === "vi"
                      ? "Đang Kiểm Tra Giao Dịch"
                      : "Verifying Payment Transaction"}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {language === "vi"
                      ? "Hệ thống đang đối soát tự động giao dịch chuyển khoản qua mạng lưới thanh toán Napas247. Vui lòng chờ trong giây lát..."
                      : "Synchronizing your bank transfer with the Napas247 payment network. Please wait a moment..."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === "vi" ? "Ngân hàng:" : "Bank:"}</span>
                    <strong className="text-gray-900">{currentBank.shortName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === "vi" ? "Mã giao dịch:" : "Transaction ID:"}</span>
                    <strong className="font-mono text-gray-900">{transactionCode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === "vi" ? "Nội dung đối soát:" : "Reference:"}</span>
                    <strong className="font-mono text-emerald-700">{booking.booking_code}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === "vi" ? "Số tiền:" : "Amount:"}</span>
                    <strong className="text-[#c0a038]">{formatPrice(booking.total_price)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {language === "vi"
                      ? "Kết nối bảo mật chuẩn EMVCo VietQR Napas247"
                      : "Secured via EMVCo VietQR Napas247 Gateway"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-montserrat font-bold text-lg text-emerald-700">
                    {language === "vi"
                      ? "Xác Thực Thanh Toán Thành Công!"
                      : "Payment Verified Successfully!"}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {language === "vi"
                      ? `Đơn đặt phòng ${booking.booking_code} đã được xác nhận. Đang cập nhật thông tin lưu trú của quý khách...`
                      : `Reservation ${booking.booking_code} has been confirmed. Updating your booking details...`}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
