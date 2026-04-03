import { Star, Play, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/lib/constants";

interface QuizCardProps {
  title: string;
  category: string;
  difficulty: Difficulty;
  question_count: number;
  play_count: number;
  rating: number;
  cover_gradient: string;
  onClick?: () => void;
}

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-[hsl(var(--quiz-easy))] text-white",
  medium: "bg-[hsl(var(--quiz-medium))] text-white",
  hard: "bg-[hsl(var(--quiz-hard))] text-white",
};

export default function QuizCard({
  title, category, difficulty, question_count, play_count, rating, cover_gradient, onClick,
}: QuizCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="h-32 relative flex items-center justify-center" style={{ background: cover_gradient }}>
        <HelpCircle className="h-12 w-12 text-white/30 transition-transform group-hover:scale-110" />
        <Badge className={`absolute top-3 right-3 text-xs font-semibold ${difficultyColors[difficulty]}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <Badge variant="outline" className="text-xs mb-2">{category}</Badge>
          <h3 className="font-semibold text-base leading-tight line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> {question_count} questions
          </span>
          <span className="flex items-center gap-1">
            <Play className="h-3.5 w-3.5" /> {play_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[hsl(var(--quiz-medium))] text-[hsl(var(--quiz-medium))]" />
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
