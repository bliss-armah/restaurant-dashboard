"use client";

import Link from "next/link";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export default function HeroSection({ isLoggedIn }: HeroSectionProps) {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative pt-28 pb-24 px-4 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#25D366]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#FFB800]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-300 mb-8">
            <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
            Trusted by restaurants across Ghana
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Your Customers Are
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #25D366 0%, #FFB800 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Already on WhatsApp
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Choppa transforms WhatsApp into a fully automated ordering system
            for your restaurant. More orders, less hustle — zero app downloads
            needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-[#25D366]/20"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <button
                onClick={() => scrollTo("contact")}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 w-full sm:w-auto shadow-lg shadow-[#25D366]/20"
              >
                Get Started Free — Akwaaba! 👋
              </button>
            )}
            <button
              onClick={() => scrollTo("how-it-works")}
              className="border border-white/15 hover:border-white/30 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all w-full sm:w-auto backdrop-blur-sm"
            >
              See How It Works ↓
            </button>
          </div>

          {/* WhatsApp chat mockup */}
          <div className="relative max-w-sm mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#25D366]/20 to-[#FFB800]/10 rounded-3xl blur-xl" />
            <div className="relative bg-[#111B21] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              {/* Chat header */}
              <div className="bg-[#1F2C34] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center font-bold text-sm">
                  CK
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold">
                    Choppa Kitchen
                  </div>
                  <div className="text-[#25D366] text-xs">Online</div>
                </div>
                <div className="flex gap-3 text-[#8696A0]">
                  <span className="text-sm">📞</span>
                  <span className="text-sm">⋮</span>
                </div>
              </div>

              {/* Chat messages */}
              <div
                className="px-4 py-4 space-y-3"
                style={{
                  background:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l8.215 8.215-1.414 1.414L34.828 0h2.83zM22.344 0L13.858 8.485 15.272 9.9 24.17 1H21.343zm13.514 0l9.9 9.9-1.414 1.414L25.657 0H35.86zm-9.9 0l11.314 11.314-1.414 1.414L22.343 0h3.617zM30 0l12.728 12.728-1.414 1.415L30 2.83 18.686 14.143l-1.414-1.415L30 0z' fill='%23ffffff' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E\") #0B141A",
                }}
              >
                <div className="flex justify-start">
                  <div className="bg-[#1F2C34] text-gray-100 text-sm rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[85%] shadow">
                    <p>Akwaaba! 👋 Welcome to Choppa Kitchen.</p>
                    <p className="mt-1 text-gray-300">
                      Please select a category:
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="bg-[#2A3942] rounded-lg px-3 py-1.5 text-xs text-[#25D366] font-medium">
                        🍛 Rice Dishes
                      </div>
                      <div className="bg-[#2A3942] rounded-lg px-3 py-1.5 text-xs text-gray-300">
                        🍗 Grills &amp; Proteins
                      </div>
                      <div className="bg-[#2A3942] rounded-lg px-3 py-1.5 text-xs text-gray-300">
                        🥤 Drinks
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-gray-500 mt-1">
                      09:14 ✓✓
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-[#005C4B] text-white text-sm rounded-xl rounded-tr-sm px-4 py-2.5 max-w-[75%] shadow">
                    Rice Dishes 🍛
                    <div className="text-right text-[10px] text-[#53BDEB] mt-1">
                      09:14 ✓✓
                    </div>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#1F2C34] text-gray-100 text-sm rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[85%] shadow">
                    <p className="font-medium">Jollof Rice — GHS 25</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      How many portions would you like?
                    </p>
                    <div className="text-right text-[10px] text-gray-500 mt-1">
                      09:15 ✓✓
                    </div>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#1F2C34] text-gray-100 text-sm rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[90%] shadow">
                    <p className="text-[#25D366] font-semibold">
                      ✅ Order Confirmed!
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Total: <strong className="text-white">GHS 50</strong>
                      <br />
                      Pay via MoMo to: 024-XXX-XXXX
                      <br />
                      <span className="text-gray-400">
                        Est. delivery: 30–40 mins
                      </span>
                    </p>
                    <div className="text-right text-[10px] text-gray-500 mt-1">
                      09:16 ✓✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
