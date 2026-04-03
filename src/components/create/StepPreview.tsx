import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ArrowLeft, Save, Rocket } from "lucide-react";
import { toast } from "sonner";
import type { QuizFormData, Question } from "@/lib/constants";
import { GRADIENTS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import {
  saveDraft, publishDraft, getCreatorName, savePublishedQuiz, getPublishedQuizzes,
  type DraftQuiz,
} from "@/lib/quiz-store";

interface Props {
  formData: QuizFormData;
  questions: Question[];
  onBack: () => void;
  editMode?: { id: string; type: "draft" | "published" } | null;
}

export default function StepPreview({ formData, questions, onBack, editMode }: Props) {
  const navigate = useNavigate();
  const { t, tCat, tDiff } = useI18n();
  const gradient = formData.cover_gradient || GRADIENTS[0];
  const creatorName = getCreatorName();

  const handleSaveDraft = () => {
    const draft: DraftQuiz = {
      id: editMode?.type === "draft" ? editMode.id : crypto.randomUUID(),
      formData, questions, savedAt: new Date().toISOString(),
    };
    saveDraft(draft);
    toast.success(t("preview.draftSaved"));
    navigate("/my-quizzes");
  };

  const handlePublish = () => {
    if (!creatorName) { toast.error(t("preview.setCreatorFirst")); return; }
    if (editMode?.type === "published") {
      const existing = getPublishedQuizzes().find((q) => q.id === editMode.id);
      if (existing) {
        savePublishedQuiz({
          ...existing, title: formData.title, description: formData.description,
          category: formData.category || "General Knowledge", difficulty: formData.difficulty,
          cover_gradient: formData.cover_gradient, time_limit: formData.time_limit,
          shuffle_questions: formData.shuffle_questions, show_answers: formData.show_answers,
          is_public: formData.is_public, questions,
        });
        toast.success(t("preview.updated"));
        navigate("/my-quizzes");
        return;
      }
    }
    const draft: DraftQuiz = {
      id: editMode?.type === "draft" ? editMode.id : crypto.randomUUID(),
      formData, questions, savedAt: new Date().toISOString(),
    };
    const quiz = publishDraft(draft, creatorName);
    toast.success(`${t("preview.published")} ${quiz.share_code}`, { duration: 6000 });
    navigate("/my-quizzes");
  };

  const firstQ = questions[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {t("preview.title")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("preview.subtitle")}</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-sm mx-auto">
        <div className="h-36 flex items-center justify-center relative" style={{ background: gradient }}>
          <HelpCircle className="h-14 w-14 text-white/30" />
          <Badge className="absolute top-3 right-3 text-xs font-semibold bg-white/20 text-white border-0 backdrop-blur-sm">
            {tDiff(formData.difficulty)}
          </Badge>
        </div>
        <div className="p-5 space-y-2">
          <Badge variant="outline" className="text-xs">{formData.category ? tCat(formData.category) : t("preview.uncategorized")}</Badge>
          <h3 className="text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {formData.title || t("preview.untitled")}
          </h3>
          {formData.description && <p className="text-sm text-muted-foreground">{formData.description}</p>}
          <div className="flex gap-4 text-xs text-muted-foreground pt-1">
            <span>{questions.length} {t("questions.questions")}</span>
            {formData.time_limit && <span>{formData.time_limit}s {t("preview.perQuestion")}</span>}
            <span>{formData.is_public ? t("preview.public") : t("preview.private")}</span>
          </div>
        </div>
      </div>

      {firstQ && (
        <div className="rounded-xl border border-border bg-card p-6 max-w-lg mx-auto">
          <p className="text-xs text-muted-foreground mb-2">{t("game.question")} 1 {t("game.questionOf")} {questions.length}</p>
          <h4 className="text-lg font-medium mb-4">{firstQ.question_text || t("preview.questionPreview")}</h4>
          <div className="space-y-2">
            {firstQ.options.map((opt, i) => (
              <div key={i} className={`p-3 rounded-lg border text-sm transition-colors ${opt.is_correct ? "border-primary bg-primary/10 text-primary font-medium" : "border-border"}`}>
                {opt.text || `Option ${String.fromCharCode(65 + i)}`}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="gap-2 rounded-full">
          <ArrowLeft className="h-4 w-4" /> {t("questions.back")}
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} className="gap-2 rounded-full">
            <Save className="h-4 w-4" /> {t("preview.saveDraft")}
          </Button>
          <Button onClick={handlePublish} className="gap-2 rounded-full px-6">
            <Rocket className="h-4 w-4" /> {editMode?.type === "published" ? t("preview.updateQuiz") : t("preview.publishQuiz")}
          </Button>
        </div>
      </div>
    </div>
  );
}
