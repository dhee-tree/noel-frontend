import { Hero } from "@/components/landing/Hero/Hero";
import { Features } from "@/components/landing/Features/Features";
import { HowItWorks } from "@/components/landing/HowItWorks/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials/Testimonials";
import { Faq } from "@/components/landing/Faq/Faq";
import { Snowfall } from "@/components/landing/Snowfall/Snowfall";
import { Cta } from "@/components/landing/Cta/Cta";

export default function LandingPage() {
  return (
    <div className="relative">
      <Snowfall />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
    </div>
  );
}
