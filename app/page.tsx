"use client";

import Hero from "./components/ui/landing-page/Hero";
import Header from "./components/ui/Header";
import Preview from "./components/ui/landing-page/Preview";
import Features from "./components/ui/landing-page/Features";
import Benefits from "./components/ui/landing-page/Benefits";
import HowItWorks from "./components/ui/landing-page/HowItWorks";
import ArticlesPreview from "./components/ui/landing-page/ArticlesPreview";
import UseCases from "./components/ui/landing-page/UseCases";
import FinalCTA from "./components/ui/landing-page/FinalCTA";
import Footer from "./components/ui/landing-page/Footer";

export default function FormBuilderLandingPage() {
  return (
    <div className="bg-linear-60 from-foreground/50 to-background relative z-1">
      <Header />
      <Hero />
      <div className="container pb-0 space-y-24">
        <Preview />
        <Features />
        <Benefits />
        <HowItWorks />
        <ArticlesPreview />
        <UseCases />
        <FinalCTA />
      </div>
      <Footer />
    </div>
  );
}
