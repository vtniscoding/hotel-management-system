import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { MapPin, Phone, Mail, Globe, Facebook, Instagram, CreditCard } from "lucide-react";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { t, isEn } = useLanguage();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#11171d] text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-14 border-b border-white/10">
          <div className="lg:col-span-6">
            <h4 className="text-xl font-montserrat font-semibold text-white mb-2">
              {isEn ? "Subscribe for Exclusive Privileges" : "Đăng ký nhận bản tin đặc quyền"}
            </h4>
            <p className="text-sm text-white/60">
              {isEn
                ? "Receive an immediate 20% privilege on your premier stay and curated invitations to seasonal culinary festivals."
                : "Nhận ngay ưu đãi độc quyền 20% cho kỳ nghỉ đầu tiên và các chương trình tri ân thượng lưu."}
            </p>
          </div>
          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isEn ? "Enter your email address..." : "Nhập địa chỉ email của bạn..."}
                className="flex-grow px-5 py-3.5 rounded-full bg-white/95 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0a038]"
              />
              <button
                type="submit"
                className="btn-luxury-primary whitespace-nowrap !py-3.5"
              >
                {subscribed ? (isEn ? "Subscribed! ✓" : "Đã Đăng Ký! ✓") : (isEn ? "Subscribe Now" : "Đăng Ký Ngay")}
              </button>
            </form>
          </div>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-14">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/icons.svg"
                alt="Mosari Resort & Spa"
                className="w-9 h-9 object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="font-cinzel text-xl font-bold tracking-[3px] logo-text">
                  MOSARI
                </span>
                <span className="font-montserrat text-[8px] font-light tracking-[3px] text-white/80 uppercase">
                  {t("brand_sub")}
                </span>
              </div>
            </div>
            <p className="text-sm text-white/65 leading-relaxed italic pr-4">
              "{t("footer_desc")}"
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#c0a038] hover:text-white text-white/70 flex items-center justify-center transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#c0a038] hover:text-white text-white/70 flex items-center justify-center transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#c0a038] hover:text-white text-white/70 flex items-center justify-center transition-all duration-300">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h5 className="font-public font-semibold text-white tracking-wider text-sm uppercase mb-4">
              {t("footer_quick_links")}
            </h5>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li><Link to="/" className="hover:text-[#c0a038] transition-colors">{t("nav_home")}</Link></li>
              <li><Link to="/rooms" className="hover:text-[#c0a038] transition-colors">{t("nav_rooms")}</Link></li>
              <li><Link to="/services" className="hover:text-[#c0a038] transition-colors">{t("nav_services")}</Link></li>
              <li><Link to="/booking" className="hover:text-[#c0a038] transition-colors">{t("nav_booking")}</Link></li>
              <li><Link to="/my-bookings" className="hover:text-[#c0a038] transition-colors">{t("nav_my_bookings")}</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-3">
            <h5 className="font-public font-semibold text-white tracking-wider text-sm uppercase mb-4">
              {isEn ? "Customer Support" : "Hỗ Trợ Khách Hàng"}
            </h5>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li><a href="#" className="hover:text-[#c0a038] transition-colors">{isEn ? "Terms & Conditions" : "Điều khoản & Điều kiện"}</a></li>
              <li><a href="#" className="hover:text-[#c0a038] transition-colors">{isEn ? "Privacy Policy" : "Chính sách bảo mật"}</a></li>
              <li><a href="#" className="hover:text-[#c0a038] transition-colors">{isEn ? "Cancellation Policies" : "Quy định hoàn / hủy phòng"}</a></li>
              <li><a href="#" className="hover:text-[#c0a038] transition-colors">{isEn ? "Frequently Asked Questions (FAQ)" : "Câu hỏi thường gặp (FAQ)"}</a></li>
              <li><a href="#" className="hover:text-[#c0a038] transition-colors">{isEn ? "VietQR Direct Wire Guide" : "Hướng dẫn chuyển khoản VietQR"}</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3">
            <h5 className="font-public font-semibold text-white tracking-wider text-sm uppercase mb-4">
              {t("footer_contact")}
            </h5>
            <ul className="space-y-3.5 text-sm text-white/65">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#c0a038] flex-shrink-0 mt-0.5" />
                <span>{isEn ? "Vo Nguyen Giap St, Ngu Hanh Son, Da Nang City, Vietnam" : "123 Đường Biển, Quận Sơn Trà, TP. Đà Nẵng, Việt Nam"}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#c0a038] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>{isEn ? "Concierge Desk:" : "Hotline tư vấn:"} <strong>0236 3999 888</strong></span>
                  <span>{isEn ? "24/7 Hotline:" : "CSKH 24/7:"} <strong>1900 1234</strong></span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#c0a038] flex-shrink-0" />
                <span>reservation@mosariresort.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Payment Methods */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 Mosari Resort & Spa. {t("footer_rights")}</p>
          <div className="flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10">
              <CreditCard className="w-3.5 h-3.5 text-[#c0a038]" /> Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
              VietQR 24/7
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
