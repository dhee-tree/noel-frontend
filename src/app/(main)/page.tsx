import {
  Hero,
  Features,
  HowItWorks,
  Testimonials,
  Faq,
  Snowfall,
  Cta,
  BackToTop,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Snowfall />
      <main style={{ width: "100%", overflow: "hidden" }}>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <BackToTop />
    </div>
  );
}
