const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * API client using Next.js built-in fetch with revalidation support
 */

interface FetchOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    next: {
      ...(options.revalidate !== undefined && {
        revalidate: options.revalidate,
      }),
      ...(options.tags && { tags: options.tags }),
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Get stored auth token
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Set auth token
 */
export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

/**
 * Remove auth token
 */
export function clearToken(): void {
  localStorage.removeItem("token");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

// ============================================
// AUTH API
// ============================================

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Login failed" }));
    throw new Error(error.message || "Invalid credentials");
  }

  return res.json();
}

// ============================================
// CATEGORIES API
// ============================================

export async function getCategories() {
  return apiRequest<{ success: boolean; data: any[] }>("/api/categories", {
    tags: ["categories"],
    revalidate: 30,
  });
}

export async function createCategory(data: {
  name: string;
  description?: string;
  sortOrder?: number;
}) {
  return apiRequest("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
) {
  return apiRequest(`/api/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ============================================
// MENU ITEMS API
// ============================================

export async function getMenuItems() {
  return apiRequest<{ success: boolean; data: any[] }>("/api/menu-items", {
    tags: ["menu-items"],
    revalidate: 30,
  });
}

export async function createMenuItem(data: {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  sortOrder?: number;
}) {
  return apiRequest("/api/menu-items", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMenuItem(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    imageUrl?: string;
    isAvailable?: boolean;
    sortOrder?: number;
  },
) {
  return apiRequest(`/api/menu-items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ============================================
// ORDERS API
// ============================================

export async function getOrders(filters?: {
  status?: string;
  paymentStatus?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.paymentStatus)
    params.append("paymentStatus", filters.paymentStatus);

  const query = params.toString();
  return apiRequest<{ success: boolean; data: any[] }>(
    `/api/orders${query ? `?${query}` : ""}`,
    {
      tags: ["orders"],
      revalidate: 10, // Revalidate every 10 seconds for orders
    },
  );
}

export async function updateOrderStatus(
  id: string,
  data: {
    status?: string;
    paymentStatus?: string;
  },
) {
  return apiRequest(`/api/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
