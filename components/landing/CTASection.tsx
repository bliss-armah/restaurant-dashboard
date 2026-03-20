interface CTASectionProps {
  onContactClick: () => void;
}

export default function CTASection({ onContactClick }: CTASectionProps) {
  return (
    <section className="py-28 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1f17] to-[#1a1200] border border-[#25D366]/20 rounded-3xl p-16">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="text-6xl mb-6">🇬🇭</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to Transform
              <br />
              Your Restaurant?
            </h2>
            <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
              Join hundreds of Ghanaian restaurants already using Choppa to take
              more orders, earn more revenue, and serve customers better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onContactClick}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-[#25D366]/20"
              >
                Get Started Free — Akwaaba! 🤝
              </button>
              <button
                onClick={onContactClick}
                className="border border-white/20 hover:border-white/40 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Talk to Us First
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-6">
              No credit card required · 30-day free trial · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
