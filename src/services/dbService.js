import { supabase, isSupabaseConfigured } from "../config/supabase";
import {
  SEED_HOTELS,
  SEED_ROOM_TYPES,
  SEED_ROOMS,
  SEED_BOOKINGS,
  SEED_PAYMENTS
} from "../data/seedData";

const STORAGE_KEYS = {
  HOTELS: "mosari_hotels",
  ROOM_TYPES: "mosari_room_types",
  ROOMS: "mosari_rooms",
  BOOKINGS: "mosari_bookings",
  PAYMENTS: "mosari_payments"
};

// Initialize LocalStorage with seed data if empty
const initLocalStorage = () => {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.HOTELS)) {
      localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(SEED_HOTELS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROOM_TYPES)) {
      localStorage.setItem(STORAGE_KEYS.ROOM_TYPES, JSON.stringify(SEED_ROOM_TYPES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(SEED_ROOMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(SEED_PAYMENTS));
    }
  } catch (err) {
    console.warn("LocalStorage init warning:", err);
  }
};

initLocalStorage();

/**
 * Check if two date ranges [start1, end1) and [start2, end2) overlap
 */
export const isDateRangeOverlapping = (start1, end1, start2, end2) => {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  return s1 < e2 && e1 > s2;
};

export const dbService = {
  // Check active cloud mode
  isCloudMode() {
    return isSupabaseConfigured && supabase !== null;
  },

  // 1. GET ALL HOTELS / BRANCHES
  async getHotels() {
    if (this.isCloudMode()) {
      try {
        const { data, error } = await supabase
          .from("hotels")
          .select("*")
          .order("code", { ascending: true });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn("Supabase fetch hotels warning, using local fallback:", err);
      }
    }

    try {
      const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOTELS) || "[]");
      return local.length > 0 ? local : SEED_HOTELS;
    } catch {
      return SEED_HOTELS;
    }
  },

  // 2. GET ALL ROOM TYPES (With real-time availability calculation based on overlapping bookings)
  async getRoomTypes(filters = {}) {
    const { hotelId, checkIn, checkOut, capacity } = filters;

    if (this.isCloudMode()) {
      try {
        // Query room types
        let typeQuery = supabase.from("room_types").select("*");
        if (hotelId && hotelId !== "all") {
          typeQuery = typeQuery.eq("hotel_id", hotelId);
        }
        const { data: cloudTypes, error: typeErr } = await typeQuery;

        // Query physical rooms
        let roomQuery = supabase.from("rooms").select("*");
        if (hotelId && hotelId !== "all") {
          roomQuery = roomQuery.eq("hotel_id", hotelId);
        }
        const { data: cloudRooms, error: _roomErr } = await roomQuery;

        // Query active bookings if dates are provided
        let activeBookings = [];
        if (checkIn && checkOut) {
          const { data: bookingsData } = await supabase
            .from("bookings")
            .select("room_id, room_type_id, check_in_date, check_out_date, status")
            .in("status", ["Pending", "Confirmed"]);
          activeBookings = bookingsData || [];
        }

        if (!typeErr && cloudTypes && cloudTypes.length > 0) {
          const allRooms = cloudRooms || [];
          return cloudTypes
            .filter((t) => (!capacity || capacity === "all" ? true : t.capacity >= Number(capacity)))
            .map((typeData) => {
              const physicalRooms = allRooms.filter((r) => r.room_type_id === typeData.id);
              const maintenanceCount = physicalRooms.filter((r) => r.status === "Maintenance").length;
              const operationalRooms = physicalRooms.filter((r) => r.status === "Available");

              let availableCount = operationalRooms.length;

              // If dates provided, exclude physical rooms already booked during this timeframe
              if (checkIn && checkOut) {
                const bookedRoomIds = new Set();
                activeBookings.forEach((b) => {
                  if (
                    b.room_id &&
                    isDateRangeOverlapping(b.check_in_date, b.check_out_date, checkIn, checkOut)
                  ) {
                    bookedRoomIds.add(b.room_id);
                  }
                });

                const freeRooms = operationalRooms.filter((r) => !bookedRoomIds.has(r.id));
                availableCount = freeRooms.length;
              }

              return {
                ...typeData,
                name: typeData.name_vi,
                description: typeData.description_vi,
                long_description: typeData.long_description_vi,
                amenities: typeData.amenities_vi,
                available_count: availableCount,
                maintenance_count: maintenanceCount,
                total_physical_count: physicalRooms.length
              };
            });
        }
      } catch (err) {
        console.warn("Supabase getRoomTypes error, falling back to local:", err);
      }
    }

    // Local Storage / Seed Fallback
    const localTypes = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOM_TYPES) || "[]");
    const localRooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || "[]");
    const localBookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || "[]");

    const types = localTypes.length > 0 ? localTypes : SEED_ROOM_TYPES;
    const rooms = localRooms.length > 0 ? localRooms : SEED_ROOMS;

    return types
      .filter((t) => (!hotelId || hotelId === "all" ? true : t.hotel_id === hotelId))
      .filter((t) => (!capacity || capacity === "all" ? true : t.capacity >= Number(capacity)))
      .map((t) => {
        const physicalRooms = rooms.filter((r) => r.room_type_id === t.id);
        const operationalRooms = physicalRooms.filter((r) => r.status === "Available");
        const maintenanceCount = physicalRooms.filter((r) => r.status === "Maintenance").length;

        let availableCount = operationalRooms.length;

        if (checkIn && checkOut) {
          const bookedRoomIds = new Set();
          localBookings
            .filter((b) => b.status === "Pending" || b.status === "Confirmed")
            .forEach((b) => {
              if (
                b.room_id &&
                isDateRangeOverlapping(b.check_in_date, b.check_out_date, checkIn, checkOut)
              ) {
                bookedRoomIds.add(b.room_id);
              }
            });

          const freeRooms = operationalRooms.filter((r) => !bookedRoomIds.has(r.id));
          availableCount = freeRooms.length;
        }

        return {
          ...t,
          available_count: availableCount,
          maintenance_count: maintenanceCount,
          total_physical_count: physicalRooms.length
        };
      });
  },

  // 3. GET SINGLE ROOM TYPE BY ID
  async getRoomTypeById(id) {
    const all = await this.getRoomTypes();
    return all.find((t) => String(t.id) === String(id)) || null;
  },

  // 4. GET PHYSICAL ROOMS (For Admin Room Management)
  async getRooms(hotelId) {
    if (this.isCloudMode()) {
      try {
        let query = supabase.from("rooms").select("*").order("room_number", { ascending: true });
        if (hotelId && hotelId !== "all") {
          query = query.eq("hotel_id", hotelId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn("Supabase getRooms warning:", err);
      }
    }
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || "[]");
    return local.length > 0 ? local : SEED_ROOMS;
  },

  // 5. FIND AVAILABLE PHYSICAL ROOM FOR DATES (Anti-Conflict Allocation)
  async findAvailablePhysicalRoom(roomTypeId, hotelId, checkIn, checkOut) {
    if (this.isCloudMode()) {
      try {
        // Query candidate physical rooms
        let query = supabase
          .from("rooms")
          .select("*")
          .eq("room_type_id", roomTypeId)
          .eq("status", "Available");

        if (hotelId && hotelId !== "all") {
          query = query.eq("hotel_id", hotelId);
        }
        const { data: candidates } = await query;

        if (!candidates || candidates.length === 0) return null;

        // Query overlapping active bookings
        const { data: activeBookings } = await supabase
          .from("bookings")
          .select("room_id, check_in_date, check_out_date, status")
          .in("status", ["Pending", "Confirmed"]);

        const bookedRoomIds = new Set();
        (activeBookings || []).forEach((b) => {
          if (
            b.room_id &&
            isDateRangeOverlapping(b.check_in_date, b.check_out_date, checkIn, checkOut)
          ) {
            bookedRoomIds.add(b.room_id);
          }
        });

        const freeRoom = candidates.find((r) => !bookedRoomIds.has(r.id));
        return freeRoom || null;
      } catch (err) {
        console.warn("Supabase findAvailablePhysicalRoom fallback:", err);
      }
    }

    // Local fallback
    const localRooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || "[]");
    const localBookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || "[]");

    const candidates = localRooms.filter(
      (r) =>
        r.room_type_id === roomTypeId &&
        r.status === "Available" &&
        (!hotelId || hotelId === "all" || r.hotel_id === hotelId)
    );

    const bookedRoomIds = new Set();
    localBookings
      .filter((b) => b.status === "Pending" || b.status === "Confirmed")
      .forEach((b) => {
        if (
          b.room_id &&
          isDateRangeOverlapping(b.check_in_date, b.check_out_date, checkIn, checkOut)
        ) {
          bookedRoomIds.add(b.room_id);
        }
      });

    const free = candidates.find((r) => !bookedRoomIds.has(r.id));
    return free || null;
  },

  // 6. CREATE NEW BOOKING (Double-Booking Protected)
  async createBooking(bookingData) {
    const { room_type_id, hotel_id, check_in_date, check_out_date } = bookingData;

    // Validate dates
    if (new Date(check_out_date) <= new Date(check_in_date)) {
      throw new Error("INVALID_DATE_RANGE");
    }

    // Step A: Find available physical room
    const targetHotelId = hotel_id || "h_danang";
    const availableRoom = await this.findAvailablePhysicalRoom(
      room_type_id,
      targetHotelId,
      check_in_date,
      check_out_date
    );

    if (!availableRoom) {
      // 409 Conflict: All physical rooms booked for this date range
      const error = new Error("ROOM_UNAVAILABLE_FOR_DATES");
      error.code = "409_CONFLICT";
      throw error;
    }

    // Generate unique booking reference: MSR-XXXXXX
    const bookingCode = "MSR-" + Math.floor(100000 + Math.random() * 900000);

    const newBooking = {
      booking_code: bookingCode,
      hotel_id: targetHotelId,
      room_type_id: room_type_id,
      room_id: availableRoom.id,
      room_number: availableRoom.room_number,
      room_type_name: bookingData.room_type_name || "Mosari Luxury Suite",
      user_id: bookingData.user_id || null,
      customer_name: bookingData.customer_name.trim(),
      customer_phone: bookingData.customer_phone.trim(),
      customer_email: bookingData.customer_email.trim(),
      check_in_date: check_in_date,
      check_out_date: check_out_date,
      nights: Number(bookingData.nights) || 1,
      guests: Number(bookingData.guests) || 2,
      total_price: Number(bookingData.total_price) || 0,
      payment_method: bookingData.payment_method || "VietQR",
      payment_status: bookingData.payment_method === "Credit Card" ? "Success" : "Pending",
      status: "Pending",
      special_requests: bookingData.special_requests || "",
      created_at: new Date().toISOString()
    };

    if (this.isCloudMode()) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .insert([newBooking])
          .select()
          .single();

        if (error) {
          // Check if PostgreSQL GIST exclusion constraint violated (code 23P01)
          if (error.code === "23P01" || error.message.includes("no_overlapping_room_bookings")) {
            const conflictErr = new Error("ROOM_UNAVAILABLE_FOR_DATES");
            conflictErr.code = "409_CONFLICT";
            throw conflictErr;
          }
          throw error;
        }

        // Fetch the auto-generated payment record created by PostgreSQL trigger
        const { data: paymentRow } = await supabase
          .from("payments")
          .select("*")
          .eq("booking_id", data.id)
          .maybeSingle();

        return {
          ...data,
          transaction_code: paymentRow?.transaction_code || ("TXN-" + data.booking_code.replace("MSR-", "")),
          payment_record: paymentRow || null
        };
      } catch (err) {
        if (err.code === "409_CONFLICT" || err.message === "ROOM_UNAVAILABLE_FOR_DATES") {
          throw err;
        }
        console.warn("Supabase insert booking exception, writing locally:", err);
      }
    }

    // Local storage persistence
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || "[]");
    const savedBookingId = "b_" + Date.now();
    const txnCode = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    const savedBooking = {
      id: savedBookingId,
      ...newBooking,
      transaction_code: txnCode
    };
    bookings.unshift(savedBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Also save payment record locally
    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || "[]");
    const newPayment = {
      id: "p_" + Date.now(),
      transaction_code: txnCode,
      booking_id: savedBookingId,
      booking_code: newBooking.booking_code,
      hotel_id: newBooking.hotel_id,
      user_id: newBooking.user_id,
      customer_name: newBooking.customer_name,
      amount: newBooking.total_price,
      currency: "VND",
      payment_method: newBooking.payment_method,
      provider:
        newBooking.payment_method === "VietQR"
          ? "VietQR - MBBank Napas247"
          : newBooking.payment_method === "Credit Card"
          ? "Stripe / International Card"
          : "Front Desk Cash",
      status: newBooking.payment_status === "Success" ? "Completed" : "Pending",
      notes: "Local payment entry for " + newBooking.booking_code,
      paid_at: newBooking.payment_status === "Success" ? new Date().toISOString() : null,
      created_at: new Date().toISOString()
    };
    payments.unshift(newPayment);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

    return savedBooking;
  },

  // 7. GET ALL BOOKINGS (For Admin & Customer lookups)
  async getBookings() {
    if (this.isCloudMode()) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn("Supabase getBookings error:", err);
      }
    }
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || "[]");
    return local.length > 0 ? local : SEED_BOOKINGS;
  },

  // 8. GET BOOKING BY CODE
  async getBookingByCode(bookingCode) {
    const code = (bookingCode || "").trim().toUpperCase();
    if (!code) return null;

    if (this.isCloudMode()) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("booking_code", code)
          .maybeSingle();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn("Supabase getBookingByCode warning:", err);
      }
    }

    const all = await this.getBookings();
    return all.find((b) => b.booking_code === code) || null;
  },

  // 9. UPDATE BOOKING STATUS (Pending, Confirmed, Completed, Cancelled)
  async updateBookingStatus(bookingId, status) {
    if (this.isCloudMode()) {
      try {
        const { error } = await supabase
          .from("bookings")
          .update({ status })
          .eq("id", bookingId);

        if (!error) return true;
      } catch (err) {
        console.error("Supabase updateBookingStatus error:", err);
      }
    }

    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || "[]");
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status } : b));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return true;
  },

  // 10. UPDATE ROOM STATUS (Available, Maintenance, Occupied)
  async updateRoomStatus(roomId, newStatus) {
    if (this.isCloudMode()) {
      try {
        const { error } = await supabase
          .from("rooms")
          .update({ status: newStatus })
          .eq("id", roomId);

        if (!error) return true;
      } catch (err) {
        console.error("Supabase updateRoomStatus error:", err);
      }
    }

    const rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || "[]");
    const updated = rooms.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(updated));
    return true;
  },

  // 11. GET ALL PAYMENTS (For Admin Payment Ledger & Reports)
  async getPayments(hotelId) {
    if (this.isCloudMode()) {
      try {
        let query = supabase
          .from("payments")
          .select("*")
          .order("created_at", { ascending: false });

        if (hotelId && hotelId !== "all") {
          query = query.eq("hotel_id", hotelId);
        }

        const { data, error } = await query;
        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn("Supabase getPayments error:", err);
      }
    }

    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || "[]");
    const list = local.length > 0 ? local : SEED_PAYMENTS;
    if (hotelId && hotelId !== "all") {
      return list.filter((p) => p.hotel_id === hotelId);
    }
    return list;
  },

  // 12. GET PAYMENT BY BOOKING CODE
  async getPaymentByBookingCode(bookingCode) {
    const code = (bookingCode || "").trim().toUpperCase();
    if (!code) return null;

    if (this.isCloudMode()) {
      try {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .eq("booking_code", code)
          .maybeSingle();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn("Supabase getPaymentByBookingCode warning:", err);
      }
    }

    const all = await this.getPayments();
    return all.find((p) => p.booking_code === code) || null;
  },

  // 13. UPDATE PAYMENT STATUS (Pending, Completed, Failed, Refunded)
  async updatePaymentStatus(paymentId, status) {
    const paidAt = status === "Completed" ? new Date().toISOString() : null;

    if (this.isCloudMode()) {
      try {
        const { error } = await supabase
          .from("payments")
          .update({ status, paid_at: paidAt })
          .eq("id", paymentId);

        if (!error) return true;
      } catch (err) {
        console.error("Supabase updatePaymentStatus error:", err);
      }
    }

    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || "[]");
    let targetBookingCode = null;
    const updatedPayments = payments.map((p) => {
      if (p.id === paymentId) {
        targetBookingCode = p.booking_code;
        return { ...p, status, paid_at: paidAt };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updatedPayments));

    if (targetBookingCode) {
      const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || "[]");
      const updatedBookings = bookings.map((b) => {
        if (b.booking_code === targetBookingCode) {
          return {
            ...b,
            payment_status: status === "Completed" ? "Success" : status === "Pending" ? "Pending" : "Failed",
            status: status === "Completed" && b.status === "Pending" ? "Confirmed" : b.status
          };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
    }

    return true;
  },

  // 14. CONFIRM PAYMENT BY BOOKING CODE (Simulate Payment Gateway Webhook / Customer QR Confirmation)
  async confirmPaymentByBookingCode(bookingCode) {
    const code = (bookingCode || "").trim().toUpperCase();
    const nowIso = new Date().toISOString();

    if (this.isCloudMode()) {
      try {
        const { data: updatedPayment, error: payErr } = await supabase
          .from("payments")
          .update({ status: "Completed", paid_at: nowIso })
          .eq("booking_code", code)
          .select()
          .maybeSingle();

        if (!payErr && updatedPayment) {
          // PostgreSQL trigger sync_payment_to_booking also updates bookings automatically
          await supabase
            .from("bookings")
            .update({ payment_status: "Success", status: "Confirmed" })
            .eq("booking_code", code);

          return updatedPayment;
        }
      } catch (err) {
        console.error("Supabase confirmPaymentByBookingCode error:", err);
      }
    }

    // Local fallback
    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || "[]");
    const updatedPayments = payments.map((p) =>
      p.booking_code === code ? { ...p, status: "Completed", paid_at: nowIso } : p
    );
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updatedPayments));

    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || "[]");
    const updatedBookings = bookings.map((b) =>
      b.booking_code === code ? { ...b, payment_status: "Success", status: "Confirmed" } : b
    );
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));

    return updatedPayments.find((p) => p.booking_code === code) || { status: "Completed", paid_at: nowIso };
  },

  // 11. ONE-CLICK SEED DATA TO SUPABASE CLOUD (Admin feature)
  async seedSupabaseData() {
    if (!this.isCloudMode()) {
      throw new Error("Supabase is not configured in .env!");
    }

    let seededCount = 0;

    // 1. Seed Hotels
    for (const h of SEED_HOTELS) {
      const { error } = await supabase.from("hotels").upsert(h);
      if (!error) seededCount++;
    }

    // 2. Seed Room Types
    for (const rt of SEED_ROOM_TYPES) {
      const { error } = await supabase.from("room_types").upsert({
        id: rt.id,
        hotel_id: rt.hotel_id || "h_danang",
        name_vi: rt.name_vi,
        name_en: rt.name_en,
        description_vi: rt.description_vi,
        description_en: rt.description_en,
        long_description_vi: rt.long_description_vi,
        long_description_en: rt.long_description_en,
        area: rt.area,
        capacity: rt.capacity,
        base_price: rt.base_price,
        amenities_vi: rt.amenities_vi,
        amenities_en: rt.amenities_en,
        images: rt.images,
        featured: rt.featured
      });
      if (!error) seededCount++;
    }

    // 3. Seed Rooms
    for (const r of SEED_ROOMS) {
      const { error } = await supabase.from("rooms").upsert({
        id: r.id,
        hotel_id: r.hotel_id,
        room_type_id: r.room_type_id,
        room_number: r.room_number,
        status: r.status
      });
      if (!error) seededCount++;
    }

    return { success: true, count: seededCount };
  }
};
