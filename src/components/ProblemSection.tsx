import { AlertTriangle, Brain, Clock, Heart, TrendingDown, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const problems = [
  {
    icon: Clock,
    title: "Screen Time Overload",
    description: "Average knowledge workers spend 6.5+ hours daily on digital tools, leading to cognitive fatigue and reduced attention spans.",
    stat: "6.5+ hrs/day",
  },
  {
    icon: AlertTriangle,
    title: "Meeting Fatigue",
    description: "Remote workers attend 13% more meetings post-pandemic, with back-to-back calls causing 'Zoom fatigue' and decision paralysis.",
    stat: "13% more meetings",
  },
  {
    icon: TrendingDown,
    title: "Productivity Loss",
    description: "Burnout costs organizations $125-190 billion in healthcare spending annually, with productivity losses even higher.",
    stat: "$190B annually",
  },
  {
    icon: Heart,
    title: "Mental Health Crisis",
    description: "76% of employees experience burnout at least sometimes, with digital tools being a major contributing factor.",
    stat: "76% affected",
  },
  {
    icon: Users,
    title: "Global Impact",
    description: "Burnout affects developing countries disproportionately where work-life boundaries are less established in remote work culture.",
    stat: "Global issue",
  },
  {
    icon: Brain,
    title: "Cognitive Decline",
    description: "Constant context-switching between apps reduces cognitive performance by up to 40%, impacting quality of work.",
    stat: "40% decline",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            The Digital Burnout <span className="text-gradient">Epidemic</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Microsoft 365 powers productivity for over 400 million users worldwide. But without proper wellness monitoring, these powerful tools can contribute to a growing mental health crisis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <Card key={index} variant="feature" className="group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                  <problem.icon className="w-6 h-6 text-destructive" />
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{problem.title}</CardTitle>
                  <span className="text-sm font-bold text-destructive">{problem.stat}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl font-display font-semibold text-foreground">
            "Digital burnout isn't just about screen time—it's about{" "}
            <span className="text-destructive">how</span> we use technology."
          </p>
        </div>
      </div>
    </section>
  );
}
