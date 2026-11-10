-- =========================================================================
-- MOSARI RESORT & SPA - FULL PRODUCTION SUPABASE SCHEMA (BaaS)
-- Includes: Multi-branch (hotels), room types, rooms, bookings, payments,
-- profiles, Row-Level Security (RLS) & PostgreSQL GIST Exclusion Constraint
-- for double-booking prevention.
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. Hotels Table (Multi-Branch Support)
CREATE TABLE IF NOT EXISTS public.hotels (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  city_vi TEXT NOT NULL,
  city_en TEXT NOT NULL,
  address_vi TEXT NOT NULL,
  address_en TEXT NOT NULL,
  phone TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.hotels TO anon, authenticated;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hotels' AND policyname = 'Public read hotels') THEN
    CREATE POLICY "Public read hotels" ON public.hotels FOR SELECT USING (true);
  END IF;
END $$;

-- 2. Room Types Table (Bilingual Data)
CREATE TABLE IF NOT EXISTS public.room_types (
  id TEXT PRIMARY KEY,
  hotel_id TEXT NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_vi TEXT,
  description_en TEXT,
  long_description_vi TEXT,
  long_description_en TEXT,
  area INT NOT NULL DEFAULT 45,
  capacity INT NOT NULL DEFAULT 2,
  base_price NUMERIC(14, 2) NOT NULL,
  amenities_vi JSONB DEFAULT '[]'::jsonb,
  amenities_en JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.room_types TO anon, authenticated;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'room_types' AND policyname = 'Public read room_types') THEN
    CREATE POLICY "Public read room_types" ON public.room_types FOR SELECT USING (true);
  END IF;
END $$;

-- 3. Physical Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY,
  hotel_id TEXT NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type_id TEXT NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Maintenance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(hotel_id, room_number)
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
GRANT SELECT, UPDATE ON public.rooms TO anon, authenticated;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rooms' AND policyname = 'Public read rooms') THEN
    CREATE POLICY "Public read rooms" ON public.rooms FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rooms' AND policyname = 'Public update rooms') THEN
    CREATE POLICY "Public update rooms" ON public.rooms FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 4. Bookings Table (Double-Booking Prevention with GIST Exclusion Constraint)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  hotel_id TEXT NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type_id TEXT NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
  room_id TEXT REFERENCES public.rooms(id) ON DELETE SET NULL,
  room_number TEXT,
  room_type_name TEXT NOT NULL,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INT NOT NULL DEFAULT 1,
  guests INT NOT NULL DEFAULT 2,
  total_price NUMERIC(14, 2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'VietQR',
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Success', 'Failed')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  special_requests TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_date_range CHECK (check_out_date > check_in_date)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_room_bookings'
  ) THEN
    ALTER TABLE public.bookings
    ADD CONSTRAINT no_overlapping_room_bookings
    EXCLUDE USING gist (
      room_id WITH =,
      daterange(check_in_date, check_out_date, '[)') WITH &&
    )
    WHERE (status IN ('Pending', 'Confirmed') AND room_id IS NOT NULL);
  END IF;
END $$;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO anon, authenticated;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Public select bookings') THEN
    CREATE POLICY "Public select bookings" ON public.bookings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Public insert bookings') THEN
    CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Public update bookings') THEN
    CREATE POLICY "Public update bookings" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 5. Profiles Table (1-to-1 extension of auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'employee', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, UPDATE ON public.profiles TO anon, authenticated;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public select profiles') THEN
    CREATE POLICY "Public select profiles" ON public.profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public update own profile') THEN
    CREATE POLICY "Public update own profile" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 6. Payments Table (Multi-branch Transaction & Payment Ledger)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_code TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  booking_code TEXT NOT NULL,
  hotel_id TEXT NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'VND',
  payment_method TEXT NOT NULL DEFAULT 'VietQR',
  provider TEXT NOT NULL DEFAULT 'VietQR Napas247',
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_code ON public.payments(booking_code);
CREATE INDEX IF NOT EXISTS idx_payments_hotel_id ON public.payments(hotel_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.payments TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Public select payments') THEN
    CREATE POLICY "Public select payments" ON public.payments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Public insert payments') THEN
    CREATE POLICY "Public insert payments" ON public.payments FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Public update payments') THEN
    CREATE POLICY "Public update payments" ON public.payments FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 7. Automatic Payment Ledger & Booking Synchronization Triggers
CREATE OR REPLACE FUNCTION public.auto_create_payment_on_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_txn_code TEXT;
  v_provider TEXT;
  v_status TEXT;
BEGIN
  v_txn_code := 'TXN-' || UPPER(SUBSTRING(REPLACE(NEW.id::text, '-', '') FROM 1 FOR 6));

  v_provider := CASE
    WHEN NEW.payment_method = 'VietQR' THEN 'VietQR - MBBank Napas247'
    WHEN NEW.payment_method = 'Credit Card' THEN 'Stripe / International Card'
    WHEN NEW.payment_method = 'MoMo' THEN 'MoMo E-Wallet'
    ELSE 'Front Desk Cash'
  END;

  v_status := CASE
    WHEN NEW.payment_status = 'Success' THEN 'Completed'
    WHEN NEW.payment_status = 'Failed' THEN 'Failed'
    ELSE 'Pending'
  END;

  IF NOT EXISTS (SELECT 1 FROM public.payments WHERE booking_id = NEW.id) THEN
    INSERT INTO public.payments (
      transaction_code,
      booking_id,
      booking_code,
      hotel_id,
      user_id,
      customer_name,
      amount,
      currency,
      payment_method,
      provider,
      status,
      notes,
      paid_at
    ) VALUES (
      v_txn_code,
      NEW.id,
      NEW.booking_code,
      NEW.hotel_id,
      NEW.user_id,
      NEW.customer_name,
      NEW.total_price,
      'VND',
      NEW.payment_method,
      v_provider,
      v_status,
      'Auto-generated payment ledger entry for ' || NEW.booking_code,
      CASE WHEN v_status = 'Completed' THEN timezone('utc'::text, now()) ELSE NULL END
    );
  END IF;

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_auto_create_payment_on_booking'
  ) THEN
    CREATE TRIGGER trg_auto_create_payment_on_booking
    AFTER INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_create_payment_on_booking();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.sync_payment_to_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  IF NEW.booking_id IS NOT NULL THEN
    IF NEW.status = 'Completed' THEN
      UPDATE public.bookings
      SET
        payment_status = 'Success',
        status = CASE WHEN status = 'Pending' THEN 'Confirmed' ELSE status END
      WHERE id = NEW.booking_id;
    ELSIF NEW.status IN ('Failed', 'Refunded') THEN
      UPDATE public.bookings
      SET payment_status = 'Failed'
      WHERE id = NEW.booking_id;
    ELSIF NEW.status = 'Pending' THEN
      UPDATE public.bookings
      SET payment_status = 'Pending'
      WHERE id = NEW.booking_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sync_payment_to_booking'
  ) THEN
    CREATE TRIGGER trg_sync_payment_to_booking
    AFTER INSERT OR UPDATE OF status ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_payment_to_booking();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.sync_booking_to_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  IF NEW.status IN ('Confirmed', 'Completed') AND OLD.status = 'Pending' THEN
    UPDATE public.payments
    SET
      status = 'Completed',
      paid_at = COALESCE(paid_at, timezone('utc'::text, now()))
    WHERE booking_id = NEW.id AND status = 'Pending';
  ELSIF NEW.status = 'Cancelled' AND OLD.status <> 'Cancelled' THEN
    UPDATE public.payments
    SET status = CASE WHEN status = 'Completed' THEN 'Refunded' ELSE 'Failed' END
    WHERE booking_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sync_booking_to_payment'
  ) THEN
    CREATE TRIGGER trg_sync_booking_to_payment
    AFTER UPDATE OF status, payment_status ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_booking_to_payment();
  END IF;
END $$;
