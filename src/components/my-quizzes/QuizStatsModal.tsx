import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { FullQuiz } from "@/lib/mock-quizzes";
import { getResultsForQuiz, type MockResult } from "@/lib/quiz-store";
import { Users, Target, Star, Trophy } from "lucide-react";

interface Props {
  quiz: FullQuiz | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuizStatsModal({ quiz, open, onOpenChange }: Props) {
  if (!quiz) return null;

  const results = getResultsForQuiz(quiz.id);
  const totalPlays = results.length || quiz.play_count;
  const avgScore = results.length
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : 0;
  const avgRating = quiz.rating_count > 0
    ? (quiz.rating_sum / quiz.rating_count).toFixed(1)
    : "N/A";
  const bestResult = results.length
    ? results.reduce((best, r) => (r.percentage > best.percentage ? r : best), results[0])
    : null;

  // Score distribution
  const distBuckets = [
    { range: "0-20%", count: 0 },
    { range: "21-40%", count: 0 },
    { range: "41-60%", count: 0 },
    { range: "61-80%", count: 0 },
    { range: "81-100%", count: 0 },
  ];
  results.forEach((r) => {
    if (r.percentage <= 20) distBuckets[0].count++;
    else if (r.percentage <= 40) distBuckets[1].count++;
    else if (r.percentage <= 60) distBuckets[2].count++;
    else if (r.percentage <= 80) distBuckets[3].count++;
    else distBuckets[4].count++;
  });

  // Hardest questions
  const questionErrors: { text: string; errorRate: number }[] = [];
  if (quiz.questions.length > 0 && results.length > 0) {
    quiz.questions.forEach((q) => {
      const answersForQ = results.flatMap((r) =>
        r.answers.filter((a) => a.question_id === q.id)
      );
      const total = answersForQ.length;
      const wrong = answersForQ.filter((a) => !a.correct).length;
      if (total > 0) {
        questionErrors.push({
          text: q.question_text.length > 40 ? q.question_text.slice(0, 40) + "…" : q.question_text,
          errorRate: Math.round((wrong / total) * 100),
        });
      }
    });
    questionErrors.sort((a, b) => b.errorRate - a.errorRate);
  }

  const overviewCards = [
    { label: "Total Plays", value: totalPlays.toString(), icon: Users },
    { label: "Avg Score", value: results.length ? `${avgScore}%` : "—", icon: Target },
    { label: "Avg Rating", value: avgRating, icon: Star },
    { label: "Best Score", value: bestResult ? `${bestResult.percentage}%` : "—", sub: bestResult?.player_name, icon: Trophy },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{quiz.title} — Statistics</DialogTitle>
        </DialogHeader>

        {/* Overview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {overviewCards.map((c) => (
            <Card key={c.label} className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <c.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                {c.sub && <p className="text-xs text-primary mt-0.5">{c.sub}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Score distribution chart */}
        {results.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Score Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distBuckets}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Hardest questions */}
        {questionErrors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Hardest Questions</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={questionErrors.slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="text" width={140} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="errorRate" fill="hsl(0, 72%, 51%)" radius={[0, 4, 4, 0]} name="Error Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent players */}
        {results.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Recent Players</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium">Player</th>
                    <th className="text-center p-2 font-medium">Score</th>
                    <th className="text-center p-2 font-medium">%</th>
                    <th className="text-center p-2 font-medium hidden sm:table-cell">Time</th>
                    <th className="text-right p-2 font-medium hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 20).map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="p-2">{r.player_name}</td>
                      <td className="p-2 text-center">{r.score}/{r.total_questions}</td>
                      <td className="p-2 text-center font-medium">{r.percentage}%</td>
                      <td className="p-2 text-center hidden sm:table-cell">{r.time_taken}s</td>
                      <td className="p-2 text-right text-muted-foreground hidden sm:table-cell">
                        {new Date(r.played_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No one has played this quiz yet. Share it to get results!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
