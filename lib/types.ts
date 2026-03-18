// ============================================
// SHARED TYPES — aligned with backend camelCase (Prisma native)
// ============================================

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  phone: string;
  email: string | null;
  momoNumber: string;
  momoName: string;
  whatsappNumber?: string | null;
  whatsappPhoneNumberId?: string | null;
  isActive: boolean;
  isOpen: boolean;
  openingTime: string | null;
  closingTime: string | null;
  timezone: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  role: "SUPER_ADMIN" | "RESTAURANT_ADMIN";
  restaurantId: string | null;
  isActive: boolean;
  createdAt: string;
  restaurant?: { id: string; name: string } | null;
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
  sortOrder: number;
  isActive: boolean;
  restaurantId: string;
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  sortOrder?: number;
}

// ---- Menu Item types ----

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
  category?: { id: string; name: string } | null;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
  sortOrder: number;
}

// ---- Order types ----

export interface OrderItem {
  id: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  fulfillmentType: "DELIVERY" | "PICKUP";
  deliveryAddress: string | null;
  customerNotes: string | null;
  createdAt: string;
  customer: { name: string | null; phone: string };
  items: OrderItem[];
}

export type OrderFilterKey = "all" | "pending-payment" | "active";
