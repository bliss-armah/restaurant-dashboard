"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "./supabase";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type UserRole = "SUPER_ADMIN" | "RESTAURANT_ADMIN";

interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  restaurantId?: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isSuperAdmin: boolean;
  isRestaurantAdmin: boolean;
  signOut: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSuperAdmin: false,
  isRestaurantAdmin: false,
  signOut: async () => {},
});


async function fetchUserRole(
  userId: string,
): Promise<{ role: UserRole; restaurantId?: string } | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role, restaurant_id")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error("[auth-context] failed to fetch user role:", error?.message);
    return null;
  }

  return {
    role: data.role as UserRole,
    restaurantId: data.restaurant_id ?? undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Resolves a full AuthUser from a Supabase session.
   * Fetches role from DB — never from JWT metadata.
   */
  const resolveUser = useCallback(
    async (sessionUser: {
      id: string;
      email?: string;
      phone?: string;
      user_metadata?: Record<string, any>;
    }) => {
      const roleData = await fetchUserRole(sessionUser.id);

      console.log("roleData", roleData);

      setUser({
        id: sessionUser.id,
        email: sessionUser.email,
        phone: sessionUser.phone,
        role: roleData?.role ?? "RESTAURANT_ADMIN",
        restaurantId: roleData?.restaurantId,
        name: sessionUser.user_metadata?.name,
      });
    },
    [],
  );

  useEffect(() => {
    // ── Initial session load ─────────────────────────────────────────────────
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await resolveUser(session.user);
      }
      setLoading(false);
    });

    // ── Auth state changes (login, logout, token refresh) ────────────────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await resolveUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [resolveUser]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSuperAdmin: user?.role === "SUPER_ADMIN",
        isRestaurantAdmin: user?.role === "RESTAURANT_ADMIN",
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
