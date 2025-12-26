import { Globe, Heart, Leaf, Lightbulb, Target, TrendingUp, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const impactAreas = [
  {
    icon: Heart,
    title: "Mental Health Improvement",
    description: "Early burnout detection leads to 40% reduction in severe burnout cases through proactive intervention.",
    stat: "40%",
    sublabel: "reduction in burnout",
  },
  {
    icon: TrendingUp,
    title: "Productivity Gains",
    description: "Users report 25% improvement in focus time and task completion rates after 4 weeks of use.",
    stat: "25%",
    sublabel: "productivity increase",
  },
  {
    icon: Zap,
    title: "Reduced Fatigue",
    description: "Smart break scheduling reduces end-of-day fatigue scores by an average of 35%.",
    stat: "35%",
    sublabel: "less fatigue",
  },
  {
    icon: Users,
    title: "Team Well-being",
    description: "Organizations using NeuroAdapt see 20% improvement in employee satisfaction scores.",
    stat: "20%",
    sublabel: "better satisfaction",
  },
];

const sdgGoals = [
  { number: 3, title: "Good Health & Well-being", description: "Promoting mental health and well-being through technology" },
  { number: 8, title: "Decent Work", description: "Supporting sustainable work practices and productivity" },
  { number: 10, title: "Reduced Inequalities", description: "Making wellness tools accessible globally" },
];

export function ImpactSection() {
  return (
    <section id="impact" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="gradient" className="mb-4">
            <Globe className="w-3 h-3 mr-1" />
            Social Impact
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Making a <span className="text-gradient">Real Difference</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            NeuroAdapt isn't just software—it's a movement towards healthier digital work culture worldwide.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {impactAreas.map((area, index) => (
            <Card key={index} variant="feature" className="text-center group">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <area.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-4xl font-display font-bold text-gradient mb-1">{area.stat}</div>
                <p className="text-sm text-muted-foreground">{area.sublabel}</p>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-2">{area.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* UN SDGs */}
        <Card variant="glass" className="max-w-4xl mx-auto mb-16">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Leaf className="w-5 h-5 text-secondary" />
              Aligned with UN Sustainable Development Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {sdgGoals.map((goal, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-display font-bold text-secondary">SDG {goal.number}</span>
                  </div>
                  <h4 className="font-display font-semibold mb-1">{goal.title}</h4>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Developing Countries */}
        <Card variant="elevated" className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-gradient-wellness flex items-center justify-center shadow-elevated">
                  <Globe className="w-10 h-10 text-secondary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2">Global Accessibility Matters</h3>
                <p className="text-muted-foreground">
                  Digital burnout disproportionately affects developing countries where remote work boundaries are 
                  less established, work hours are longer, and mental health resources are scarce. NeuroAdapt's 
                  freemium model ensures <strong>accessible wellness tools</strong> for individuals and organizations 
                  regardless of economic background, with planned <strong>multilingual support</strong> for global reach.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
