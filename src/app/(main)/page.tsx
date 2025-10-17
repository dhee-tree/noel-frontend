import {
  Hero,
  Features,
  HowItWorks,
  Testimonials,
  Faq,
  Snowfall,
  Cta,
} from "@/components/landing";

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
