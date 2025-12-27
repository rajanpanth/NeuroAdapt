import { Check, Lock, Shield, Eye, Server, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted using AES-256 in transit and at rest, with Azure security infrastructure.",
  },
  {
    icon: Eye,
    title: "User Consent First",
    description: "No data collection without explicit opt-in. Users control exactly what is tracked and analyzed.",
  },
  {
    icon: Server,
    title: "Data Anonymization",
    description: "Personal identifiers are removed from ML training data. Analytics use aggregated, anonymous patterns.",
  },
  {
    icon: Key,
    title: "Azure Key Vault",
    description: "All secrets and credentials managed through Azure Key Vault with strict access controls.",
  },
];

const complianceItems = [
  "GDPR Compliant",
  "SOC 2 Type II Ready",
  "Microsoft Trust Center Standards",
  "Ethical AI Principles",
  "Regular Security Audits",
  "Data Residency Options",
];

export function SecuritySection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Shield className="w-3 h-3 mr-1" />
            Security & Privacy
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Your Privacy is <span className="text-gradient">Non-Negotiable</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Built with privacy-by-design principles, NeuroAdapt ensures your wellness data stays protected.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityFeatures.map((feature, index) => (
            <Card key={index} variant="elevated" className="group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compliance Grid */}
        <Card variant="glass" className="max-w-3xl mx-auto mb-12">
          <CardContent className="p-8">
            <h3 className="text-center font-display font-bold text-xl mb-6">Compliance & Standards</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {complianceItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="max-w-4xl mx-auto border-warning/30 bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h4 className="font-display font-bold mb-2">Important Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  NeuroAdapt is a <strong>digital wellness tool</strong> designed to provide insights and suggestions 
                  for healthier technology usage patterns. It is <strong>NOT a medical device</strong> and does not 
                  diagnose, treat, or prevent any medical or mental health conditions. If you are experiencing 
                  symptoms of burnout, anxiety, or depression, please consult a qualified healthcare professional. 
                  NeuroAdapt's recommendations are informational only and should not replace professional medical advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
