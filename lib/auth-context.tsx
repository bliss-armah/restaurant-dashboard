"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "./supabase";
import { useRouter } from "next/navigation";

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

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSuperAdmin: false,
  isRestaurantAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
          role: session.user.user_metadata?.role || "RESTAURANT_ADMIN",
          restaurantId: session.user.user_metadata?.restaurantId,
          name: session.user.user_metadata?.name,
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
          role: session.user.user_metadata?.role || "RESTAURANT_ADMIN",
          restaurantId: session.user.user_metadata?.restaurantId,
          name: session.user.user_metadata?.name,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
