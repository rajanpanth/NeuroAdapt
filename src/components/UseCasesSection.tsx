import { BookOpen, Briefcase, GraduationCap, Laptop, User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const useCases = [
  {
    icon: GraduationCap,
    title: "University Student",
    persona: "Maria, 21, Computer Science Major",
    scenario: "Maria spends 8+ hours daily between online classes, research, and group projects on Teams. She often feels exhausted but doesn't realize her meeting-to-break ratio is severely imbalanced.",
    benefit: "NeuroAdapt alerts Maria when her screen time exceeds healthy limits and schedules micro-breaks between classes, improving her focus and reducing eye strain by 30%.",
    color: "primary",
  },
  {
    icon: Laptop,
    title: "Remote Worker",
    persona: "James, 35, Software Developer",
    scenario: "Working from home since 2020, James has no clear boundaries between work and personal time. His email checking extends into evenings, and he often skips lunch.",
    benefit: "The AI detects James' after-hours email patterns and suggests boundary-setting. Weekly reports help him visualize improvement and maintain work-life balance.",
    color: "accent",
  },
  {
    icon: Briefcase,
    title: "Corporate Manager",
    persona: "Priya, 42, Marketing Director",
    scenario: "Priya manages a global team across time zones, attending 6-8 meetings daily. She experiences chronic fatigue and declining decision quality.",
    benefit: "NeuroAdapt identifies meeting fatigue patterns and suggests batching meetings, protecting focus time, and delegating when burnout risk increases.",
    color: "secondary",
  },
  {
    icon: BookOpen,
    title: "Teacher / Educator",
    persona: "David, 38, High School Teacher",
    scenario: "Since moving to hybrid teaching, David juggles in-person classes with online office hours, grading on OneNote, and parent communications via Outlook.",
    benefit: "Smart scheduling helps David protect grading blocks and suggests optimal times for parent meetings, reducing context-switching stress.",
    color: "warning",
  },
  {
    icon: User,
    title: "Freelancer",
    persona: "Sophie, 29, UX Designer",
    scenario: "Managing multiple client projects, Sophie uses M365 for some clients and struggles to track total screen time across contexts.",
    benefit: "Consolidated wellness insights across all M365 activities help Sophie maintain healthy habits regardless of which client project she's working on.",
    color: "success",
  },
];

export function UseCasesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Users className="w-3 h-3 mr-1" />
            Use Cases
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Built for <span className="text-gradient">Everyone</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From students to executives, NeuroAdapt adapts to diverse work patterns and lifestyles.
          </p>
        </div>

        <div className="space-y-6">
          {useCases.map((useCase, index) => (
            <Card key={index} variant="elevated" className="overflow-hidden">
              <div className="grid md:grid-cols-3 gap-0">
                <div className={`bg-${useCase.color}/10 p-6 flex flex-col justify-center`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${useCase.color}/20 flex items-center justify-center`}>
                      <useCase.icon className={`w-6 h-6 text-${useCase.color}`} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold">{useCase.title}</h3>
                      <p className="text-sm text-muted-foreground">{useCase.persona}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-l border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">SCENARIO</h4>
                  <p className="text-sm">{useCase.scenario}</p>
                </div>
                <div className="p-6 border-l border-border bg-card">
                  <h4 className="text-sm font-semibold text-secondary mb-2">NEUROADAPT BENEFIT</h4>
                  <p className="text-sm">{useCase.benefit}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
