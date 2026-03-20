import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
];

const COMPANY_LINKS = ["About Us", "Blog", "Careers", "Press"];

const LEGAL_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Support Center",
];

interface FooterProps {
  onNavClick: (id: string) => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  return (
    <footer className="border-t border-white/5 py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-base">C</span>
              </div>
              <span className="text-white font-black text-lg">Choppa</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              The smart WhatsApp ordering platform for Ghanaian restaurants.
            </p>
            <div className="text-gray-600 text-sm">Made with ❤️ in Ghana 🇬🇭</div>
          </div>

          {/* Product */}
          <div>
            <div className="text-white font-semibold text-sm mb-4">Product</div>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => onNavClick(l.id)}
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                  Sign in (existing customers)
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="text-white font-semibold text-sm mb-4">Company</div>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="text-white font-semibold text-sm mb-4">
              Legal &amp; Support
            </div>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm">
            © 2024 Choppa. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
