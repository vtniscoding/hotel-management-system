-- =========================================================================
-- MOSARI RESORT & SPA - SUPABASE AUTH & PROFILES SCHEMA
-- Purpose: BTEC HND Unit 7 SDLC Demo & Production Migration
-- =========================================================================

-- 1. Create Profiles Table (1-to-1 extension of auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'employee', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Grants for Exposed Schemas
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- SELECT: Users can view their own profile, or staff/admins can view all profiles
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON public.profiles;
CREATE POLICY "Users can view their own profile or admins can view all"
ON public.profiles FOR SELECT
TO authenticated
USING (
  (select auth.uid()) = id
  OR (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role IN ('admin', 'employee')
    )
  )
);

-- UPDATE: Users can only update their own profile details
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING ((select auth.uid()) = id)
WITH CHECK ((select auth.uid()) = id);

-- 5. Trigger Function: Prevent non-admin users from elevating their role
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    ) AND current_user NOT IN ('postgres', 'service_role') THEN
      RAISE EXCEPTION 'Only administrators are authorized to modify user roles.';
    END IF;
  END IF;
  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prevent_unauthorized_role_change() FROM PUBLIC;

DROP TRIGGER IF EXISTS tr_prevent_role_change ON public.profiles;
CREATE TRIGGER tr_prevent_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_unauthorized_role_change();

-- 6. Trigger Function: Handle New User Signup from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  assigned_role text := 'customer';
BEGIN
  -- Determine role based on email or metadata
  IF new.email = 'admin@luxuryhotel.com' OR new.email LIKE '%admin%' THEN
    assigned_role := 'admin';
  ELSIF new.email LIKE '%employee%' OR new.email LIKE '%receptionist%' THEN
    assigned_role := 'employee';
  ELSIF (new.raw_app_meta_data->>'role') IS NOT NULL THEN
    assigned_role := new.raw_app_meta_data->>'role';
  ELSIF (new.raw_user_meta_data->>'role') IS NOT NULL AND (new.raw_user_meta_data->>'role') IN ('customer', 'employee', 'admin') THEN
    assigned_role := new.raw_user_meta_data->>'role';
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role;

  -- Sync role to raw_app_meta_data for secure JWT claims
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', assigned_role)
  WHERE id = new.id;

  RETURN new;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

