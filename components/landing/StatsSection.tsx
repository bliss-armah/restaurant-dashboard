const STATS = [
  { value: "500+", label: "Daily Orders" },
  { value: "50+", label: "Restaurants Onboard" },
  { value: "10,000+", label: "Customers Served" },
  { value: "24 / 7", label: "Always Taking Orders" },
];

export default function StatsSection() {
  return (
    <section className="py-14 border-y border-white/5 bg-white/[0.015]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                {s.value}
              </div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
