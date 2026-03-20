const TESTIMONIALS = [
  {
    name: "Abena Kwansema",
    restaurant: "Abena's Kitchen, Accra",
    avatar: "AK",
    stars: 5,
    text: "Since I joined Choppa, my orders have more than doubled. My customers just WhatsApp me and the system handles everything. Chale, it's a game changer! I even take orders while I'm sleeping.",
  },
  {
    name: "Kwame Asante",
    restaurant: "Jollof House, Kumasi",
    avatar: "KA",
    stars: 5,
    text: "Before Choppa, I was writing orders on paper and making mistakes. Now everything is organized on my phone. I can see my daily revenue, which items sell most, and manage everything from anywhere.",
  },
  {
    name: "Ama Dankwah",
    restaurant: "Taste of Ghana, Tema",
    avatar: "AD",
    stars: 5,
    text: "My customers love that they can order at midnight and still get a response immediately. Choppa never sleeps — even when I do! The MoMo integration is exactly what we needed.",
  },
  {
    name: "Kofi Mensah",
    restaurant: "Kofi's Chop Bar, Takoradi",
    avatar: "KM",
    stars: 5,
    text: "I was skeptical at first but the setup was surprisingly easy. Within one week my orders increased. The dashboard is simple and my staff picked it up quickly with no training needed.",
  },
  {
    name: "Efua Boateng",
    restaurant: "Efua's Canteen, Cape Coast",
    avatar: "EB",
    stars: 5,
    text: "The automatic customer notifications are brilliant. When I update an order status, the customer gets a WhatsApp message right away. My customers feel so well taken care of now.",
  },
  {
    name: "Yaw Darko",
    restaurant: "Yaw's Fast Food, Sunyani",
    avatar: "YD",
    stars: 5,
    text: "Choppa is the best investment I've made for my restaurant. The free trial convinced me immediately. Highly recommend to any restaurant owner who wants to grow without hiring extra staff.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 px-4 bg-white/[0.015] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#FFB800] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Restaurants Love Choppa
          </h2>
          <p className="text-gray-400">
            Hear from real restaurant owners across Ghana.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    {t.name}
                  </div>
                  <div className="text-gray-500 text-xs">{t.restaurant}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.stars)].map((_, j) => (
                  <span key={j} className="text-[#FFB800] text-sm">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
