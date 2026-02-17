import { createClient } from "@supabase/supabase-js";

// These will be set after you create your Supabase project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for database tables (will match Prisma schema)
export type Database = {
  public: {
    Tables: {
      Restaurant: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          phone: string;
          whatsappBusinessAccountId: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      MenuCategory: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          restaurantId: string;
          sortOrder: number;
          isActive: boolean;
          createdAt: string;
          updatedAt: string;
        };
      };
      MenuItem: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          categoryId: string;
          imageUrl: string | null;
          isAvailable: boolean;
          sortOrder: number;
          createdAt: string;
          updatedAt: string;
        };
      };
      Order: {
        Row: {
          id: string;
          orderNumber: string;
          customerId: string;
          restaurantId: string;
          totalAmount: number;
          status: string;
          paymentStatus: string;
          deliveryAddress: string | null;
          customerNotes: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
    };
  };
};
