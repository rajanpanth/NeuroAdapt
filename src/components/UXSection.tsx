import { Accessibility, Layout, MousePointer, Palette, Smartphone, User, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const uxFeatures = [
  {
    icon: MousePointer,
    title: "Intuitive Onboarding",
    description: "3-step setup: Connect M365 → Set preferences → Start monitoring. Under 2 minutes to get started.",
  },
  {
    icon: Layout,
    title: "Clean Dashboard Design",
    description: "Information hierarchy prioritizes actionable insights. No clutter, just what you need to know.",
  },
  {
    icon: Smartphone,
    title: "Responsive Experience",
    description: "Full functionality on desktop, tablet, and mobile. PWA support for app-like experience.",
  },
  {
    icon: Accessibility,
    title: "Accessibility First",
    description: "WCAG 2.1 AA compliant. Screen reader support, keyboard navigation, and high-contrast modes.",
  },
];

export function UXSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Palette className="w-3 h-3 mr-1" />
            User Experience
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Designed for <span className="text-gradient">Humans</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Beautiful, intuitive interfaces that make wellness tracking effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {uxFeatures.map((feature, index) => (
            <Card key={index} variant="elevated" className="group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Personas Comparison */}
        <Card variant="glass" className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Tailored Experiences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold">Student Mode</h4>
                    <p className="text-sm text-muted-foreground">Academic-focused features</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Class schedule integration</li>
                  <li>• Study session tracking</li>
                  <li>• Exam week stress alerts</li>
                  <li>• Pomodoro-style focus modes</li>
                  <li>• Social study break suggestions</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-accent/5 border border-accent/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold">Professional Mode</h4>
                    <p className="text-sm text-muted-foreground">Work-optimized features</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Meeting load analytics</li>
                  <li>• Email volume tracking</li>
                  <li>• Work hours boundaries</li>
                  <li>• Focus block protection</li>
                  <li>• Team wellness insights</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
