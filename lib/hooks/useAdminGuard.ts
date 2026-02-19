"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function useAdminGuard() {
  const { user, isSuperAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isSuperAdmin) {
      if (user) {
        router.push("/dashboard");
      }
    }
  }, [loading, isSuperAdmin, user, router]);

  const isReady = !loading && isSuperAdmin;
  return { isReady, loading };
}
