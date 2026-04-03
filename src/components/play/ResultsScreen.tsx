import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check, X, RotateCcw, Compass, Clock, Target, Zap, Award,
  Trophy, Medal, Lightbulb, Swords,
} from "lucide-react";
import { toast } from "sonner";
import Confetti from "./Confetti";
import StarRating from "./StarRating";
import ShareDropdown from "@/components/ShareDropdown";
import type { Question } from "@/lib/constants";
import type { FullQuiz } from "@/lib/mock-quizzes";
import { savePlayedQuiz } from "@/lib/player-stats";

interface PlayerAnswer {
  question_id: string;
  selected_option: number;
  is_correct: boolean;
  time_spent: number;
}

interface LeaderboardEntry {
  player_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken: number;
  created_at: string;
  is_current?: boolean;
}

interface Props {
  quiz: FullQuiz;
  playerName: string;
  answers: PlayerAnswer[];
  totalTime: number;
  onPlayAgain: () => void;
}

function getMockLeaderboard(quiz: FullQuiz, playerName: string, score: number, total: number, pct: number, time: number): LeaderboardEntry[] {
  const existing: LeaderboardEntry[] = [
    { player_name: "Alex", score: total, total_questions: total, percentage: 100, time_taken: total * 8, created_at: "2026-03-28T10:00:00Z" },
    { player_name: "Sam", score: Math.max(total - 1, 0), total_questions: total, percentage: Math.round(Math.max(total - 1, 0) / total * 100), time_taken: total * 12, created_at: "2026-03-29T14:30:00Z" },
    { player_name: "Jordan", score: Math.max(total - 2, 0), total_questions: total, percentage: Math.round(Math.max(total - 2, 0) / total * 100), time_taken: total * 15, created_at: "2026-03-30T09:15:00Z" },
    { player_name: "Casey", score: Math.max(total - 3, 0), total_questions: total, percentage: Math.round(Math.max(total - 3, 0) / total * 100), time_taken: total * 20, created_at: "2026-04-01T16:45:00Z" },
  ];

  const current: LeaderboardEntry = {
    player_name: playerName, score, total_questions: total, percentage: pct,
    time_taken: time, created_at: new Date().toISOString(), is_current: true,
  };

  const all = [...existing, current];
  all.sort((a, b) => b.percentage - a.percentage || a.time_taken - b.time_taken);
  return all;
}

function getScoreColor(pct: number): string {
  if (pct <= 40) return "hsl(0, 72%, 51%)";
  if (pct <= 60) return "hsl(38, 92%, 50%)";
  if (pct <= 80) return "hsl(200, 85%, 50%)";
  return "hsl(142, 71%, 45%)";
}

function getMessage(pct: number): string {
  if (pct === 100) return "PERFECT SCORE! You're a genius!";
  if (pct >= 81) return "Amazing! Almost perfect!";
  if (pct >= 61) return "Great score! Impressive knowledge.";
  if (pct >= 41) return "Good job! You know your stuff.";
  if (pct >= 21) return "Nice try! Room for improvement.";
  return "Keep practicing! You'll get there.";
}

function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }
  return `${seconds}s`;
}

const RANK_ICONS = [
  <Trophy className="h-5 w-5 text-yellow-500" />,
  <Medal className="h-5 w-5 text-gray-400" />,
  <Medal className="h-5 w-5 text-amber-700" />,
];

export default function ResultsScreen({ quiz, playerName, answers, totalTime, onPlayAgain }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [animatedPct, setAnimatedPct] = useState(0);

  const correctCount = answers.filter((a) => a.is_correct).length;
  const total = answers.length;
  const percentage = Math.round((correctCount / total) * 100);
  const avgTime = total > 0 ? Math.round(totalTime / total) : 0;
  const scoreColor = getScoreColor(percentage);
  const message = getMessage(percentage);

  const leaderboard = getMockLeaderboard(quiz, playerName, correctCount, total, percentage, totalTime);
  const playerRank = leaderboard.findIndex((e) => e.is_current) + 1;
  const isNewRecord = playerRank === 1;

  // Challenge mode
  const challengeName = searchParams.get("challenge");
  const challengeScore = searchParams.get("score") ? parseInt(searchParams.get("score")!) : null;

  // Save played quiz to history
  useEffect(() => {
    savePlayedQuiz({
      quizId: quiz.id,
      quizTitle: quiz.title,
      category: quiz.category,
      score: correctCount,
      totalQuestions: total,
      percentage,
      timeTaken: totalTime,
      playedAt: new Date().toISOString(),
    });
  }, []);

  // Animate score circle
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(Math.round(percentage * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [percentage]);

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - animatedPct / 100);

  const handleChallenge = () => {
    const challengeUrl = `${window.location.origin}/play/${quiz.share_code}?challenge=${encodeURIComponent(playerName)}&score=${percentage}`;
    navigator.clipboard.writeText(challengeUrl);
    toast.success("Challenge link copied! Send it to a friend.");
  };

  const handleRate = (rating: number) => {
    toast.success(`Rated ${rating}/5 stars!`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      {percentage === 100 && <Confetti />}

      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        {/* Challenge comparison */}
        {challengeName && challengeScore !== null && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 animate-scale-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Swords className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Challenge Result</h3>
            </div>
            <div className="grid grid-cols-3 items-center gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">{challengeName}</p>
                <p className={`text-3xl font-bold ${challengeScore < percentage ? "text-muted-foreground" : "text-primary"}`}>
                  {challengeScore}%
                </p>
              </div>
              <div className="text-xl font-bold text-muted-foreground">VS</div>
              <div>
                <p className="text-sm text-muted-foreground">{playerName}</p>
                <p className={`text-3xl font-bold ${percentage >= challengeScore ? "text-primary" : "text-muted-foreground"}`}>
                  {percentage}%
                </p>
              </div>
            </div>
            <p className="text-center text-sm font-medium mt-3 text-primary">
              {percentage > challengeScore
                ? `🎉 ${playerName} wins!`
                : percentage === challengeScore
                ? "🤝 It's a tie!"
                : `${challengeName} wins this round!`}
            </p>
          </div>
        )}

        {/* Score Circle + Message */}
        <div className="text-center space-y-4">
          {isNewRecord && (
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 gap-1.5 text-sm py-1 px-3 animate-pulse">
              <Trophy className="h-4 w-4" /> New Record!
            </Badge>
          )}

          <div className="relative inline-flex items-center justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
              <circle cx="90" cy="90" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
              <circle
                cx="90" cy="90" r={radius} fill="none"
                stroke={scoreColor} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                style={{ transition: "none" }}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-bold tabular-nums">{animatedPct}%</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{correctCount} out of {total} correct</p>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {message}
          </h1>
          <p className="text-muted-foreground">{playerName}</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Target className="h-5 w-5 text-primary" />, label: "Score", value: `${correctCount}/${total}` },
            { icon: <Zap className="h-5 w-5 text-[hsl(var(--quiz-medium))]" />, label: "Accuracy", value: `${percentage}%` },
            { icon: <Clock className="h-5 w-5 text-[hsl(var(--quiz-easy))]" />, label: "Time", value: formatTime(totalTime) },
            { icon: <Award className="h-5 w-5 text-primary" />, label: "Avg Time", value: `${avgTime}s` },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-4 text-center space-y-1">
              <div className="flex justify-center">{m.icon}</div>
              <p className="text-xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Answer Review */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value="review" className="border-0">
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <span className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Review your answers
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <Accordion type="single" collapsible className="space-y-2">
                  {answers.map((a, i) => {
                    const q = quiz.questions.find((qq) => qq.id === a.question_id);
                    if (!q) return null;
                    return (
                      <AccordionItem key={i} value={`q-${i}`} className="border rounded-lg">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline text-left">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {a.is_correct ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                <Check className="h-3.5 w-3.5 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                                <X className="h-3.5 w-3.5 text-white" />
                              </div>
                            )}
                            <span className="text-sm line-clamp-1 flex-1">{q.question_text}</span>
                            <span className="text-xs text-muted-foreground shrink-0 ml-2">{a.time_spent}s</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          <div className="space-y-2 ml-9">
                            {q.options.map((opt, oi) => {
                              const isSelected = oi === a.selected_option;
                              const isCorrect = opt.is_correct;
                              let cls = "border-border";
                              if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10";
                              else if (isSelected && !isCorrect) cls = "border-red-500 bg-red-500/10";

                              return (
                                <div key={oi} className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm ${cls}`}>
                                  {isCorrect && <Check className="h-4 w-4 text-emerald-500 shrink-0" />}
                                  {isSelected && !isCorrect && <X className="h-4 w-4 text-red-500 shrink-0" />}
                                  {!isCorrect && !isSelected && <div className="w-4 shrink-0" />}
                                  <span>{opt.text}</span>
                                  {isSelected && <Badge variant="outline" className="ml-auto text-xs">Your answer</Badge>}
                                </div>
                              );
                            })}
                            {q.explanation && (
                              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 mt-2">
                                <Lightbulb className="h-4 w-4 text-[hsl(var(--quiz-medium))] shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Leaderboard */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Leaderboard for this quiz
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium w-12">#</th>
                  <th className="text-left py-3 font-medium">Player</th>
                  <th className="text-center py-3 font-medium">Score</th>
                  <th className="text-center py-3 font-medium">%</th>
                  <th className="text-center py-3 font-medium hidden sm:table-cell">Time</th>
                  <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr key={i} className={`border-b border-border last:border-0 transition-colors ${entry.is_current ? "bg-primary/5" : ""}`}>
                    <td className="px-5 py-3">{i < 3 ? RANK_ICONS[i] : <span className="text-muted-foreground">{i + 1}</span>}</td>
                    <td className="py-3 font-medium">
                      <span className="flex items-center gap-2">
                        {entry.player_name}
                        {entry.is_current && <Badge variant="secondary" className="text-xs">You</Badge>}
                      </span>
                    </td>
                    <td className="py-3 text-center">{entry.score}/{entry.total_questions}</td>
                    <td className="py-3 text-center font-semibold">{entry.percentage}%</td>
                    <td className="py-3 text-center text-muted-foreground hidden sm:table-cell">{formatTime(entry.time_taken)}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">{new Date(entry.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rating */}
        <div className="rounded-xl border border-border bg-card p-6">
          <StarRating quizId={quiz.id} onRate={handleRate} />
        </div>

        {/* Action buttons */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button onClick={onPlayAgain} className="gap-2 rounded-full">
            <RotateCcw className="h-4 w-4" /> Play Again
          </Button>
          <ShareDropdown shareCode={quiz.share_code} title={quiz.title} variant="outline" size="default" />
          <Button variant="outline" onClick={handleChallenge} className="gap-2 rounded-full">
            <Swords className="h-4 w-4" /> Challenge a Friend
          </Button>
          <Button variant="outline" onClick={() => navigate("/explore")} className="gap-2 rounded-full">
            <Compass className="h-4 w-4" /> Explore More
          </Button>
        </div>
      </div>
    </div>
  );
}
