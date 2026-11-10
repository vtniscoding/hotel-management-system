import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages
import { HomePage } from "./pages/HomePage";
import { RoomsPage } from "./pages/RoomsPage";
import { RoomDetailPage } from "./pages/RoomDetailPage";
import { BookingPage } from "./pages/BookingPage";
import { BookingSuccessPage } from "./pages/BookingSuccessPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { AuthPage } from "./pages/AuthPage";
import { AdminPage } from "./pages/AdminPage";

export const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/rooms/:id" element={<RoomDetailPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/booking-success" element={<BookingSuccessPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Booking History & Lookup */}
                <Route path="/my-bookings" element={<MyBookingsPage />} />

                {/* Protected Route: Admin & Staff Area */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "employee"]}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
