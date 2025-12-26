import { Presentation, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const slides = [
  { number: 1, title: "Title Slide", content: "NeuroAdapt: AI-Powered Digital Burnout Prevention for Microsoft 365" },
  { number: 2, title: "The Problem", content: "Digital burnout affects 76% of workers, costing $190B annually. M365 usage patterns contribute to cognitive fatigue." },
  { number: 3, title: "Our Solution", content: "AI wellness assistant that monitors M365 usage, detects burnout signals, and suggests healthy workflows." },
  { number: 4, title: "Live Demo", content: "Walkthrough of dashboard showing real-time analytics, burnout risk score, and AI recommendations." },
  { number: 5, title: "AI Technology", content: "Azure ML classification model, Graph API integration, sentiment analysis, explainable AI approach." },
  { number: 6, title: "Architecture", content: "Microsoft ecosystem: Graph API → Azure Functions → Azure ML → React Dashboard → Teams Integration" },
  { number: 7, title: "Impact & SDGs", content: "40% burnout reduction, 25% productivity gains, aligned with SDG 3, 8, and 10 goals." },
  { number: 8, title: "Market Opportunity", content: "400M+ M365 users globally, $12B digital wellness market, enterprise + freemium model." },
  { number: 9, title: "Future Vision", content: "Mobile apps, wearables, enterprise analytics, multilingual support, cross-platform expansion." },
  { number: 10, title: "Call to Action", content: "Join us in creating a healthier digital work culture. Try NeuroAdapt today!" },
];

export function PitchDeckSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Presentation className="w-3 h-3 mr-1" />
            Pitch Deck
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            10-Slide <span className="text-gradient">Presentation Outline</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A structured pitch deck ready for competition presentations and investor meetings.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {slides.map((slide) => (
              <Card key={slide.number} variant="feature" className="group hover:shadow-elevated transition-all">
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <span className="text-xl font-display font-bold text-primary">{slide.number}</span>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold mb-1">{slide.title}</h4>
                      <p className="text-sm text-muted-foreground">{slide.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
