import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { Menu, X, User, LogOut, Shield, CalendarCheck, Globe } from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const { currentUser, isAdmin, isStaff, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav_home"), path: "/" },
    { name: t("nav_rooms"), path: "/rooms" },
    { name: t("nav_booking"), path: "/booking" },
    { name: t("nav_services"), path: "/services" },
    { name: t("nav_my_bookings"), path: "/my-bookings" }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#11171d]/95 backdrop-blur-md py-3 shadow-xl border-b border-white/5"
          : "bg-[#11171d]/85 backdrop-blur-sm py-4 border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/icons.svg"
              alt="Mosari Resort & Spa"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col leading-none">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[3.5px] logo-text">
                {t("brand_name")}
              </span>
              <span className="font-montserrat text-[9px] font-light tracking-[4px] text-white/90 uppercase mt-0.5">
                {t("brand_sub")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase tracking-[1.5px] font-medium transition-all duration-300 relative py-1 ${
                  isActive(link.path)
                    ? "text-[#c0a038] font-semibold"
                    : "text-white/85 hover:text-[#c0a038]"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c0a038] rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Action / Language / Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white/90 font-semibold tracking-wider transition-all duration-200 hover:border-[#c0a038]/50"
              title="Switch language VN / EN"
            >
              <Globe className="w-3.5 h-3.5 text-[#c0a038]" />
              <span>{lang === "vi" ? "🇻🇳 VN" : "🇬🇧 EN"}</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white"
                >
                  <div className="w-7 h-7 rounded-full bg-[#c0a038]/20 border border-[#c0a038]/40 flex items-center justify-center text-[#c0a038]">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium max-w-[120px] truncate">
                    {currentUser.full_name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1a252f] rounded-2xl shadow-2xl border border-white/10 py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs text-white/50">{t("nav_signed_in_as")}</p>
                      <p className="text-sm font-semibold text-white truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full bg-[#c0a038]/20 text-[#c0a038] font-bold uppercase tracking-wider">
                        {currentUser.role}
                      </span>
                    </div>

                    {(isAdmin || isStaff) && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-300 hover:bg-white/5 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        {t("nav_admin")}
                      </Link>
                    )}

                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/80 hover:bg-white/5 transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      {t("history_title")}
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-white/5 transition-colors border-t border-white/10 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("nav_logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth"
                  className="text-xs uppercase tracking-wider text-white/80 hover:text-white px-3 py-2 transition-colors"
                >
                  {t("nav_login")}
                </Link>
                <Link
                  to="/booking"
                  className="btn-luxury-primary text-xs !py-2.5 !px-5"
                >
                  {t("nav_book_now")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/90 font-semibold flex items-center gap-1"
              aria-label="Toggle Language"
            >
              <span>{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#11171d]/98 border-t border-white/10 px-4 pt-4 pb-6 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm uppercase tracking-wider font-medium ${
                isActive(link.path)
                  ? "bg-[#c0a038]/20 text-[#c0a038]"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {(isAdmin || isStaff) && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm text-amber-300 bg-amber-500/10 font-medium"
            >
              🛡️ {t("nav_admin")}
            </Link>
          )}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 text-xs text-white/60">
                  {t("nav_hello")}, <strong className="text-white">{currentUser.full_name}</strong>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  {t("nav_logout")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm text-white border border-white/20 rounded-full"
                >
                  {t("nav_login")}
                </Link>
                <Link
                  to="/booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-white bg-[#c0a038] rounded-full shadow-md"
                >
                  {t("nav_book_now")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
