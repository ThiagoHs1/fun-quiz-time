import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Area, AreaChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  BarChart3, Target, Trophy, HelpCircle, Star, Flame,
} from "lucide-react";
import {
  getPlayedHistory, getOverviewStats, getCategoryScores,
  getActivityHeatmap, getBestScores, getMostPlayed, seedDemoHistory,
  type PlayedQuiz,
} from "@/lib/player-stats";

export default function Stats() {
  const [history, setHistory] = useState<PlayedQuiz[]>([]);

  useEffect(() => {
    seedDemoHistory();
    setHistory(getPlayedHistory());
  }, []);

  const overview = useMemo(() => getOverviewStats(history), [history]);
  const categoryScores = useMemo(() => getCategoryScores(history), [history]);
  const heatmap = useMemo(() => getActivityHeatmap(history), [history]);
  const bestScores = useMemo(() => getBestScores(history), [history]);
  const mostPlayed = useMemo(() => getMostPlayed(history), [history]);

  const recentGames = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime())
      .slice(-20)
      .map((h, i) => ({
        index: i + 1,
        percentage: h.percentage,
        title: h.quizTitle,
        date: new Date(h.playedAt).toLocaleDateString(),
      }));
  }, [history]);

  // Linear regression for trend line
  const trendData = useMemo(() => {
    if (recentGames.length < 2) return recentGames;
    const n = recentGames.length;
    const sumX = recentGames.reduce((s, _, i) => s + i, 0);
    const sumY = recentGames.reduce((s, g) => s + g.percentage, 0);
    const sumXY = recentGames.reduce((s, g, i) => s + i * g.percentage, 0);
    const sumXX = recentGames.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return recentGames.map((g, i) => ({
      ...g,
      trend: Math.round(Math.max(0, Math.min(100, slope * i + intercept))),
    }));
  }, [recentGames]);

  const maxHeat = Math.max(1, ...heatmap.map((d) => d.count));

  const overviewCards = [
    { label: "Quizzes Played", value: overview.total, icon: HelpCircle },
    { label: "Average Score", value: `${overview.avgScore}%`, icon: Target },
    { label: "Perfect Scores", value: overview.perfectScores, icon: Trophy },
    { label: "Questions Answered", value: overview.totalQuestions, icon: BarChart3 },
    { label: "Favorite Category", value: overview.favoriteCategory, icon: Star },
  ];

  if (history.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 text-center py-20">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Statistics</h1>
          <p className="text-muted-foreground">Play some quizzes to see your stats here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Your Statistics</h1>
          <p className="text-sm text-muted-foreground">Track your quiz performance over time</p>
        </div>

        {/* Row 1: Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {overviewCards.map((c) => (
            <Card key={c.label} className="bg-card">
              <CardContent className="p-4 text-center">
                <c.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Row 2: Evolution Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold mb-4">Score Evolution (Last 20 games)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="index" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" className="fill-muted-foreground" />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-popover p-2 text-xs shadow-md">
                          <p className="font-medium">{d.title}</p>
                          <p className="text-muted-foreground">{d.percentage}% — {d.date}</p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone" dataKey="percentage"
                    stroke="hsl(262, 83%, 58%)" strokeWidth={2}
                    fill="url(#scoreGrad)"
                  />
                  <Line
                    type="monotone" dataKey="trend"
                    stroke="hsl(262, 83%, 58%)" strokeWidth={1.5}
                    strokeDasharray="6 4" dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Row 3: Radar + Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-4">Score by Category</h3>
              <div className="h-64">
                {categoryScores.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={categoryScores}>
                      <PolarGrid className="stroke-border" />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        dataKey="score" stroke="hsl(262, 83%, 58%)" fill="hsl(262, 83%, 58%)"
                        fillOpacity={0.2} strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Play quizzes in different categories
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Breakdown */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-4">Performance Summary</h3>
              <div className="space-y-6 pt-4">
                {[
                  { label: "Best Score", value: `${bestScores[0]?.percentage ?? 0}%`, sub: bestScores[0]?.quizTitle ?? "—", color: "text-green-500" },
                  { label: "Worst Score", value: `${[...history].sort((a, b) => a.percentage - b.percentage)[0]?.percentage ?? 0}%`, sub: [...history].sort((a, b) => a.percentage - b.percentage)[0]?.quizTitle ?? "—", color: "text-red-500" },
                  { label: "Avg Time", value: `${Math.round(history.reduce((s, h) => s + h.timeTaken, 0) / history.length)}s`, sub: "per quiz", color: "text-primary" },
                  { label: "Streak", value: `${history.length}`, sub: "total games", color: "text-amber-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">{item.sub}</p>
                    </div>
                    <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 4: Activity Heatmap */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" /> Activity (Last 90 days)
            </h3>
            <div className="flex flex-wrap gap-[3px]">
              {heatmap.map((day) => {
                const opacity = day.count === 0 ? 0.08 : 0.15 + (day.count / maxHeat) * 0.85;
                return (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-3 h-3 rounded-sm cursor-default"
                        style={{
                          backgroundColor: `hsl(262, 83%, 58%)`,
                          opacity,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {day.label} — {day.count} quiz{day.count !== 1 ? "zes" : ""} played
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Row 5: Records */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" /> Best Scores
              </h3>
              <div className="space-y-3">
                {bestScores.map((b, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{b.quizTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.score}/{b.totalQuestions} — {new Date(b.playedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary shrink-0">{b.percentage}%</span>
                  </div>
                ))}
                {bestScores.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" /> Most Played
              </h3>
              <div className="space-y-3">
                {mostPlayed.map((m, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <p className="text-sm font-medium truncate">{m.title}</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground shrink-0">
                      {m.count}× played
                    </span>
                  </div>
                ))}
                {mostPlayed.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
