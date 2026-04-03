import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check, X, RotateCcw, Compass, Copy, Clock, Target, Zap, Award,
  Trophy, Medal, Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import Confetti from "./Confetti";
import StarRating from "./StarRating";
import type { Question } from "@/lib/constants";
import type { FullQuiz } from "@/lib/mock-quizzes";
import { useI18n } from "@/lib/i18n";

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
  const current: LeaderboardEntry = { player_name: playerName, score, total_questions: total, percentage: pct, time_taken: time, created_at: new Date().toISOString(), is_current: true };
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

function formatTime(seconds: number): string {
  if (seconds >= 60) { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}m ${s}s`; }
  return `${seconds}s`;
}

const RANK_ICONS = [
  <Trophy className="h-5 w-5 text-yellow-500" />,
  <Medal className="h-5 w-5 text-gray-400" />,
  <Medal className="h-5 w-5 text-amber-700" />,
];

export default function ResultsScreen({ quiz, playerName, answers, totalTime, onPlayAgain }: Props) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [animatedPct, setAnimatedPct] = useState(0);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const correctCount = answers.filter((a) => a.is_correct).length;
  const total = answers.length;
  const percentage = Math.round((correctCount / total) * 100);
  const avgTime = total > 0 ? Math.round(totalTime / total) : 0;
  const scoreColor = getScoreColor(percentage);

  const getMessage = (pct: number): string => {
    if (pct === 100) return t("results.perfect");
    if (pct >= 81) return t("results.amazing");
    if (pct >= 61) return t("results.great");
    if (pct >= 41) return t("results.good");
    if (pct >= 21) return t("results.nice");
    return t("results.keep");
  };

  const message = getMessage(percentage);
  const leaderboard = getMockLeaderboard(quiz, playerName, correctCount, total, percentage, totalTime);
  const playerRank = leaderboard.findIndex((e) => e.is_current) + 1;
  const isNewRecord = playerRank === 1;

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

  const handleCopyLink = () => {
    const url = `${window.location.origin}/play/${quiz.share_code}`;
    const text = `I scored ${percentage}% on "${quiz.title}"! Can you beat me? → ${url}`;
    navigator.clipboard.writeText(text);
    toast.success(t("results.linkCopied"));
  };

  const handleRate = (rating: number) => {
    toast.success(`Rated ${rating}/5 stars!`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      {percentage === 100 && <Confetti />}
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          {isNewRecord && (
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 gap-1.5 text-sm py-1 px-3 animate-pulse">
              <Trophy className="h-4 w-4" /> {t("results.newRecord")}
            </Badge>
          )}
          <div className="relative inline-flex items-center justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
              <circle cx="90" cy="90" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
              <circle cx="90" cy="90" r={radius} fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: "none" }} />
            </svg>
            <div className="absolute text-center"><span className="text-4xl font-bold tabular-nums">{animatedPct}%</span></div>
          </div>
          <p className="text-sm text-muted-foreground">{correctCount} {t("results.outOf")} {total} {t("results.correct")}</p>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{message}</h1>
          <p className="text-muted-foreground">{playerName}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Target className="h-5 w-5 text-primary" />, label: t("results.score"), value: `${correctCount}/${total}` },
            { icon: <Zap className="h-5 w-5 text-[hsl(var(--quiz-medium))]" />, label: t("results.accuracy"), value: `${percentage}%` },
            { icon: <Clock className="h-5 w-5 text-[hsl(var(--quiz-easy))]" />, label: t("results.time"), value: formatTime(totalTime) },
            { icon: <Award className="h-5 w-5 text-primary" />, label: t("results.avgTime"), value: `${avgTime}s` },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-4 text-center space-y-1">
              <div className="flex justify-center">{m.icon}</div>
              <p className="text-xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value="review" className="border-0">
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <span className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t("results.review")}</span>
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
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><Check className="h-3.5 w-3.5 text-white" /></div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0"><X className="h-3.5 w-3.5 text-white" /></div>
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
                                  {isSelected && <Badge variant="outline" className="ml-auto text-xs">{t("results.yourAnswer")}</Badge>}
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

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t("results.leaderboard")}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium w-12">#</th>
                  <th className="text-left py-3 font-medium">{t("statsModal.player")}</th>
                  <th className="text-center py-3 font-medium">{t("results.score")}</th>
                  <th className="text-center py-3 font-medium">%</th>
                  <th className="text-center py-3 font-medium">{t("results.time")}</th>
                  <th className="text-right px-5 py-3 font-medium">{t("statsModal.date")}</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr key={i} className={`border-b border-border last:border-0 transition-colors ${entry.is_current ? "bg-primary/5" : ""}`}>
                    <td className="px-5 py-3">{i < 3 ? RANK_ICONS[i] : <span className="text-muted-foreground">{i + 1}</span>}</td>
                    <td className="py-3 font-medium">
                      <span className="flex items-center gap-2">
                        {entry.player_name}
                        {entry.is_current && <Badge variant="secondary" className="text-xs">{t("results.you")}</Badge>}
                      </span>
                    </td>
                    <td className="py-3 text-center">{entry.score}/{entry.total_questions}</td>
                    <td className="py-3 text-center font-semibold">{entry.percentage}%</td>
                    <td className="py-3 text-center text-muted-foreground">{formatTime(entry.time_taken)}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <StarRating quizId={quiz.id} onRate={handleRate} />
        </div>

        <div ref={shareCardRef} className="hidden">
          <div className="w-[400px] p-6 rounded-xl text-white text-center" style={{ background: quiz.cover_gradient }}>
            <p className="text-sm opacity-80">QuizCraft</p>
            <h3 className="text-xl font-bold mt-2">{quiz.title}</h3>
            <p className="text-4xl font-bold mt-4">{percentage}%</p>
            <p className="text-sm mt-1">{correctCount}/{total} {t("results.correct")} • #{playerRank} on leaderboard</p>
            <p className="text-sm mt-3 opacity-80">{playerName}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button onClick={onPlayAgain} className="gap-2 rounded-full"><RotateCcw className="h-4 w-4" /> {t("results.playAgain")}</Button>
          <Button variant="outline" onClick={handleCopyLink} className="gap-2 rounded-full"><Copy className="h-4 w-4" /> {t("results.shareResult")}</Button>
          <Button variant="outline" onClick={() => navigate("/explore")} className="gap-2 rounded-full"><Compass className="h-4 w-4" /> {t("results.exploreMore")}</Button>
        </div>
      </div>
    </div>
  );
}
