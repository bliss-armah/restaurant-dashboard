const STEPS = [
  {
    step: "01",
    icon: "💬",
    title: "Customer Texts In",
    desc: "A customer WhatsApps your restaurant number to start an order — no app download, no registration.",
  },
  {
    step: "02",
    icon: "🤖",
    title: "Choppa Guides Them",
    desc: "Our smart bot walks them through your menu, collects their choices, address, and payment intent.",
  },
  {
    step: "03",
    icon: "📱",
    title: "Order Hits Dashboard",
    desc: "The confirmed order appears instantly on your Choppa dashboard with all details ready.",
  },
  {
    step: "04",
    icon: "🚀",
    title: "Cook & Deliver",
    desc: "Prepare the order, update the status — your customer gets automatic WhatsApp notifications.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#25D366] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Simple as 1-2-3
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            Your customers order via WhatsApp. You manage everything from one
            clean dashboard. No tech skills needed.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {STEPS.map((item, i) => (
            <div key={i} className="relative group">
              <div className="bg-white/[0.03] border border-white/8 hover:border-[#25D366]/30 rounded-2xl p-6 text-center transition-all hover:bg-white/[0.05] hover:-translate-y-1">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-[#25D366]/10 transition-colors">
                  {item.icon}
                </div>
                <div className="text-[#25D366] text-xs font-mono font-bold mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-white font-bold text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
