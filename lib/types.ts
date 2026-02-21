// ============================================
// SHARED TYPES
// ============================================

// ---- Admin types ----

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  phone: string;
  email: string | null;
  momo_number: string;
  momo_name: string;
  is_active: boolean;
  subscription_status: string;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  role: "SUPER_ADMIN" | "RESTAURANT_ADMIN";
  restaurant_id: string | null;
  is_active: boolean;
  created_at: string;
  restaurant?: { id: string; name: string };
}

export interface Activity {
  id: string;
  type: "restaurant_created" | "order_placed" | "user_created";
  description: string;
  timestamp: string;
  restaurantName?: string;
}

export interface DashboardStats {
  totalRestaurants: number;
  activeRestaurants: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentActivity: Activity[];
}

export interface RestaurantDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  avgOrderValue: number;
  totalMenuItems: number;
  totalCategories: number;
}

// ---- Category types ----

export interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  restaurant_id: string;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  sort_order: number;
}

// ---- Menu Item types ----

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  category?: { id: string; name: string };
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  image_url: string;
  sort_order: number;
}

// ---- Order types ----

export interface OrderItem {
  id: string;
  item_name: string;
  item_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  delivery_address: string | null;
  customer_notes: string | null;
  created_at: string;
  customer: { name: string | null; phone: string };
  items: OrderItem[];
}

export type OrderFilterKey = "all" | "pending-payment" | "active";
