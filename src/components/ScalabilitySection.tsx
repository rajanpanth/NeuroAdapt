import { Globe, Laptop, Smartphone, Users, Watch, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const futureItems = [
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native iOS and Android apps for wellness tracking on the go with push notifications.",
    timeline: "Q2 2025",
  },
  {
    icon: Watch,
    title: "Wearable Integration",
    description: "Connect with Apple Watch, Fitbit, and Microsoft Band for heart rate and stress monitoring.",
    timeline: "Q3 2025",
  },
  {
    icon: Users,
    title: "Enterprise Dashboard",
    description: "Team-level anonymous analytics for managers to understand organizational wellness trends.",
    timeline: "Q3 2025",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Full localization for Spanish, French, German, Hindi, Mandarin, and Arabic.",
    timeline: "Q4 2025",
  },
  {
    icon: Zap,
    title: "Advanced AI Personalization",
    description: "Deep learning models that adapt to individual work styles and preferences over time.",
    timeline: "2026",
  },
  {
    icon: Laptop,
    title: "Cross-Platform Expansion",
    description: "Integration with Google Workspace and Slack for comprehensive productivity wellness.",
    timeline: "2026",
  },
];

export function ScalabilitySection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="gradient" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Future Vision
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Scalability & <span className="text-gradient">Roadmap</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our ambitious roadmap for expanding NeuroAdapt's capabilities and global reach.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

            {/* Timeline items */}
            <div className="space-y-8">
              {futureItems.map((item, index) => (
                <div key={index} className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary -translate-x-1/2 z-10" />
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <Card variant="feature" className="group">
                      <CardHeader className="pb-2">
                        <div className={`flex items-center gap-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-1">{item.timeline}</Badge>
                            <CardTitle className="text-base">{item.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
