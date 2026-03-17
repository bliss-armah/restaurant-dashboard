"use client";

import { useEffect, useState } from "react";
import { Settings, Store, Phone, CreditCard, Power, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { getMyRestaurant, setRestaurantOpenStatus, updateRestaurant } from "@/lib/api";

export default function SettingsPage() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [toggling, setToggling] = useState(false);

  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [savingHours, setSavingHours] = useState(false);
  const [hoursSaved, setHoursSaved] = useState(false);

  useEffect(() => {
    if (!user?.restaurantId) return;
    getMyRestaurant()
      .then((res) => {
        setIsOpen(res.data.isOpen);
        setRestaurantName(res.data.name);
        setOpeningTime(res.data.openingTime ?? "");
        setClosingTime(res.data.closingTime ?? "");
      })
      .catch(console.error);
  }, [user?.restaurantId]);

  const handleToggleOpen = async () => {
    if (!user?.restaurantId || isOpen === null) return;
    setToggling(true);
    try {
      const newStatus = !isOpen;
      await setRestaurantOpenStatus(user.restaurantId, newStatus);
      setIsOpen(newStatus);
    } catch (err: any) {
      console.error("Failed to toggle status:", err.message);
    } finally {
      setToggling(false);
    }
  };

  const handleSaveHours = async () => {
    if (!user?.restaurantId) return;
    setSavingHours(true);
    try {
      await updateRestaurant(user.restaurantId, {
        openingTime: openingTime || null,
        closingTime: closingTime || null,
      });
      setHoursSaved(true);
      setTimeout(() => setHoursSaved(false), 2500);
    } catch (err: any) {
      console.error("Failed to save hours:", err.message);
    } finally {
      setSavingHours(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Manage your restaurant configuration"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">

        {/* Open / Closed Status */}
        <Card className="border-border/60 shadow-sm bg-card transition-shadow hover:shadow-md lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isOpen ? "bg-green-100" : "bg-red-100"}`}>
                <Power className={`w-6 h-6 ${isOpen ? "text-green-600" : "text-red-500"}`} />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Restaurant Status
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Control whether customers can place orders via WhatsApp
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/20">
              <div>
                <p className="font-semibold text-foreground">
                  {isOpen === null ? "Loading..." : isOpen ? "We're Open for Orders" : "We're Currently Closed"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isOpen === null
                    ? ""
                    : isOpen
                    ? "Customers can browse the menu and place orders right now."
                    : "Customers will receive a friendly closed message on WhatsApp."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleOpen}
                  disabled={toggling || isOpen === null}
                  aria-label="Toggle restaurant open status"
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${isOpen ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isOpen ? "translate-x-7" : "translate-x-0"}`} />
                </button>
                <span className={`text-sm font-semibold ${isOpen ? "text-green-600" : "text-red-500"}`}>
                  {isOpen ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card className="border-border/60 shadow-sm bg-card transition-shadow hover:shadow-md lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Business Hours</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Customers will be told the restaurant is closed outside these hours. Leave blank to rely on the manual toggle only.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Opening Time (24h)</label>
                <Input
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Closing Time (24h)</label>
                <Input
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="md:col-span-2 mt-2 flex items-center gap-4">
                <Button
                  onClick={handleSaveHours}
                  disabled={savingHours}
                  className="font-semibold"
                >
                  {savingHours ? "Saving…" : "Save Hours"}
                </Button>
                {hoursSaved && (
                  <span className="text-sm text-green-600 font-medium">✓ Saved</span>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  Timezone: Africa/Accra (GMT+0)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Info */}
        <Card className="border-border/60 shadow-sm bg-card transition-shadow hover:shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Restaurant Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Restaurant Name</label>
                <Input type="text" placeholder="My Restaurant" defaultValue={restaurantName} className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Description</label>
                <Textarea className="resize-none bg-background" rows={3} placeholder="Brief description..." />
              </div>
              <Button className="w-full mt-2 font-semibold">Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Configuration */}
        <Card className="border-border/60 shadow-sm bg-card transition-shadow hover:shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">WhatsApp Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">WhatsApp Number</label>
                <Input type="tel" placeholder="+233 24 123 4567" disabled className="bg-muted/50" />
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">Contact support to change this number</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Business Account ID</label>
                <Input type="text" placeholder="WhatsApp Business Account ID" disabled className="bg-muted/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MoMo Payment Configuration */}
        <Card className="border-border/60 shadow-sm bg-card transition-shadow hover:shadow-md lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">MoMo Payment Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">MoMo Number</label>
                <Input type="tel" placeholder="+233 24 123 4567" className="bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Account Name</label>
                <Input type="text" placeholder="Business Name" className="bg-background" />
              </div>
              <div className="md:col-span-2 mt-2">
                <Button className="w-full md:w-auto font-semibold">Update Payment Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card className="border-border/60 shadow-sm bg-muted/20 pb-4">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-foreground">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground font-medium mb-1">Version</p>
              <p className="font-semibold text-foreground text-base">1.0.0</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium mb-1">Last Updated</p>
              <p className="font-semibold text-foreground text-base">Feb 19, 2026</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium mb-1">Status</p>
              <p className={`font-semibold text-base flex items-center gap-2 ${isOpen ? "text-green-600" : "text-red-500"}`}>
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? "bg-green-400" : "bg-red-400"}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isOpen ? "bg-green-500" : "bg-red-500"}`}></span>
                </span>
                {isOpen === null ? "Loading..." : isOpen ? "Open" : "Closed"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
