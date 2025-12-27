import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="gradient" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Ready to Transform Your Digital Wellness?
          </Badge>

          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Start Your Journey to{" "}
            <span className="text-gradient">Sustainable Productivity</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've discovered a healthier way to work with Microsoft 365. 
            Free to start, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              Schedule Demo
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Trusted by teams at leading organizations worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
