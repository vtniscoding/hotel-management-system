import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SubHeader } from "../components/common/SubHeader";
import { useLanguage } from "../context/LanguageContext";
import { Shield, User, Mail, Lock, Phone, AlertCircle, CheckCircle } from "lucide-react";

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { currentUser, login, register, loginDemoAdmin, logout, loading, isAdmin, isStaff } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || (isAdmin || isStaff ? "/admin" : "/");

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isRegister) {
        await register(fullName, email, phone, password);
        setSuccessMsg(language === "vi" ? "Tạo tài khoản thành công!" : "Account created successfully!");
        setTimeout(() => {
          navigate(redirectPath);
        }, 1200);
      } else {
        const user = await login(email, password);
        const destination = location.state?.from || (user.role === "admin" || user.role === "employee" ? "/admin" : "/");
        navigate(destination);
      }
    } catch (err) {
      setErrorMsg(err.message || (language === "vi" ? "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin!" : "Authentication failed. Please verify credentials!"));
    }
  };

  // 1-Click Demo Admin Login
  const handleAdminDemoLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await loginDemoAdmin();
      navigate(location.state?.from || "/admin");
    } catch (err) {
      setErrorMsg((language === "vi" ? "Không thể đăng nhập Admin: " : "Cannot sign in as Admin: ") + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <SubHeader
        title={isRegister ? t("auth_register_tab") : t("auth_login_tab")}
        subtitle={
          language === "vi"
            ? "Quản lý kỳ nghỉ dưỡng và các đặc quyền thượng lưu tại Mosari Resort & Spa với Supabase Auth."
            : "Manage your luxury reservations and exclusive privileges with Supabase Auth."
        }
        breadcrumbCurrent={isRegister ? t("auth_register_tab") : t("auth_login_tab")}
        bgImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
      />

      <div className="max-w-md mx-auto px-4 mt-12 space-y-6">
        {/* Banner from Protected Route Redirection */}
        {location.state?.from && !currentUser && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3 animate-fade-in shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-bold">{language === "vi" ? "Yêu cầu đăng nhập" : "Sign In Required"}</p>
              <p className="text-[11px] text-amber-700">
                {language === "vi"
                  ? `Bạn cần đăng nhập để truy cập trang ${location.state.from}.`
                  : `Please sign in to proceed to ${location.state.from}.`}
              </p>
            </div>
          </div>
        )}

        {/* Already Logged In Card */}
        {currentUser && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-5 animate-fade-in text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-lg text-gray-900">
                {t("auth_already_logged_in")}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {t("nav_signed_in_as")}: <strong>{currentUser.email}</strong>
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#c0a038]/10 text-[#c0a038] border border-[#c0a038]/30">
                {t("nav_role")}: {currentUser.role}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              {isAdmin || isStaff ? (
                <Link
                  to="/admin"
                  className="w-full btn-luxury-primary !py-3 text-xs flex items-center justify-center gap-2 shadow"
                >
                  <Shield className="w-4 h-4" />
                  {t("auth_go_admin")}
                </Link>
              ) : (
                <Link
                  to="/my-bookings"
                  className="w-full btn-luxury-primary !py-3 text-xs flex items-center justify-center gap-2 shadow"
                >
                  {t("auth_go_history")}
                </Link>
              )}

              <button
                onClick={logout}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
              >
                {t("nav_logout")}
              </button>
            </div>
          </div>
        )}

        {/* Login / Register Card */}
        {!currentUser && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-6">
            {/* Supabase Engine Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Auth Connected
              </span>
              <span className="text-gray-400 font-mono text-[10px]">PostgreSQL RLS</span>
            </div>

            {/* Tabs */}
            <div className="flex rounded-2xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  !isRegister ? "bg-white text-[#11171d] shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t("auth_login_tab")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  isRegister ? "bg-white text-[#11171d] shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t("auth_register_tab")}
              </button>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-[#c0a038]/30 text-center space-y-2">
              <span className="text-[11px] text-amber-900 font-semibold uppercase tracking-wider block">
                {t("auth_demo_title")}
              </span>
              <button
                type="button"
                onClick={handleAdminDemoLogin}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-xl bg-[#c0a038] hover:bg-[#8d762c] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow disabled:opacity-50"
              >
                <Shield className="w-4 h-4" />
                {t("auth_demo_btn")}
              </button>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t("customer_fullname")}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn An"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t("customer_phone")}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="0901234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin.mosari@gmail.com / user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  {language === "vi" ? "Mật khẩu" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder={language === "vi" ? "Tối thiểu 6 ký tự..." : "Minimum 6 characters..."}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-luxury-primary !py-3.5 text-sm font-semibold shadow-md mt-2 disabled:opacity-50"
              >
                {loading
                  ? (language === "vi" ? "Đang xử lý..." : "Processing...")
                  : isRegister
                  ? (language === "vi" ? "Tạo Tài Khoản Mới" : "Create Account")
                  : (language === "vi" ? "Đăng Nhập" : "Sign In")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
