import { Settings, Store, Phone, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Manage your restaurant configuration"
      />

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-black">
              Restaurant Information
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                className="input"
                placeholder="My Restaurant"
                defaultValue="Restaurant Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Description
              </label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Brief description..."
                defaultValue="Best food in town"
              />
            </div>
            <button className="btn btn-primary w-full">Save Changes</button>
          </div>
        </div>

        {/* WhatsApp Configuration */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-black">WhatsApp Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                className="input"
                placeholder="+233 24 123 4567"
                defaultValue="+233 24 123 4567"
                disabled
              />
              <p className="text-xs text-black-400 mt-1">
                Contact support to change this number
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Business Account ID
              </label>
              <input
                type="text"
                className="input"
                placeholder="WhatsApp Business Account ID"
                disabled
              />
            </div>
          </div>
        </div>

        {/* MoMo Payment Configuration */}
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-black">
              MoMo Payment Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                MoMo Number
              </label>
              <input
                type="tel"
                className="input"
                placeholder="+233 24 123 4567"
                defaultValue="+233 24 123 4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Account Name
              </label>
              <input
                type="text"
                className="input"
                placeholder="Business Name"
                defaultValue="Restaurant Name"
              />
            </div>
            <div className="md:col-span-2">
              <button className="btn btn-primary">
                Update Payment Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="card">
        <h2 className="text-xl font-bold text-black mb-4">
          System Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-black-400">Version</p>
            <p className="font-semibold text-black">1.0.0</p>
          </div>
          <div>
            <p className="text-black-400">Last Updated</p>
            <p className="font-semibold text-black">Feb 19, 2026</p>
          </div>
          <div>
            <p className="text-black-400">Status</p>
            <p className="font-semibold text-black">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
