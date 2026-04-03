import { Star, Play, HelpCircle, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Difficulty } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

interface QuizCardProps {
  title: string;
  description?: string;
  category: string;
  difficulty: Difficulty;
  question_count: number;
  play_count: number;
  rating: number;
  cover_gradient: string;
  share_code?: string;
  onClick?: () => void;
  featured?: boolean;
}

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-[hsl(var(--quiz-easy))] text-white",
  medium: "bg-[hsl(var(--quiz-medium))] text-white",
  hard: "bg-[hsl(var(--quiz-hard))] text-white",
};

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  Science: "bg-teal-500/15 text-teal-500 border-teal-500/20",
  History: "bg-amber-500/15 text-amber-500 border-amber-500/20",
  Geography: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  Sports: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  Entertainment: "bg-violet-500/15 text-violet-500 border-violet-500/20",
  "Anime & Manga": "bg-pink-500/15 text-pink-500 border-pink-500/20",
  Gaming: "bg-purple-500/15 text-purple-500 border-purple-500/20",
  Music: "bg-rose-500/15 text-rose-500 border-rose-500/20",
  "Movies & TV": "bg-indigo-500/15 text-indigo-500 border-indigo-500/20",
  "General Knowledge": "bg-cyan-500/15 text-cyan-500 border-cyan-500/20",
  Language: "bg-lime-500/15 text-lime-500 border-lime-500/20",
  Math: "bg-sky-500/15 text-sky-500 border-sky-500/20",
  Custom: "bg-gray-500/15 text-gray-500 border-gray-500/20",
};

export default function QuizCard({
  title, description, category, difficulty, question_count, play_count, rating, cover_gradient, share_code, onClick, featured,
}: QuizCardProps) {
  const navigate = useNavigate();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (share_code) navigate(`/play/${share_code}`);
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/40"
    >
      {/* Cover */}
      <div
        className={`relative flex items-center justify-center ${featured ? "h-[200px]" : "h-[120px]"}`}
        style={{ background: cover_gradient }}
      >
        <HelpCircle className="h-12 w-12 text-white/20 transition-transform group-hover:scale-110" />
        <Badge className={`absolute top-3 right-3 text-xs font-semibold border-0 ${difficultyColors[difficulty]}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge className={`text-xs border ${categoryColors[category] || categoryColors.Custom}`}>
              {category}
            </Badge>
          </div>
          <h3
            className="font-medium text-base leading-tight line-clamp-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{description}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Play className="h-3.5 w-3.5" /> {play_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[hsl(var(--quiz-medium))] text-[hsl(var(--quiz-medium))]" />
            {rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <List className="h-3.5 w-3.5" /> {question_count}
          </span>
        </div>

        {share_code && (
          <Button
            size="sm"
            className="w-full rounded-full gap-1.5 text-xs"
            onClick={handlePlay}
          >
            <Play className="h-3.5 w-3.5" /> Play
          </Button>
        )}
      </div>
    </div>
  );
}

export { categoryColors };
