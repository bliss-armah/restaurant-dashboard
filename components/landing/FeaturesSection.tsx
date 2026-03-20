const FEATURES = [
  {
    icon: "📲",
    title: "WhatsApp Ordering Bot",
    desc: "An intelligent conversational bot handles your orders automatically — 24 hours a day, 7 days a week. No human needed.",
    accent: "#25D366",
    tag: "Core",
  },
  {
    icon: "📊",
    title: "Real-time Dashboard",
    desc: "Track every order, manage your menu, view daily revenue and analytics — from any device, anywhere.",
    accent: "#FFB800",
    tag: "Management",
  },
  {
    icon: "🍛",
    title: "Smart Menu Management",
    desc: "Create categories, add items with prices and photos, toggle availability in seconds. Changes go live instantly.",
    accent: "#4ECDC4",
    tag: "Menu",
  },
  {
    icon: "📱",
    title: "Mobile Money Ready",
    desc: "Built for MoMo. MTN, Vodafone, AirtelTigo — share your number and Choppa tracks payment confirmations.",
    accent: "#F97316",
    tag: "Payments",
  },
  {
    icon: "🚚",
    title: "Delivery & Pickup",
    desc: "Let customers choose delivery or pickup. Delivery addresses are collected automatically via the bot.",
    accent: "#A855F7",
    tag: "Fulfillment",
  },
  {
    icon: "📈",
    title: "Revenue Analytics",
    desc: "Understand your business with daily revenue reports, popular item rankings, and order volume trends.",
    accent: "#EC4899",
    tag: "Analytics",
  },
  {
    icon: "🏪",
    title: "Multi-restaurant Support",
    desc: "Managing more than one location? Choppa scales with you — each restaurant gets its own dashboard.",
    accent: "#14B8A6",
    tag: "Scale",
  },
  {
    icon: "🔔",
    title: "Automatic Notifications",
    desc: "Customers receive real-time WhatsApp updates when their order is confirmed, being prepared, or ready.",
    accent: "#EAB308",
    tag: "Engagement",
  },
  {
    icon: "🔒",
    title: "Secure & Reliable",
    desc: "Enterprise-grade security with end-to-end encryption, HMAC webhook verification, and 99.9% uptime.",
    accent: "#6366F1",
    tag: "Security",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-28 px-4 bg-white/[0.015] border-y border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#FFB800] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Everything You Need to Grow
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            Designed specifically for Ghanaian restaurants — from MoMo payments
            to GHS pricing, Choppa speaks your language.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all hover:-translate-y-1 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: f.accent + "15" }}
                >
                  {f.icon}
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    color: f.accent,
                    backgroundColor: f.accent + "15",
                  }}
                >
                  {f.tag}
                </span>
              </div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
