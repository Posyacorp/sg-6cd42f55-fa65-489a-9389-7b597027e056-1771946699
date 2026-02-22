import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Star,
  Trophy,
  Target
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/anchor/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Income", href: "/anchor/income", icon: <DollarSign className="w-4 h-4" /> },
  { label: "Call Price", href: "/anchor/call-price", icon: <Settings className="w-4 h-4" /> },
  { label: "Level", href: "/anchor/level", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Withdraw", href: "/anchor/withdraw", icon: <DollarSign className="w-4 h-4" /> }
];

const levels = [
  { level: 1, name: "Novice", sessions: "0-50", badge: "🌱", benefits: ["Basic profile visibility", "Standard support"] },
  { level: 2, name: "Rising Star", sessions: "51-150", badge: "⭐", benefits: ["Enhanced profile", "Priority listing", "Featured occasionally"] },
  { level: 3, name: "Established", sessions: "151-300", badge: "💫", benefits: ["Top search results", "Marketing support", "Bonus rewards"] },
  { level: 4, name: "Elite", sessions: "301-500", badge: "🏆", benefits: ["Premium placement", "Personal manager", "Exclusive events"] },
  { level: 5, name: "Master", sessions: "501-750", badge: "👑", benefits: ["VIP treatment", "Custom rates", "Revenue share boost"] },
  { level: 6, name: "Legend", sessions: "750+", badge: "💎", benefits: ["Ultimate visibility", "Brand partnerships", "Maximum earnings"] }
];

export default function AnchorLevel() {
  const currentLevel = 3;

  return (
    <>
      <SEO title="Level & Progress - Pukaarly Anchor" />
      <DashboardLayout navItems={navItems} role="anchor">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Level & Progress</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your growth and unlock rewards</p>
          </div>

          {/* Current Level Card */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-6xl mb-2">💫</div>
                  <h2 className="text-3xl font-bold">Level {currentLevel}</h2>
                  <p className="text-purple-100">Established Anchor</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">234</div>
                  <p className="text-purple-100">Total Sessions</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {currentLevel + 1}</span>
                  <span>234 / 300 sessions</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className="bg-white h-3 rounded-full" style={{ width: "78%" }} />
                </div>
                <p className="text-sm text-purple-100">66 more sessions to reach Elite level</p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold">4.8</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">156 reviews</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">98%</div>
                <p className="text-xs text-gray-500 mt-1">230/234 completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2.3m</div>
                <p className="text-xs text-gray-500 mt-1">Average response</p>
              </CardContent>
            </Card>
          </div>

          {/* All Levels */}
          <Card>
            <CardHeader>
              <CardTitle>Level System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {levels.map((level, i) => {
                  const isCurrentLevel = level.level === currentLevel;
                  const isPastLevel = level.level < currentLevel;
                  
                  return (
                    <div 
                      key={i} 
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCurrentLevel 
                          ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20" 
                          : isPastLevel
                          ? "border-gray-300 dark:border-gray-700 opacity-50"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{level.badge}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">Level {level.level}: {level.name}</h3>
                              {isCurrentLevel && <Badge className="bg-purple-600">Current</Badge>}
                              {isPastLevel && <Badge variant="outline">Completed</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{level.sessions} sessions required</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Benefits:</p>
                        <ul className="space-y-1">
                          {level.benefits.map((benefit, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}