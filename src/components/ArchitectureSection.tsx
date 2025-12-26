import { Database, Cloud, Brain, Code, ArrowRight, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const architectureLayers = [
  {
    title: "Data Collection Layer",
    icon: Database,
    color: "primary",
    items: [
      "Microsoft Graph API integration",
      "Screen time & app usage tracking",
      "Meeting & email metadata extraction",
      "Secure OAuth 2.0 authentication",
    ],
  },
  {
    title: "AI Processing Layer",
    icon: Brain,
    color: "accent",
    items: [
      "Azure Cognitive Services (Text Analytics)",
      "Azure Machine Learning (Burnout Detection)",
      "Sentiment analysis on communications",
      "Pattern recognition algorithms",
    ],
  },
  {
    title: "Backend Services",
    icon: Cloud,
    color: "secondary",
    items: [
      "Azure Functions (Serverless)",
      "Azure App Service (REST APIs)",
      "Azure Cosmos DB (Data Storage)",
      "Azure Key Vault (Secrets)",
    ],
  },
  {
    title: "Frontend Application",
    icon: Code,
    color: "success",
    items: [
      "React-based SPA dashboard",
      "Real-time data visualization",
      "Progressive Web App (PWA)",
      "Microsoft Teams integration",
    ],
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Code className="w-3 h-3 mr-1" />
            Technical Architecture
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Built on <span className="text-gradient">Microsoft Azure</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A robust, scalable architecture leveraging the full power of Microsoft's cloud ecosystem for enterprise-grade reliability and security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {architectureLayers.map((layer, index) => (
            <Card key={index} variant="elevated" className="relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-full h-1 bg-${layer.color}`} />
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-${layer.color}/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <layer.icon className={`w-6 h-6 text-${layer.color}`} />
                </div>
                <CardTitle className="text-base">{layer.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {layer.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-3 h-3 mt-1 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Flow Diagram */}
        <Card variant="glass" className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Data Flow Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
              {[
                { label: "M365 Data", sublabel: "Graph API" },
                { label: "AI Processing", sublabel: "Azure ML" },
                { label: "Analysis", sublabel: "Burnout Detection" },
                { label: "Dashboard", sublabel: "React App" },
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-display font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm font-medium mt-2">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.sublabel}</p>
                  </div>
                  {index < 3 && (
                    <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-secondary" />
              All data encrypted in transit and at rest with Azure security standards
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
