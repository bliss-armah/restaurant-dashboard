// ============================================
// SHARED TYPES
// ============================================

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
  restaurant?: {
    id: string;
    name: string;
  };
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
