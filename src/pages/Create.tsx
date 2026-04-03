import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StepInfo from "@/components/create/StepInfo";
import StepQuestions from "@/components/create/StepQuestions";
import StepPreview from "@/components/create/StepPreview";
import TemplateModal from "@/components/create/TemplateModal";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { QuizFormData, Question } from "@/lib/constants";
import { getDrafts, getPublishedQuizzes, type DraftQuiz } from "@/lib/quiz-store";
import type { QuizTemplate } from "@/lib/quiz-templates";
import { Badge } from "@/components/ui/badge";
import { LayoutTemplate } from "lucide-react";

const STEPS = ["Quiz Info", "Add Questions", "Preview & Publish"];

const defaultFormData: QuizFormData = {
  title: "",
  description: "",
  category: "",
  difficulty: "medium",
  cover_gradient: "",
  time_limit: null,
  shuffle_questions: false,
  show_answers: true,
  is_public: true,
};

export default function Create() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<QuizFormData>(defaultFormData);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editMode, setEditMode] = useState<{ id: string; type: "draft" | "published" } | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleTemplate = (template: QuizTemplate) => {
    setFormData(template.formData);
    setQuestions(template.questions.map((q) => ({ ...q, id: crypto.randomUUID() })));
    setStep(0);
  };

  useEffect(() => {
    const editId = searchParams.get("edit");
    const draftId = searchParams.get("draft");

    if (editId) {
      const quiz = getPublishedQuizzes().find((q) => q.id === editId);
      if (quiz) {
        setFormData({
          title: quiz.title,
          description: quiz.description,
          category: quiz.category as any,
          difficulty: quiz.difficulty,
          cover_gradient: quiz.cover_gradient,
          time_limit: quiz.time_limit,
          shuffle_questions: quiz.shuffle_questions,
          show_answers: quiz.show_answers,
          is_public: quiz.is_public,
        });
        setQuestions(quiz.questions);
        setEditMode({ id: editId, type: "published" });
      }
    } else if (draftId) {
      const draft = getDrafts().find((d) => d.id === draftId);
      if (draft) {
        setFormData(draft.formData);
        setQuestions(draft.questions);
        setEditMode({ id: draftId, type: "draft" });
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {editMode && (
          <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border flex items-center gap-2 text-sm">
            <Badge variant="outline" className="shrink-0">
              {editMode.type === "published" ? "Editing" : "Draft"}
            </Badge>
            {editMode.type === "published" && (
              <span className="text-muted-foreground">
                Editing a published quiz will affect future players. Existing results will be preserved.
              </span>
            )}
            {editMode.type === "draft" && (
              <span className="text-muted-foreground">Editing draft</span>
            )}
          </div>
        )}

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((label, i) => (
              <button
                key={label}
                onClick={() => { if (i < step) setStep(i); }}
                className={`text-sm font-medium transition-colors ${
                  i === step ? "text-primary" : i < step ? "text-muted-foreground cursor-pointer hover:text-foreground" : "text-muted-foreground/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-1.5" />
        </div>

        {step === 0 && (
          <StepInfo formData={formData} setFormData={setFormData} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <StepQuestions
            questions={questions}
            setQuestions={setQuestions}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepPreview
            formData={formData}
            questions={questions}
            onBack={() => setStep(1)}
            editMode={editMode}
          />
        )}
      </div>
    </div>
  );
}
