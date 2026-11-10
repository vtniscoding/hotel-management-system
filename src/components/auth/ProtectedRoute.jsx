import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert, Sparkles, ArrowLeft, LogOut, ShieldCheck } from "lucide-react";

/**
 * ProtectedRoute Component
 * Guards routes requiring authentication or specific user roles (RBAC).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string[]} [props.allowedRoles] - Roles allowed (e.g., ['admin', 'employee']). If omitted, all authenticated users are allowed.
 * @param {string} [props.redirectTo] - Fallback redirection path when not authenticated (default: '/auth').
 */
export const ProtectedRoute = ({
  children,
  allowedRoles = null,
  redirectTo = "/auth"
}) => {
  const { currentUser, loading, logout, loginDemoAdmin } = useAuth();
  const location = useLocation();

  // 1. Loading State - Keep user on elegant loading screen while session is being verified
  if (loading) {
    return (
      <div className="min-h-screen bg-[#11171d] flex flex-col items-center justify-center text-white px-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#c0a038]/30 border-t-[#c0a038] animate-spin" />
          <Sparkles className="w-6 h-6 text-[#c0a038] absolute animate-pulse" />
        </div>
        <p className="mt-6 font-cinzel text-lg tracking-[2px] text-white/90">
          MOSARI RESORT
        </p>
        <p className="text-xs text-white/50 tracking-wider uppercase mt-1">
          Đang kiểm tra quyền truy cập...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State - Redirect to login with location memory
  if (!currentUser) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // 3. Role-Based Access Control (RBAC) Check
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] pt-28 pb-20 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
              Mã lỗi: 403 Forbidden
            </span>
            <h2 className="font-montserrat font-bold text-2xl text-[#11171d] pt-2">
              Quyền Truy Cập Bị Giới Hạn
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
              Tài khoản <strong>{currentUser.email}</strong> đang mang quyền{" "}
              <span className="text-[#c0a038] font-bold uppercase">{currentUser.role}</span>.
              Bạn không có đặc quyền truy cập trang quản trị này.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs space-y-1.5 text-gray-600">
            <p className="font-semibold text-gray-800">Yêu cầu quyền truy cập:</p>
            <p>• Vai trò hợp lệ: <strong>{allowedRoles.join(" hoặc ")}</strong></p>
            <p>• Để thử nghiệm, bạn có thể chuyển sang tài khoản Admin Demo bằng nút bên dưới.</p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={loginDemoAdmin}
              className="w-full btn-luxury-primary !py-3 text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              Chuyển Sang Quyền Admin Demo (1-Click)
            </button>

            <div className="flex gap-3">
              <Link
                to="/"
                className="flex-1 py-3 px-4 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Về Trang Chủ
              </Link>
              <button
                onClick={logout}
                className="py-3 px-4 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized - Render requested component
  return children;
};

