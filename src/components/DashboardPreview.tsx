import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowDown, ArrowUp, BarChart3, Bell, Calendar, Clock, Coffee, Mail, TrendingDown, TrendingUp, Users, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DashboardPreview() {
  return (
    <section id="demo" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="gradient" className="mb-4">
            <BarChart3 className="w-3 h-3 mr-1" />
            Dashboard Preview
          </Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            See Your Wellness at a <span className="text-gradient">Glance</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            An intuitive dashboard that transforms complex usage data into actionable wellness insights.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="max-w-6xl mx-auto">
          <Card variant="elevated" className="overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gradient-primary p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-primary-foreground font-display font-semibold">NeuroAdapt Dashboard</h3>
                    <p className="text-primary-foreground/70 text-sm">Welcome back, Sarah!</p>
                  </div>
                </div>
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">
                  <Bell className="w-3 h-3 mr-1" />
                  2 new insights
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card variant="stat">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <Badge variant="low" className="text-xs">
                        <TrendingDown className="w-2 h-2 mr-1" />
                        -12%
                      </Badge>
                    </div>
                    <p className="text-2xl font-display font-bold">5.2h</p>
                    <p className="text-xs text-muted-foreground">Screen Time Today</p>
                  </CardContent>
                </Card>

                <Card variant="stat">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-accent" />
                      <Badge variant="medium" className="text-xs">
                        <ArrowUp className="w-2 h-2 mr-1" />
                        +2
                      </Badge>
                    </div>
                    <p className="text-2xl font-display font-bold">6</p>
                    <p className="text-xs text-muted-foreground">Meetings Today</p>
                  </CardContent>
                </Card>

                <Card variant="stat">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Mail className="w-5 h-5 text-secondary" />
                      <Badge variant="low" className="text-xs">Normal</Badge>
                    </div>
                    <p className="text-2xl font-display font-bold">42</p>
                    <p className="text-xs text-muted-foreground">Emails Processed</p>
                  </CardContent>
                </Card>

                <Card variant="stat">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Coffee className="w-5 h-5 text-warning" />
                      <Badge variant="success" className="text-xs">
                        <TrendingUp className="w-2 h-2 mr-1" />
                        Good
                      </Badge>
                    </div>
                    <p className="text-2xl font-display font-bold">4</p>
                    <p className="text-xs text-muted-foreground">Breaks Taken</p>
                  </CardContent>
                </Card>
              </div>

              {/* Burnout Risk */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card variant="glass">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Burnout Risk Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl font-display font-bold text-secondary">Low</div>
                      <Badge variant="low">32/100</Badge>
                    </div>
                    <Progress value={32} className="h-3 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Great job! Your work patterns are healthy. Keep maintaining regular breaks.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5 text-accent" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10">
                        <Coffee className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Take a 10-min break at 2:30 PM</p>
                          <p className="text-xs text-muted-foreground">Based on your meeting schedule</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10">
                        <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Block 9-11 AM for deep work</p>
                          <p className="text-xs text-muted-foreground">Your peak productivity hours</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Chart Placeholder */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Wellness Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-40 px-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                      const heights = [60, 45, 70, 55, 40, 25, 30];
                      const colors = heights[i] > 60 ? "bg-warning" : heights[i] > 50 ? "bg-primary" : "bg-secondary";
                      return (
                        <div key={day} className="flex flex-col items-center gap-2">
                          <div
                            className={`w-8 md:w-12 ${colors} rounded-t-lg transition-all hover:opacity-80`}
                            style={{ height: `${heights[i]}%` }}
                          />
                          <span className="text-xs text-muted-foreground">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center gap-6 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-secondary" />
                      <span>Low Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary" />
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-warning" />
                      <span>High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
