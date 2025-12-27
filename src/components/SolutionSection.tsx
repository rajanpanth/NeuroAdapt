import { Activity, Brain, Coffee, Eye, Lock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const solutionPoints = [
  {
    icon: Activity,
    title: "Smart Usage Analytics",
    description: "Track Microsoft 365 usage patterns including screen time, meeting frequency, email volume, and context-switching behavior.",
    color: "primary",
  },
  {
    icon: Brain,
    title: "AI Burnout Detection",
    description: "Machine learning models analyze usage patterns to identify early burnout signals before they become critical.",
    color: "accent",
  },
  {
    icon: Coffee,
    title: "Healthy Break Suggestions",
    description: "Receive timely recommendations for breaks, focus sessions, and mindful workflows based on your work patterns.",
    color: "secondary",
  },
  {
    icon: Lock,
    title: "Privacy-First Design",
    description: "All data processing is consent-based, encrypted, and never shared. NeuroAdapt is a wellness tool, not surveillance.",
    color: "success",
  },
];

export function SolutionSection() {
  return (
    <section id="solution" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Eye className="w-3 h-3 mr-1" />
            Our Solution
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Meet <span className="text-gradient">NeuroAdapt</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            An AI-powered wellness assistant that integrates seamlessly with Microsoft 365 to monitor, detect, and prevent digital burnout through intelligent recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {solutionPoints.map((point, index) => (
            <Card key={index} variant="elevated" className="group">
              <CardHeader>
                <div className={`w-14 h-14 rounded-2xl bg-${point.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <point.icon className={`w-7 h-7 text-${point.color}`} />
                </div>
                <CardTitle className="text-xl">{point.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{point.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card variant="glass" className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-elevated">
                  <TrendingUp className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2">Ethical & Non-Medical</h3>
                <p className="text-muted-foreground">
                  NeuroAdapt is a <strong>wellness enhancement tool</strong>, not a diagnostic or medical device. 
                  It provides suggestions to improve digital habits and is designed with ethical AI principles at its core. 
                  Always consult healthcare professionals for medical concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
