import { Brain, Database, GitBranch, RefreshCw, Scale, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mlFeatures = [
  "Weekly meeting hours",
  "Average meeting duration",
  "Email send/receive ratio",
  "Response time patterns",
  "Screen time distribution",
  "Focus session frequency",
  "Break pattern regularity",
  "Context-switching rate",
];

export function AISection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="gradient" className="mb-4">
            <Brain className="w-3 h-3 mr-1" />
            AI & Machine Learning
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Intelligent <span className="text-gradient">Burnout Detection</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our machine learning model analyzes behavioral patterns to provide early warnings and personalized recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Features Used */}
          <Card variant="elevated">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Features Analyzed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our model uses anonymized behavioral data points that respect user privacy while providing meaningful insights:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mlFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Details */}
          <Card variant="elevated">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                <GitBranch className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Model Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Classification Model</h4>
                <p className="text-sm text-muted-foreground">
                  Random Forest classifier with XGBoost ensemble for risk categorization (Low/Medium/High burnout risk).
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Continuous Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Model retraining with federated learning approach ensures privacy while improving accuracy over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ethics Card */}
        <Card variant="glass" className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <Scale className="w-7 h-7 text-secondary" />
                </div>
                <h4 className="font-display font-semibold mb-2">Bias Mitigation</h4>
                <p className="text-sm text-muted-foreground">
                  Regular audits to ensure fair predictions across demographics, roles, and work styles.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-display font-semibold mb-2">Explainable AI</h4>
                <p className="text-sm text-muted-foreground">
                  Every recommendation comes with clear explanations of why it was generated.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-7 h-7 text-accent" />
                </div>
                <h4 className="font-display font-semibold mb-2">Human Override</h4>
                <p className="text-sm text-muted-foreground">
                  Users always have control to dismiss, adjust, or pause AI recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
