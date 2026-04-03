import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Play, Clock, BarChart3, ArrowRight, AlertCircle, Swords } from "lucide-react";
import { findQuizByShareCode, type FullQuiz } from "@/lib/mock-quizzes";
import QuizGame from "@/components/play/QuizGame";
import ResultsScreen from "@/components/play/ResultsScreen";

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<FullQuiz | null | undefined>(undefined);
  const [screen, setScreen] = useState<Screen>("entry");
  const [playerName, setPlayerName] = useState(() =>
    localStorage.getItem("quizcraft-player-name") || ""
  );
  const [results, setResults] = useState<{ answers: PlayerAnswer[]; totalTime: number } | null>(null);

  const challengeName = searchParams.get("challenge");
  const challengeScore = searchParams.get("score");

  useEffect(() => {
    const found = findQuizByShareCode(shareCode ?? "");
    setQuiz(found);
  }, [shareCode]);

  if (quiz === undefined) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading quiz...</div>
      </div>
    );
  }

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

  const avgScore = quiz.rating_count > 0 ? Math.round((quiz.rating_sum / quiz.rating_count / 5) * 100) : 0;

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
            <div className="h-40 flex items-center justify-center relative" style={{ background: quiz.cover_gradient }}>
              <HelpCircle className="h-16 w-16 text-white/20" />
            </div>

            <div className="p-6 space-y-5">
              {/* Challenge banner */}
              {challengeName && challengeScore && (
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-center animate-scale-in">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Swords className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Challenge!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>{challengeName}</strong> scored <strong>{challengeScore}%</strong>! Can you beat them?
                  </p>
                </div>
              )}

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
                <h1 className="text-xl font-semibold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {quiz.title}
                </h1>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground mt-1.5">{quiz.description}</p>
                )}
              </div>

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

  if (screen === "results" && results) {
    return (
      <ResultsScreen
        quiz={quiz}
        playerName={playerName}
        answers={results.answers}
        totalTime={results.totalTime}
        onPlayAgain={() => {
          setResults(null);
          setScreen("entry");
        }}
      />
    );
  }

  return null;
}
