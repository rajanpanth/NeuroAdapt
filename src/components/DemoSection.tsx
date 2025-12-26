import { Play, ArrowRight, Bell, Coffee, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const demoSteps = [
  {
    time: "0:00",
    action: "Sarah opens her NeuroAdapt dashboard",
    detail: "The dashboard loads with her personalized wellness summary, showing she's had 5 meetings already today.",
  },
  {
    time: "0:15",
    action: "Views Burnout Risk Score",
    detail: "Her score shows 'Medium' (58/100) with a warning that back-to-back meetings are increasing stress indicators.",
  },
  {
    time: "0:30",
    action: "AI Recommendation appears",
    detail: "NeuroAdapt suggests: 'Take a 15-minute break at 2:30 PM. Your focus capacity is declining after 4 consecutive hours.'",
  },
  {
    time: "0:45",
    action: "Sarah accepts the break suggestion",
    detail: "The system blocks her calendar and sends a Teams status update: 'Taking a wellness break. Back at 2:45 PM.'",
  },
  {
    time: "1:00",
    action: "Mindfulness nudge delivered",
    detail: "A gentle notification offers a 2-minute breathing exercise. Sarah completes it and feels refreshed.",
  },
  {
    time: "1:15",
    action: "Reviews Weekly Insights",
    detail: "The report shows she reduced meeting time by 15% this week and took 20% more breaks than last week. Progress!",
  },
];

export function DemoSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="gradient" className="mb-4">
            <Play className="w-3 h-3 mr-1" />
            Demo Walkthrough
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            See It in <span className="text-gradient">Action</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A 90-second demo scenario showing how NeuroAdapt helps a busy professional manage digital wellness.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card variant="elevated" className="overflow-hidden">
            <CardHeader className="bg-gradient-primary text-primary-foreground">
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Demo Scenario: A Day with NeuroAdapt
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {demoSteps.map((step, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <span className="text-sm font-mono font-bold text-primary">{step.time}</span>
                      </div>
                      {index < demoSteps.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h4 className="font-display font-semibold mb-1">{step.action}</h4>
                      <p className="text-sm text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-xl bg-secondary/10 border border-secondary/20">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-secondary" />
                  <h4 className="font-display font-semibold">Demo Outcome</h4>
                </div>
                <p className="text-muted-foreground">
                  Sarah ends her workday feeling more balanced. Her burnout risk score dropped from 58 to 42 after 
                  taking the recommended breaks. She's more productive in the afternoon and doesn't carry work fatigue 
                  into her evening. Over time, NeuroAdapt helps her build sustainable work habits that prevent chronic burnout.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
