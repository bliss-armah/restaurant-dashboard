"use client";

const CHECKLIST = [
  "Works with any WhatsApp number — no special hardware required",
  "Fully supports Mobile Money (MTN MoMo, Vodafone Cash, AirtelTigo)",
  "Prices displayed in Ghana Cedis (GHS) natively",
  "Designed around Ghanaian food culture and ordering habits",
  "Zero app download needed — customers order from the WhatsApp they have",
  "Works on basic Android phones across all regions of Ghana",
  "Bilingual-friendly — compatible with English and Ghanaian expressions",
];

const METRICS = [
  {
    value: "< 2 min",
    label: "Avg. Order Time",
    sub: "From first message to confirmation",
    color: "#25D366",
  },
  {
    value: "0%",
    label: "Commission Fees",
    sub: "Keep 100% of your order revenue",
    color: "#FFB800",
  },
  {
    value: "99.9%",
    label: "Uptime Guarantee",
    sub: "Always on, even at 3am",
    color: "#4ECDC4",
  },
  {
    value: "24 / 7",
    label: "Automated Orders",
    sub: "Bot never sleeps or takes breaks",
    color: "#A855F7",
  },
];

export default function WhyChoppaSection() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="text-[#25D366] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Why Choppa?
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Built for Ghana.
              <br />
              <span className="text-gray-400">Ready for Africa.</span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              Most restaurant software is built for Western markets. Choppa is
              built for us — supporting MoMo payments, Ghana Cedis, and the way
              Ghanaians actually communicate.
            </p>
            <ul className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#25D366] mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <button
                onClick={() => scrollTo("contact")}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-7 py-3.5 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-[#25D366]/20"
              >
                Request Your Free Trial <span>→</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {METRICS.map((s, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 text-center hover:border-white/15 transition-all"
              >
                <div
                  className="text-3xl font-black mb-2"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-white font-semibold text-sm mb-1">
                  {s.label}
                </div>
                <div className="text-gray-500 text-xs">{s.sub}</div>
              </div>
            ))}

            <div className="col-span-2 bg-gradient-to-br from-[#25D366]/10 to-[#FFB800]/10 border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">🇬🇭</div>
              <div className="text-white font-bold text-lg mb-1">
                Ghana-First Platform
              </div>
              <div className="text-gray-400 text-sm">
                Proudly built for the Ghanaian restaurant industry
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
