"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

/**
 * Redirects non-super-admins away from admin pages.
 * Returns isReady=true once auth is confirmed and user is a super admin.
 */
export function useAdminGuard() {
  const { isSuperAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isSuperAdmin) {
      router.push("/dashboard");
    }
  }, [loading, isSuperAdmin, router]);

  const isReady = !loading && isSuperAdmin;
  return { isReady, loading };
}
