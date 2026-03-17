"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import { login, setToken, getToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type LoginMethod = "email" | "phone";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already-authenticated users
  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token } = await login(identifier, password);
      setToken(token);
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Restaurant Admin</h1>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={loginMethod === "email" ? "default" : "secondary"}
                className="flex-1"
                onClick={() => { setLoginMethod("email"); setIdentifier(""); setError(""); }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                type="button"
                variant={loginMethod === "phone" ? "default" : "secondary"}
                className="flex-1"
                onClick={() => { setLoginMethod("phone"); setIdentifier(""); setError(""); }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
                  {error}
                </p>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="identifier">
                  {loginMethod === "email" ? "Email Address" : "Phone Number"}
                </Label>
                <Input
                  id="identifier"
                  type={loginMethod === "email" ? "email" : "tel"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={loginMethod === "email" ? "admin@restaurant.com" : "+233123456789"}
                  required
                  autoFocus
                />
                {loginMethod === "phone" && (
                  <p className="text-xs text-muted-foreground">
                    Include country code (e.g., +233 for Ghana)
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
