import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FileText, Table2, Presentation, ArrowLeft, Clock, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import { useProductivity } from "@/hooks/use-productivity";

const tools = [
  {
    id: "docs",
    name: "NeuroDocs",
    description: "Rich text document editor with formatting, export, and auto-save",
    icon: FileText,
    route: "/docs",
    color: "from-blue-500 to-cyan-500",
    features: ["Rich Text Editing", "PDF Export", "Auto-save"]
  },
  {
    id: "sheets",
    name: "NeuroSheets",
    description: "Spreadsheet tool with formulas, cell formatting, and CSV support",
    icon: Table2,
    route: "/sheets",
    color: "from-emerald-500 to-teal-500",
    features: ["Formulas", "CSV Export", "Cell Formatting"]
  },
  {
    id: "slides",
    name: "NeuroSlides",
    description: "Presentation builder with themes, animations, and fullscreen mode",
    icon: Presentation,
    route: "/slides",
    color: "from-orange-500 to-rose-500",
    features: ["Slide Builder", "Themes", "Present Mode"]
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { totalTime, formatTime } = useProductivity();

  return (
    <>
      <Helmet>
        <title>Dashboard | NeuroAdapt Office Suite</title>
        <meta name="description" content="Choose your productivity tool - NeuroDocs, NeuroSheets, or NeuroSlides" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-display font-bold">NeuroAdapt Office Suite</h1>
                <p className="text-sm text-muted-foreground">Educational Demo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Session: {formatTime(totalTime)}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Choose Your Tool
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What would you like to create?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select one of our burnout-aware productivity tools designed for focused, mindful work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tools.map((tool) => (
              <Card 
                key={tool.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-border/50 overflow-hidden"
                onClick={() => navigate(tool.route)}
              >
                <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
                <CardHeader className="text-center pt-8">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tool.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-muted/30 border-border/50">
              <CardContent className="py-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Educational Demo:</strong> This project is for learning and demonstration purposes only. 
                  It is not intended to replace or compete with Microsoft products. 
                  All features are custom-built with original code.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
