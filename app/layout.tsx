import { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Choppa — WhatsApp Ordering for Ghanaian Restaurants",
  description:
    "Choppa turns WhatsApp into a powerful restaurant ordering system. No app downloads. MoMo payments. Real-time dashboard. Built for Ghana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
