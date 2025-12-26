import { Award, Check, Heart, Lightbulb, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const judgingStrengths = [
  {
    icon: Target,
    title: "Real-World Problem Solving",
    description: "Addresses the urgent, globally relevant issue of digital burnout affecting hundreds of millions of Microsoft 365 users with measurable impact potential.",
  },
  {
    icon: Zap,
    title: "Deep Microsoft Ecosystem Integration",
    description: "Leverages Microsoft Graph API, Azure Cognitive Services, Azure ML, and Teams integration—showcasing the full power of Microsoft's cloud platform.",
  },
  {
    icon: Heart,
    title: "Social Good Focus",
    description: "Aligns perfectly with UN SDGs, prioritizes accessibility for developing countries, and embodies ethical AI principles with privacy-first design.",
  },
];

export function ImagineCupSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="gradient" className="mb-4">
            <Award className="w-3 h-3 mr-1" />
            Competition Ready
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            <span className="text-gradient">Imagine Cup</span> 2025
          </h2>
          <p className="text-lg text-muted-foreground">
            NeuroAdapt is designed and documented to meet Microsoft Imagine Cup's rigorous standards.
          </p>
        </div>

        {/* Submission Description */}
        <Card variant="elevated" className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Submission Description (150 words)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 rounded-lg bg-muted/50 border-l-4 border-primary">
              <p className="italic text-muted-foreground leading-relaxed">
                "NeuroAdapt is an AI-powered digital wellness platform that prevents burnout among Microsoft 365 users 
                by intelligently analyzing usage patterns and providing proactive wellness recommendations. Using 
                Microsoft Graph API for data collection and Azure Cognitive Services for sentiment analysis, our 
                machine learning model detects early burnout signals based on meeting overload, email patterns, and 
                screen time distribution. The React-based dashboard delivers personalized break suggestions, focus 
                window recommendations, and weekly wellness insights. Built with privacy-first principles, all data 
                processing is consent-based and encrypted. NeuroAdapt addresses the growing mental health crisis 
                affecting 400+ million M365 users globally, with special focus on accessibility for developing countries 
                where digital wellness resources are scarce. Aligned with UN SDGs for health and decent work, 
                NeuroAdapt transforms how professionals interact with technology—promoting sustainable productivity 
                without sacrificing well-being."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Judging Strengths */}
        <div className="max-w-5xl mx-auto mb-12">
          <h3 className="text-center font-display font-bold text-2xl mb-8">Key Judging Strengths</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {judgingStrengths.map((strength, index) => (
              <Card key={index} variant="feature" className="group">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <strength.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{strength.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{strength.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Microsoft Fit */}
        <Card variant="glass" className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-center font-display font-bold text-xl mb-6">Why NeuroAdapt Fits Microsoft's Vision</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Built entirely on Azure cloud infrastructure",
                "Deep integration with Microsoft 365 ecosystem",
                "Demonstrates Microsoft Graph API capabilities",
                "Showcases Azure AI/ML services",
                "Aligns with Microsoft's wellness initiatives",
                "Supports hybrid work transformation",
                "Embodies responsible AI principles",
                "Addresses enterprise and consumer markets",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
