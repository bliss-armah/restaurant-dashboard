const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4050";

// ============================================
// HTTP CLIENT
// ============================================

/**
 * Make an authenticated request to the Express backend.
 * Token is read from localStorage on every call so it's always fresh.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ============================================
// TOKEN HELPERS
// ============================================

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function clearToken(): void {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ============================================
// AUTH
// ============================================

export async function login(identifier: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const body = await res.json().catch(() => ({ error: "Login failed" }));
  if (!res.ok) throw new Error(body.error || "Invalid credentials");
  return body.data as { token: string; user: AuthUser };
}

export async function getMe() {
  return apiRequest<{ success: boolean; data: AuthUser }>("/auth/me");
}

// ============================================
// RESTAURANTS
// ============================================

export async function getRestaurants() {
  return apiRequest<{ success: boolean; data: any[] }>("/restaurants");
}

export async function getMyRestaurant() {
  return apiRequest<{ success: boolean; data: any }>("/restaurants/me");
}

export async function createRestaurant(data: Record<string, any>) {
  return apiRequest("/restaurants", { method: "POST", body: JSON.stringify(data) });
}

export async function updateRestaurant(id: string, data: Record<string, any>) {
  return apiRequest(`/restaurants/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function setRestaurantOpenStatus(id: string, isOpen: boolean) {
  return apiRequest(`/restaurants/${id}/open-status`, {
    method: "PATCH",
    body: JSON.stringify({ isOpen }),
  });
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories(restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest<{ success: boolean; data: any[] }>(`/categories${q}`);
}

export async function createCategory(data: Record<string, any>, restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest(`/categories${q}`, { method: "POST", body: JSON.stringify(data) });
}

export async function updateCategory(id: string, data: Record<string, any>, restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest(`/categories/${id}${q}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function toggleCategoryActive(id: string, restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest(`/categories/${id}/toggle${q}`, { method: "PATCH" });
}

export async function deleteCategory(id: string, restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest(`/categories/${id}${q}`, { method: "DELETE" });
}

// ============================================
// MENU ITEMS
// ============================================

export async function getMenuItems(restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest<{ success: boolean; data: any[] }>(`/menu-items${q}`);
}

export async function createMenuItem(data: Record<string, any>, restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest(`/menu-items${q}`, { method: "POST", body: JSON.stringify(data) });
}

export async function updateMenuItem(id: string, data: Record<string, any>, restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest(`/menu-items/${id}${q}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function toggleMenuItemAvailable(id: string, restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest(`/menu-items/${id}/toggle${q}`, { method: "PATCH" });
}

export async function deleteMenuItem(id: string, restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest(`/menu-items/${id}${q}`, { method: "DELETE" });
}

// ============================================
// ORDERS
// ============================================

export async function getOrders(restaurantId?: string) {
  const q = restaurantId ? `?restaurantId=${restaurantId}` : "";
  return apiRequest<{ success: boolean; data: any[] }>(`/orders${q}`);
}

export async function updateOrderStatus(id: string, data: { status?: string; paymentStatus?: string }) {
  return apiRequest(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ============================================
// STATS
// ============================================

export async function getStats() {
  return apiRequest<{ success: boolean; data: any }>("/stats");
}

// ============================================
// ADMIN
// ============================================

export async function adminCreateUser(data: Record<string, any>) {
  return apiRequest("/admin/users", { method: "POST", body: JSON.stringify(data) });
}

export async function adminListUsers() {
  return apiRequest<{ success: boolean; data: any[] }>("/admin/users");
}

export async function adminUpdateUserRole(userId: string, role: string, restaurantId?: string) {
  return apiRequest(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role, restaurantId }),
  });
}

// ============================================
// BILLING
// ============================================

export async function getBillingSubscription() {
  return apiRequest<{
    success: boolean;
    data: { subscription: any; subscriptionStatus: string | null; trialEndsAt: string | null };
  }>("/billing/subscription");
}

export async function initializeBillingSubscription(interval: "monthly" | "yearly") {
  return apiRequest<{ success: boolean; data: { authorization_url: string; reference: string } }>(
    "/billing/initialize",
    { method: "POST", body: JSON.stringify({ interval }) },
  );
}

export async function cancelBillingSubscription() {
  return apiRequest<{ success: boolean; message: string }>("/billing/cancel", { method: "POST" });
}

// ============================================
// SHARED TYPES
// ============================================

export interface AuthUser {
  id: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  role: "SUPER_ADMIN" | "RESTAURANT_ADMIN";
  restaurantId?: string | null;
}
