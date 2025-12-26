import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { AISection } from "@/components/AISection";
import { UXSection } from "@/components/UXSection";
import { DashboardPreview } from "@/components/DashboardPreview";
import { UseCasesSection } from "@/components/UseCasesSection";
import { ImpactSection } from "@/components/ImpactSection";
import { SecuritySection } from "@/components/SecuritySection";
import { ScalabilitySection } from "@/components/ScalabilitySection";
import { ImagineCupSection } from "@/components/ImagineCupSection";
import { PitchDeckSection } from "@/components/PitchDeckSection";
import { DemoSection } from "@/components/DemoSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>NeuroAdapt | AI-Powered Digital Burnout Prevention for Microsoft 365</title>
        <meta 
          name="description" 
          content="NeuroAdapt intelligently monitors your Microsoft 365 usage patterns to detect burnout signals and suggest healthier, more productive workflows. Privacy-first, AI-powered wellness." 
        />
        <meta name="keywords" content="digital wellness, burnout prevention, Microsoft 365, AI, mental health, productivity" />
        <link rel="canonical" href="https://neuroadapt.app" />
        
        {/* Open Graph */}
        <meta property="og:title" content="NeuroAdapt | AI-Powered Digital Burnout Prevention" />
        <meta property="og:description" content="Prevent digital burnout with AI-powered wellness monitoring for Microsoft 365 users." />
        <meta property="og:type" content="website" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "NeuroAdapt",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web",
            "description": "AI-powered digital burnout prevention platform for Microsoft 365 users",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <ProblemSection />
          <SolutionSection />
          <FeaturesSection />
          <ArchitectureSection />
          <AISection />
          <UXSection />
          <DashboardPreview />
          <UseCasesSection />
          <ImpactSection />
          <SecuritySection />
          <ScalabilitySection />
          <ImagineCupSection />
          <PitchDeckSection />
          <DemoSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
