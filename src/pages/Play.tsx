import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Play, Clock, BarChart3, ArrowRight, AlertCircle, Trophy, RotateCcw, Home, Share2 } from "lucide-react";
import { findQuizByShareCode, type FullQuiz } from "@/lib/mock-quizzes";
import QuizGame from "@/components/play/QuizGame";
import { Progress } from "@/components/ui/progress";

type Screen = "entry" | "playing" | "results";

interface PlayerAnswer {
  question_id: string;
  selected_option: number;
  is_correct: boolean;
  time_spent: number;
}

const diffBadgeClass: Record<string, string> = {
  easy: "bg-[hsl(var(--quiz-easy))] text-white",
  medium: "bg-[hsl(var(--quiz-medium))] text-white",
  hard: "bg-[hsl(var(--quiz-hard))] text-white",
};

export default function PlayPage() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<FullQuiz | null | undefined>(undefined);
  const [screen, setScreen] = useState<Screen>("entry");
  const [playerName, setPlayerName] = useState(() =>
    localStorage.getItem("quizcraft-player-name") || ""
  );
  const [results, setResults] = useState<{ answers: PlayerAnswer[]; totalTime: number } | null>(null);

  useEffect(() => {
    // simulate async lookup
    const found = findQuizByShareCode(shareCode ?? "");
    setQuiz(found);
  }, [shareCode]);

  // Loading
  if (quiz === undefined) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading quiz...</div>
      </div>
    );
  }

  // Not found
  if (quiz === null) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive/60 mb-4" />
          <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Quiz not found
          </h1>
          <p className="text-muted-foreground mb-6">
            The quiz with code "{shareCode}" doesn't exist or has been removed.
          </p>
          <Link to="/explore">
            <Button className="rounded-full gap-2">
              <HelpCircle className="h-4 w-4" /> Go to Explore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const avgScore =
    quiz.rating_count > 0
      ? Math.round((quiz.rating_sum / quiz.rating_count / 5) * 100)
      : 0;

  // Entry screen
  if (screen === "entry") {
    const handleStart = () => {
      if (!playerName.trim()) return;
      localStorage.setItem("quizcraft-player-name", playerName.trim());
      setScreen("playing");
    };

    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl shadow-primary/5">
            {/* Cover */}
            <div
              className="h-40 flex items-center justify-center relative"
              style={{ background: quiz.cover_gradient }}
            >
              <HelpCircle className="h-16 w-16 text-white/20" />
            </div>

            <div className="p-6 space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{quiz.category}</Badge>
                <Badge className={`${diffBadgeClass[quiz.difficulty]} border-0`}>
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <HelpCircle className="h-3 w-3" /> {quiz.questions.length} questions
                </Badge>
                {quiz.time_limit && (
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" /> {quiz.time_limit}s/question
                  </Badge>
                )}
              </div>

              <div>
                <h1
                  className="text-xl font-semibold leading-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {quiz.title}
                </h1>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground mt-1.5">{quiz.description}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Play className="h-4 w-4" /> Played {quiz.play_count.toLocaleString()} times
                </span>
                {avgScore > 0 && (
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4" /> Avg score: {avgScore}%
                  </span>
                )}
              </div>

              {/* Name input */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Your name</label>
                <Input
                  placeholder="Enter your name"
                  maxLength={30}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                />
              </div>

              <Button
                size="lg"
                className="w-full gap-2 rounded-full text-base"
                disabled={!playerName.trim()}
                onClick={handleStart}
              >
                Start Quiz <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen
  if (screen === "playing") {
    const orderedQuestions = quiz.shuffle_questions
      ? [...quiz.questions].sort(() => Math.random() - 0.5)
      : quiz.questions;

    return (
      <QuizGame
        questions={orderedQuestions}
        timeLimit={quiz.time_limit}
        showAnswers={quiz.show_answers}
        onFinish={(answers, totalTime) => {
          setResults({ answers, totalTime });
          setScreen("results");
        }}
      />
    );
  }

  // Results screen
  if (screen === "results" && results) {
    const correctCount = results.answers.filter((a) => a.is_correct).length;
    const total = results.answers.length;
    const percentage = Math.round((correctCount / total) * 100);

    const emoji =
      percentage >= 90 ? "🏆" : percentage >= 70 ? "🎉" : percentage >= 50 ? "👍" : "💪";

    const message =
      percentage >= 90
        ? "Outstanding!"
        : percentage >= 70
        ? "Great job!"
        : percentage >= 50
        ? "Not bad!"
        : "Keep practicing!";

    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center animate-scale-in">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-primary/5 space-y-6">
            <div className="text-6xl">{emoji}</div>
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {message}
              </h1>
              <p className="text-muted-foreground mt-1">{playerName}</p>
            </div>

            {/* Score circle */}
            <div className="relative inline-flex items-center justify-center">
              <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                <circle cx="70" cy="70" r="58" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                <circle
                  cx="70" cy="70" r="58" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={2 * Math.PI * 58 * (1 - percentage / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-bold">{percentage}%</span>
              </div>
            </div>

            <div className="flex justify-center gap-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-[hsl(var(--quiz-easy))]">{correctCount}</p>
                <p className="text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[hsl(var(--quiz-hard))]">{total - correctCount}</p>
                <p className="text-muted-foreground">Wrong</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{results.totalTime}s</p>
                <p className="text-muted-foreground">Time</p>
              </div>
            </div>

            {/* Answer breakdown */}
            <div className="space-y-2 text-left">
              <p className="text-sm font-medium mb-2">Question breakdown</p>
              {results.answers.map((a, i) => {
                const q = quiz.questions.find((qq) => qq.id === a.question_id);
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2.5 rounded-lg text-sm border ${
                      a.is_correct ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
                    }`}
                  >
                    {a.is_correct ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                        <X className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <span className="line-clamp-1 flex-1">
                      {q?.question_text ?? `Question ${i + 1}`}
                    </span>
                    <span className="text-xs text-muted-foreground">{a.time_spent}s</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                className="w-full gap-2 rounded-full"
                onClick={() => {
                  setResults(null);
                  setScreen("entry");
                }}
              >
                <RotateCcw className="h-4 w-4" /> Play Again
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 rounded-full"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4" /> Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
