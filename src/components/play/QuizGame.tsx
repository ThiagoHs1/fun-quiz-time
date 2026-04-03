import { useState, useEffect, useCallback, useRef } from "react";
import { Check, X, Lightbulb, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import TimerCircle from "./TimerCircle";
import type { Question } from "@/lib/constants";

interface PlayerAnswer {
  question_id: string;
  selected_option: number;
  is_correct: boolean;
  time_spent: number;
}

interface Props {
  questions: Question[];
  timeLimit: number | null;
  showAnswers: boolean;
  onFinish: (answers: PlayerAnswer[], totalTime: number) => void;
}

const OPTION_COLORS = [
  { bg: "bg-blue-500/10", border: "border-blue-500", text: "text-blue-500", circle: "bg-blue-500" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500", text: "text-emerald-500", circle: "bg-emerald-500" },
  { bg: "bg-amber-500/10", border: "border-amber-500", text: "text-amber-500", circle: "bg-amber-500" },
  { bg: "bg-pink-500/10", border: "border-pink-500", text: "text-pink-500", circle: "bg-pink-500" },
  { bg: "bg-purple-500/10", border: "border-purple-500", text: "text-purple-500", circle: "bg-purple-500" },
  { bg: "bg-cyan-500/10", border: "border-cyan-500", text: "text-cyan-500", circle: "bg-cyan-500" },
];

const LABELS = "ABCDEF";

export default function QuizGame({ questions, timeLimit, showAnswers, onFinish }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit ?? 0);
  const [animState, setAnimState] = useState<"in" | "out">("in");
  const questionStartRef = useRef(Date.now());
  const totalStartRef = useRef(Date.now());

  const question = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const correctIdx = question.options.findIndex((o) => o.is_correct);

  // Reset timer per question
  useEffect(() => {
    if (timeLimit) setTimeLeft(timeLimit);
    questionStartRef.current = Date.now();
    setAnimState("in");
  }, [currentIdx, timeLimit]);

  // Timer countdown
  useEffect(() => {
    if (!timeLimit || answered) return;
    if (timeLeft <= 0) {
      handleSelect(-1); // time ran out
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timeLimit, answered]);

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (answered) return;
      const timeSpent = Math.round((Date.now() - questionStartRef.current) / 1000);
      const isCorrect = optIdx >= 0 && question.options[optIdx]?.is_correct === true;

      setSelectedOption(optIdx);
      setAnswered(true);

      const answer: PlayerAnswer = {
        question_id: question.id,
        selected_option: optIdx,
        is_correct: isCorrect,
        time_spent: timeSpent,
      };
      setAnswers((prev) => [...prev, answer]);

      if (!showAnswers) {
        // Auto-advance after 500ms
        setTimeout(() => goNext([...answers, answer]), 500);
      }
    },
    [answered, question, showAnswers, answers],
  );

  const goNext = useCallback(
    (currentAnswers?: PlayerAnswer[]) => {
      const allAnswers = currentAnswers ?? answers;
      if (isLast) {
        const totalTime = Math.round((Date.now() - totalStartRef.current) / 1000);
        onFinish(allAnswers, totalTime);
        return;
      }
      setAnimState("out");
      setTimeout(() => {
        setCurrentIdx((i) => i + 1);
        setSelectedOption(null);
        setAnswered(false);
      }, 200);
    },
    [isLast, answers, onFinish],
  );

  const getOptionStyle = (idx: number) => {
    const color = OPTION_COLORS[idx] ?? OPTION_COLORS[0];
    if (!answered) {
      return `border-border hover:${color.border} hover:${color.bg} hover:shadow-md hover:-translate-y-0.5 cursor-pointer`;
    }
    if (showAnswers) {
      if (idx === correctIdx) return "border-emerald-500 bg-emerald-500/10";
      if (idx === selectedOption && !question.options[idx].is_correct)
        return "border-red-500 bg-red-500/10";
      return "border-border opacity-50";
    }
    // No show answers
    if (idx === selectedOption) return "border-primary bg-primary/10";
    return "border-border opacity-50";
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-[700px] mx-auto">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6">
          <Progress
            value={((currentIdx + (answered ? 1 : 0)) / questions.length) * 100}
            className="flex-1 h-2"
          />
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {currentIdx + (answered ? 1 : 0)}/{questions.length}
          </span>
          {timeLimit && (
            <TimerCircle timeLeft={timeLeft} totalTime={timeLimit} />
          )}
        </div>

        {/* Question */}
        <div
          key={currentIdx}
          className={animState === "in" ? "animate-slide-in-right" : "animate-slide-out-left"}
        >
          <p className="text-sm text-muted-foreground mb-2">
            Question {currentIdx + 1} of {questions.length}
          </p>
          <h2
            className="text-xl font-medium mb-6 leading-relaxed"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {question.question_text}
          </h2>

          {/* Options */}
          {question.question_type === "true_false" ? (
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={answered}
                  onClick={() => handleSelect(i)}
                  className={`p-5 rounded-xl border-2 text-center font-medium text-lg transition-all duration-200 ${getOptionStyle(i)}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {opt.text === "True" ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <X className="h-5 w-5" />
                    )}
                    {opt.text}
                    {answered && showAnswers && i === correctIdx && (
                      <Check className="h-5 w-5 text-emerald-500" />
                    )}
                    {answered && showAnswers && i === selectedOption && !opt.is_correct && (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {question.options.map((opt, i) => {
                const color = OPTION_COLORS[i] ?? OPTION_COLORS[0];
                return (
                  <button
                    key={i}
                    disabled={answered}
                    onClick={() => handleSelect(i)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${getOptionStyle(i)}`}
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${color.circle}`}
                    >
                      {answered && showAnswers && i === correctIdx ? (
                        <Check className="h-4 w-4" />
                      ) : answered && showAnswers && i === selectedOption && !opt.is_correct ? (
                        <X className="h-4 w-4" />
                      ) : (
                        LABELS[i]
                      )}
                    </span>
                    <span className="font-medium">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Explanation */}
          {answered && showAnswers && question.explanation && (
            <div className="mt-5 animate-slide-down overflow-hidden">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                <Lightbulb className="h-5 w-5 text-[hsl(var(--quiz-medium))] shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Next button (only when showAnswers is on) */}
          {answered && showAnswers && (
            <div className="mt-6 flex justify-end animate-fade-in">
              <Button onClick={() => goNext()} className="gap-2 rounded-full px-6" size="lg">
                {isLast ? (
                  <>
                    <Trophy className="h-5 w-5" /> See Results
                  </>
                ) : (
                  <>
                    Next Question <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
