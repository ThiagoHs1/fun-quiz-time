import { useState } from "react";
import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Props {
  quizId: string;
  onRate: (rating: number) => void;
}

export default function StarRating({ quizId, onRate }: Props) {
  const { t } = useI18n();
  const ratedKey = `quizcraft-rated-${quizId}`;
  const [rated, setRated] = useState(() => localStorage.getItem(ratedKey) !== null);
  const [hovering, setHovering] = useState(0);
  const [selected, setSelected] = useState(() => {
    const v = localStorage.getItem(ratedKey);
    return v ? parseInt(v) : 0;
  });

  const handleRate = (value: number) => {
    if (rated) return;
    setSelected(value);
    setRated(true);
    localStorage.setItem(ratedKey, String(value));
    onRate(value);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-medium">{rated ? t("results.thanksRating") : t("results.rateQuiz")}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            disabled={rated}
            onMouseEnter={() => !rated && setHovering(v)}
            onMouseLeave={() => !rated && setHovering(0)}
            onClick={() => handleRate(v)}
            className="p-0.5 transition-transform hover:scale-110 disabled:cursor-default"
          >
            <Star className={`h-7 w-7 transition-colors ${v <= (hovering || selected) ? "fill-[hsl(var(--quiz-medium))] text-[hsl(var(--quiz-medium))]" : "text-muted-foreground/30"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
