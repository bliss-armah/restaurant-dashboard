"use client";

import { useState } from "react";

const CONTACT_INFO = [
  {
    icon: "💬",
    label: "WhatsApp",
    value: "+233 XX XXX XXXX",
    sub: "Chat with our team directly",
  },
  {
    icon: "📧",
    label: "Email",
    value: "hello@choppa.gh",
    sub: "We reply within 24 hours",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Accra, Ghana 🇬🇭",
    sub: "Ghana-based team, Ghana-focused",
  },
  {
    icon: "⏰",
    label: "Response Time",
    value: "Within 24 hours",
    sub: "Mon – Sat, 8am – 6pm GMT",
  },
];

const PLANS = [
  { value: "monthly", label: "Monthly — GHS 30/month (first 30 days free)" },
  { value: "yearly", label: "Yearly — GHS 27/month · billed GHS 324/yr (save 10%)" },
];

const WHAT_NEXT = [
  {
    step: "1",
    title: "We review your request",
    desc: "Our team looks over your details and prepares your account within 24 hours.",
  },
  {
    step: "2",
    title: "We reach out to you",
    desc: "We'll call or WhatsApp you to confirm details and walk you through the setup.",
  },
  {
    step: "3",
    title: "You go live",
    desc: "We create your restaurant, set up your menu, and hand you your login credentials. Ready to take orders!",
  },
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to backend / email service
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="py-28 px-4 bg-white/[0.015] border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="text-[#25D366] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Get Started
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            We&apos;ll Set Everything Up For You
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-lg">
            There&apos;s no self-signup. You tell us about your restaurant and
            we personally onboard you — so you start strong, not confused.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — what happens next + contact info */}
          <div>
            {/* What happens next */}
            <div className="mb-12">
              <h3 className="text-white font-bold text-xl mb-6">
                What happens after you submit
              </h3>
              <div className="space-y-6">
                {WHAT_NEXT.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] font-black text-sm">
                      {s.step}
                    </div>
                    <div className="pt-1">
                      <div className="text-white font-semibold text-sm mb-1">
                        {s.title}
                      </div>
                      <div className="text-gray-400 text-sm leading-relaxed">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/8 mb-10" />

            {/* Contact info */}
            <h3 className="text-white font-bold text-base mb-5">
              Prefer to reach us directly?
            </h3>
            <div className="space-y-4">
              {CONTACT_INFO.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/8 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">
                      {c.label}
                    </div>
                    <div className="text-white font-semibold text-sm">
                      {c.value}
                    </div>
                    <div className="text-gray-500 text-xs">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — onboarding request form */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
            {submitted ? (
              <SuccessState />
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">
                    Request your free onboarding
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Fill this in and we&apos;ll be in touch within 24 hours.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm block mb-1.5">
                        Your Name <span className="text-[#25D366]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Kofi Mensah"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#25D366]/50 text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-1.5">
                        Restaurant Name <span className="text-[#25D366]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Kofi's Kitchen"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#25D366]/50 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-1.5">
                      Restaurant WhatsApp Number{" "}
                      <span className="text-[#25D366]">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+233 24 XXX XXXX"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#25D366]/50 text-sm transition-colors"
                    />
                    <p className="text-gray-600 text-xs mt-1.5">
                      This is the number Meta will verify and your customers
                      will chat with to place orders. It must{" "}
                      <strong className="text-gray-400">
                        not be actively used as a personal WhatsApp
                      </strong>
                      .
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-1.5">
                      Your Personal Number{" "}
                      <span className="text-[#25D366]">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+233 20 XXX XXXX"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#25D366]/50 text-sm transition-colors"
                    />
                    <p className="text-gray-600 text-xs mt-1.5">
                      We&apos;ll use this to reach you during onboarding.
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-1.5">
                      Plan you&apos;re interested in{" "}
                      <span className="text-[#25D366]">*</span>
                    </label>
                    <select
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-[#25D366]/50 text-sm transition-colors"
                    >
                      <option value="" className="bg-[#111]">
                        Select a plan
                      </option>
                      {PLANS.map((p) => (
                        <option
                          key={p.value}
                          value={p.value}
                          className="bg-[#111]"
                        >
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-600 text-xs mt-1.5">
                      Every new Monthly subscription starts with{" "}
                      <strong className="text-gray-400">30 days free</strong>.
                      No charge until your trial ends.
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm block mb-1.5">
                      Anything else we should know?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. number of menu items, location, delivery area, any questions..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#25D366]/50 text-sm transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-[#25D366]/20"
                  >
                    Request My Free Onboarding →
                  </button>

                  <p className="text-center text-gray-600 text-xs">
                    No credit card. No commitment. We&apos;ll reach out within
                    24 hours. 🇬🇭
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Already a customer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Already have a Choppa account?{" "}
            <a
              href="/login"
              className="text-[#25D366] hover:underline font-medium"
            >
              Sign in to your dashboard →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function SuccessState() {
  return (
    <div className="py-8 text-center">
      <div className="w-16 h-16 bg-[#25D366]/15 border border-[#25D366]/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
        ✅
      </div>
      <h3 className="text-white font-black text-2xl mb-3">
        Request received!
      </h3>
      <p className="text-gray-400 leading-relaxed mb-8">
        Thank you! Our team will review your details and reach out to you on
        WhatsApp or email within <strong className="text-white">24 hours</strong> to set up your account.
      </p>
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left space-y-3">
        <div className="text-white font-semibold text-sm mb-2">
          While you wait:
        </div>
        {[
          "Think about your menu categories (e.g. Rice Dishes, Grills, Drinks)",
          "Have your MoMo number ready for payment setup",
          "Prepare 1-2 photos of your popular dishes (optional but great!)",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 text-gray-400 text-sm">
            <span className="text-[#25D366] mt-0.5 flex-shrink-0">✓</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
