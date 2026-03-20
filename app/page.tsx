"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WhyChoppaSection from "@/components/landing/WhyChoppaSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import ContactSection from "@/components/landing/ContactSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <Navbar isLoggedIn={isLoggedIn} />
      <HeroSection isLoggedIn={isLoggedIn} />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <WhyChoppaSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection />
      <CTASection onContactClick={() => scrollTo("contact")} />
      <Footer onNavClick={scrollTo} />
    </div>
  );
}
