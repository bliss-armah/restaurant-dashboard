"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

type LoginMethod = "email" | "phone";

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (loginMethod === "email") {
        result = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });
      } else {
        // Phone login - Supabase requires E.164 format (+233...)
        result = await supabase.auth.signInWithPassword({
          phone: identifier,
          password,
        });
      }

      if (result.error) throw result.error;

      // Redirect to dashboard on success
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black">Restaurant Admin</h1>
        </div>

        {/* Login Form */}
        <div className="card">
          {/* Login Method Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("email");
                setIdentifier("");
                setError("");
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                loginMethod === "email"
                  ? "bg-black text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("phone");
                setIdentifier("");
                setError("");
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                loginMethod === "phone"
                  ? "bg-black text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-slide-down">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-black mb-2"
              >
                {loginMethod === "email" ? "Email Address" : "Phone Number"}
              </label>
              <input
                id="identifier"
                type={loginMethod === "email" ? "email" : "tel"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input"
                placeholder={
                  loginMethod === "email"
                    ? "admin@restaurant.com"
                    : "+233123456789"
                }
                required
                autoFocus
              />
              {loginMethod === "phone" && (
                <p className="text-xs text-gray-500 mt-2">
                  📱 Include country code (e.g., +233 for Ghana, +1 for USA)
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
