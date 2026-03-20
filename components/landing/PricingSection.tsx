"use client";

const MONTHLY_PRICE = 30;
const YEARLY_MONTHLY_PRICE = 27; // 10% off
const YEARLY_TOTAL = YEARLY_MONTHLY_PRICE * 12; // 324
const YEARLY_SAVINGS = MONTHLY_PRICE * 12 - YEARLY_TOTAL; // 36

const SHARED_FEATURES = [
  "WhatsApp ordering bot (24/7)",
  "Unlimited orders",
  "Unlimited menu categories",
  "Real-time order dashboard",
  "MoMo payment support",
  "Delivery & pickup support",
  "Automatic customer notifications",
  "Revenue analytics",
  "Priority WhatsApp support",
  "Multiple staff accounts",
];

export default function PricingSection() {
  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="pricing" className="py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#25D366] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Simple, Fair Pricing
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            No hidden fees. No commissions on your orders. Every new Monthly
            subscription starts with{" "}
            <span className="text-white font-semibold">30 days free</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Monthly */}
          <div className="bg-white/[0.03] border border-white/8 hover:border-white/15 rounded-2xl p-8 transition-all hover:-translate-y-1 relative">
            {/* Free trial ribbon */}
            <div className="absolute -top-3 left-6 bg-[#FFB800] text-black text-xs font-black px-4 py-1 rounded-full">
              30 days free
            </div>

            <div className="mb-6 pt-2">
              <h3 className="text-white font-black text-xl mb-1">Monthly</h3>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-5xl font-black text-white">
                  GHS {MONTHLY_PRICE}
                </span>
                <span className="text-gray-500 text-sm">/ month</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mt-3">
                Full access, no long-term commitment. Your first 30 days are
                completely free — no charge until your trial ends.
              </p>
            </div>

            {/* Trial callout */}
            <div className="bg-[#FFB800]/8 border border-[#FFB800]/20 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
              <span className="text-[#FFB800] text-base flex-shrink-0">🎁</span>
              <p className="text-[#FFB800] text-xs leading-relaxed">
                First month is <strong>completely free</strong>. After 30 days,
                billing starts at GHS {MONTHLY_PRICE}/month. Cancel anytime.
              </p>
            </div>

            <ul className="space-y-2.5 mb-8">
              {SHARED_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#25D366] flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-300">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={scrollToContact}
              className="w-full border border-white/15 hover:border-[#25D366]/50 hover:bg-[#25D366]/5 text-white py-3.5 rounded-xl font-bold transition-all"
            >
              Start Free — No Card Needed
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-[#25D366]/5 border border-[#25D366]/40 rounded-2xl p-8 shadow-xl shadow-[#25D366]/10 transition-all hover:-translate-y-1 relative">
            <div className="absolute -top-3 left-6 bg-[#25D366] text-white text-xs font-black px-4 py-1 rounded-full">
              Best value · save 10%
            </div>

            <div className="mb-6 pt-2">
              <h3 className="text-white font-black text-xl mb-1">Yearly</h3>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-5xl font-black text-white">
                  GHS {YEARLY_MONTHLY_PRICE}
                </span>
                <span className="text-gray-500 text-sm">/ month</span>
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Billed as{" "}
                <span className="text-white font-semibold">
                  GHS {YEARLY_TOTAL}
                </span>{" "}
                per year
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mt-3">
                Commit annually and save GHS {YEARLY_SAVINGS} every year.
                Best for restaurants ready to grow.
              </p>
            </div>

            {/* Savings callout */}
            <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
              <span className="text-[#25D366] text-base flex-shrink-0">💰</span>
              <p className="text-[#25D366] text-xs leading-relaxed">
                You save{" "}
                <strong>GHS {YEARLY_SAVINGS} per year</strong> compared to
                paying monthly. Billed once annually.
              </p>
            </div>

            <ul className="space-y-2.5 mb-8">
              {SHARED_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#25D366] flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-300">{f}</span>
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm">
                <span className="text-[#FFB800] flex-shrink-0 mt-0.5">★</span>
                <span className="text-[#FFB800] font-semibold">
                  Priority onboarding & dedicated support
                </span>
              </li>
            </ul>

            <button
              onClick={scrollToContact}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-[#25D366]/20"
            >
              Get Started — Save GHS {YEARLY_SAVINGS}/yr
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Zero commission on orders · Cancel anytime · We onboard you personally
        </p>
      </div>
    </section>
  );
}
