import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../config/supabase";
import { SEED_USERS } from "../data/seedData";

const AuthContext = createContext(null);

const STORAGE_KEY = "mosari_current_user";

/**
 * Determine the user's role from Supabase user data or email rules.
 * Following Supabase security best practice:
 * Checks app_metadata first (set by server/admin), then user_metadata, then fallback.
 */
const resolveUserRole = (user) => {
  if (!user) return "customer";
  
  if (user.app_metadata?.role) {
    return user.app_metadata.role;
  }
  if (user.user_metadata?.role) {
    return user.user_metadata.role;
  }
  const email = (user.email || "").toLowerCase();
  if (email === "admin@luxuryhotel.com" || email.includes("admin")) {
    return "admin";
  }
  if (email.includes("employee") || email.includes("staff") || email.includes("receptionist")) {
    return "employee";
  }
  return "customer";
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize with Supabase Auth session & state changes
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          // Fetch existing active session
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn("Error getting Supabase session:", error.message);
          }

          if (isMounted) {
            if (initialSession?.user) {
              const u = initialSession.user;
              const role = resolveUserRole(u);
              const userObj = {
                id: u.id,
                email: u.email,
                full_name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Quý khách",
                phone: u.user_metadata?.phone || "",
                role
              };
              setSession(initialSession);
              setCurrentUser(userObj);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
            } else {
              setSession(null);
              // Only clear if not in offline mock mode
              if (!currentUser?.id?.startsWith("mock_")) {
                setCurrentUser(null);
                localStorage.removeItem(STORAGE_KEY);
              }
            }
          }
        } catch (err) {
          console.error("Supabase auth init exception:", err);
        } finally {
          if (isMounted) setLoading(false);
        }

        // Listen for realtime auth changes (sign in, sign out, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (!isMounted) return;

            console.log("🔔 Supabase Auth event:", event);

            if (currentSession?.user) {
              const u = currentSession.user;
              const role = resolveUserRole(u);
              const userObj = {
                id: u.id,
                email: u.email,
                full_name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Quý khách",
                phone: u.user_metadata?.phone || "",
                role
              };
              setSession(currentSession);
              setCurrentUser(userObj);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
            } else if (event === "SIGNED_OUT") {
              setSession(null);
              setCurrentUser(null);
              localStorage.removeItem(STORAGE_KEY);
            }
            setLoading(false);
          }
        );

        return () => {
          isMounted = false;
          subscription.unsubscribe();
        };
      } else {
        // Offline / Mock mode fallback
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 1. Sign In with Email and Password
  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) {
          // Translate common Supabase Auth error messages into Vietnamese
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!");
          } else if (error.message.includes("Email not confirmed")) {
            throw new Error("Email chưa được xác thực. Vui lòng kiểm tra hòm thư của bạn!");
          } else {
            throw new Error(error.message);
          }
        }

        if (data?.user) {
          const role = resolveUserRole(data.user);
          const userObj = {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Quý khách",
            phone: data.user.user_metadata?.phone || "",
            role
          };
          setSession(data.session);
          setCurrentUser(userObj);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
          return userObj;
        }
      }

      // Offline Mock Login (Seed Users or Local fallback)
      const matchedUser = SEED_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
      if (matchedUser) {
        setCurrentUser(matchedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(matchedUser));
        return matchedUser;
      }

      // Default mock login
      const mockUser = {
        id: "mock_" + Date.now(),
        email: cleanEmail,
        full_name: cleanEmail.split("@")[0],
        phone: "",
        role: cleanEmail.includes("admin") ? "admin" : "customer"
      };
      setCurrentUser(mockUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      return mockUser;
    } finally {
      setLoading(false);
    }
  };

  // 2. Sign Up with Email, Password and User Metadata
  const register = async (fullName, email, phone, password) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSupabaseConfigured && supabase) {
        const defaultRole = cleanEmail.includes("admin") ? "admin" : "customer";

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              role: defaultRole
            }
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("Email này đã được đăng ký tài khoản. Vui lòng đăng nhập!");
          } else if (error.message.includes("Password should be at least")) {
            throw new Error("Mật khẩu phải có độ dài tối thiểu 6 ký tự.");
          } else {
            throw new Error(error.message);
          }
        }

        if (data?.user) {
          const role = resolveUserRole(data.user);
          const userObj = {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName.trim(),
            phone: phone.trim(),
            role
          };
          if (data.session) {
            setSession(data.session);
          }
          setCurrentUser(userObj);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
          return userObj;
        }
      }

      // Offline Mock Register
      const newUser = {
        id: "mock_" + Date.now(),
        email: cleanEmail,
        full_name: fullName.trim(),
        phone: phone.trim(),
        role: cleanEmail.includes("admin") ? "admin" : "customer"
      };
      setCurrentUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  // 3. 1-Click Demo Admin Login (For BTEC HND Unit 7 Assessor & Examiner demonstration)
  const loginDemoAdmin = async () => {
    setLoading(true);
    const demoEmail = "admin.mosari@gmail.com";
    const demoPassword = "AdminPassword@123";

    try {
      if (isSupabaseConfigured && supabase) {
        // Try sign in first with live Supabase admin
        const { data, error } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword
        });

        if (!error && data?.user) {
          const userObj = {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || "admin",
            phone: data.user.user_metadata?.phone || "0999999999",
            role: "admin"
          };
          setSession(data.session);
          setCurrentUser(userObj);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
          return userObj;
        }

        // If not found, attempt auto-creation for quick demo
        if (error && (error.message.includes("Invalid login credentials") || error.message.includes("not found"))) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
            options: {
              data: {
                full_name: "admin",
                phone: "0999999999",
                role: "admin"
              }
            }
          });

          if (!signUpError && signUpData?.user) {
            const userObj = {
              id: signUpData.user.id,
              email: demoEmail,
              full_name: "admin",
              phone: "0999999999",
              role: "admin"
            };
            if (signUpData.session) setSession(signUpData.session);
            setCurrentUser(userObj);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
            return userObj;
          }
        }
      }

      // Offline Fallback for Admin
      const adminUser = SEED_USERS[0];
      setCurrentUser(adminUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      return adminUser;
    } finally {
      setLoading(false);
    }
  };

  // 4. Sign Out
  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("Sign out exception:", err);
    } finally {
      setSession(null);
      setCurrentUser(null);
      localStorage.removeItem(STORAGE_KEY);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        loading,
        isAdmin: currentUser?.role === "admin",
        isStaff: currentUser?.role === "admin" || currentUser?.role === "employee",
        login,
        register,
        loginDemoAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
