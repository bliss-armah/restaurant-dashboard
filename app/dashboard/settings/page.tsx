import { Settings, Store, Phone, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Manage your restaurant configuration"
      />

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
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
                <label className="text-sm font-semibold text-foreground">
                  Restaurant Name
                </label>
                <Input
                  type="text"
                  placeholder="My Restaurant"
                  defaultValue="Restaurant Name"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Description
                </label>
                <Textarea
                  className="resize-none bg-background"
                  rows={3}
                  placeholder="Brief description..."
                  defaultValue="Best food in town"
                />
              </div>
              <Button className="w-full mt-2 font-semibold">
                Save Changes
              </Button>
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
              <CardTitle className="text-xl font-bold text-foreground">
                WhatsApp Settings
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  WhatsApp Number
                </label>
                <Input
                  type="tel"
                  placeholder="+233 24 123 4567"
                  defaultValue="+233 24 123 4567"
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                  Contact support to change this number
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Business Account ID
                </label>
                <Input
                  type="text"
                  placeholder="WhatsApp Business Account ID"
                  disabled
                  className="bg-muted/50"
                />
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
              <CardTitle className="text-xl font-bold text-foreground">
                MoMo Payment Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  MoMo Number
                </label>
                <Input
                  type="tel"
                  placeholder="+233 24 123 4567"
                  defaultValue="+233 24 123 4567"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Account Name
                </label>
                <Input
                  type="text"
                  placeholder="Business Name"
                  defaultValue="Restaurant Name"
                  className="bg-background"
                />
              </div>
              <div className="md:col-span-2 mt-2">
                <Button className="w-full md:w-auto font-semibold">
                  Update Payment Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card className="border-border/60 shadow-sm bg-muted/20 pb-4">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-foreground">
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground font-medium mb-1">Version</p>
              <p className="font-semibold text-foreground text-base">1.0.0</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium mb-1">
                Last Updated
              </p>
              <p className="font-semibold text-foreground text-base">
                Feb 19, 2026
              </p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium mb-1">Status</p>
              <p className="font-semibold text-green-600 text-base flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Active
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
