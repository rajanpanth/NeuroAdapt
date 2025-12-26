import { 
  Activity, 
  BarChart3, 
  Bell, 
  Brain, 
  Calendar, 
  Clock, 
  Eye, 
  Focus, 
  Heart, 
  LineChart, 
  Lock, 
  Lightbulb,
  Settings,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: BarChart3,
    title: "Smart Analytics Dashboard",
    description: "Real-time visualization of your M365 usage patterns with intuitive charts showing screen time, meeting load, and email volume trends.",
    badge: "Core Feature",
    badgeVariant: "default" as const,
  },
  {
    icon: Activity,
    title: "Burnout Risk Score",
    description: "AI-calculated risk indicator (Low/Medium/High) based on your usage patterns, with explanations of contributing factors.",
    badge: "AI-Powered",
    badgeVariant: "gradient" as const,
  },
  {
    icon: Lightbulb,
    title: "Smart Break Recommendations",
    description: "Context-aware suggestions for optimal break times based on your work patterns and cognitive load indicators.",
    badge: "Wellness",
    badgeVariant: "success" as const,
  },
  {
    icon: Focus,
    title: "Focus Window Scheduling",
    description: "Identify and protect your most productive hours. NeuroAdapt learns when you work best and suggests blocking distractions.",
    badge: "Productivity",
    badgeVariant: "secondary" as const,
  },
  {
    icon: Bell,
    title: "Mindfulness Nudges",
    description: "Gentle, non-intrusive reminders to practice breathing exercises, stretch, or take a short mindful break.",
    badge: "Mental Health",
    badgeVariant: "warning" as const,
  },
  {
    icon: LineChart,
    title: "Weekly Wellness Insights",
    description: "Comprehensive weekly reports showing your progress, trends, achievements, and personalized improvement suggestions.",
    badge: "Reports",
    badgeVariant: "default" as const,
  },
  {
    icon: Lock,
    title: "Privacy Controls",
    description: "Full control over what data is collected and analyzed. Consent-based processing with easy opt-out options.",
    badge: "Security",
    badgeVariant: "outline" as const,
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set personal wellness goals like reducing meeting time, increasing focus hours, or taking regular breaks.",
    badge: "Personal",
    badgeVariant: "secondary" as const,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="gradient" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Everything You Need for{" "}
            <span className="text-gradient">Digital Wellness</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive tools designed to help you maintain a healthy relationship with technology while maximizing productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} variant="feature" className="group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant={feature.badgeVariant} className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
