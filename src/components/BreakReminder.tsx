import { Coffee, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductivity } from "@/hooks/use-productivity";

const breakTips = [
  "Take a short walk to refresh your mind",
  "Do some gentle stretching exercises",
  "Look at something 20 feet away for 20 seconds (20-20-20 rule)",
  "Drink a glass of water",
  "Take 5 deep breaths",
  "Step outside for fresh air"
];

export function BreakReminder() {
  const { showBreakReminder, dismissBreakReminder, formatTime, totalTime } = useProductivity();

  if (!showBreakReminder) return null;

  const randomTip = breakTips[Math.floor(Math.random() * breakTips.length)];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full animate-scale-in border-primary/20 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Coffee className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Time for a Break!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You've been working for <span className="font-semibold text-foreground">{formatTime(totalTime)}</span>. 
            Taking regular breaks helps maintain focus and prevent burnout.
          </p>
          
          <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
            <Leaf className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-left">{randomTip}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={dismissBreakReminder} className="flex-1">
              Take a 5-min Break
            </Button>
            <Button variant="ghost" size="icon" onClick={dismissBreakReminder}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
