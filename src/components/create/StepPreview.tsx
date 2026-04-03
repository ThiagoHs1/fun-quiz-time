import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ArrowLeft, Share2, Save, Rocket } from "lucide-react";
import { toast } from "sonner";
import type { QuizFormData, Question } from "@/lib/constants";
import { GRADIENTS, generateShareCode } from "@/lib/constants";

interface Props {
  formData: QuizFormData;
  questions: Question[];
  onBack: () => void;
}

export default function StepPreview({ formData, questions, onBack }: Props) {
  const gradient = formData.cover_gradient || GRADIENTS[0];

  const saveDraft = () => {
    const draft = { formData, questions, savedAt: new Date().toISOString() };
    localStorage.setItem("quizcraft-draft", JSON.stringify(draft));
    toast.success("Draft saved locally!");
  };

  const publish = () => {
    const shareCode = generateShareCode();
    toast.success(`Quiz published! Share code: ${shareCode}`, {
      description: "Connect Lovable Cloud to save to database.",
      duration: 6000,
    });
  };

  const firstQ = questions[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Preview & Publish
        </h2>
        <p className="text-sm text-muted-foreground">Review your quiz before publishing</p>
      </div>

      {/* Quiz Card Preview */}
      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-sm mx-auto">
        <div className="h-36 flex items-center justify-center relative" style={{ background: gradient }}>
          <HelpCircle className="h-14 w-14 text-white/30" />
          <Badge className="absolute top-3 right-3 text-xs font-semibold bg-white/20 text-white border-0 backdrop-blur-sm">
            {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)}
          </Badge>
        </div>
        <div className="p-5 space-y-2">
          <Badge variant="outline" className="text-xs">{formData.category || "Uncategorized"}</Badge>
          <h3 className="text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {formData.title || "Untitled Quiz"}
          </h3>
          {formData.description && (
            <p className="text-sm text-muted-foreground">{formData.description}</p>
          )}
          <div className="flex gap-4 text-xs text-muted-foreground pt-1">
            <span>{questions.length} questions</span>
            {formData.time_limit && <span>{formData.time_limit}s per question</span>}
            <span>{formData.is_public ? "Public" : "Private"}</span>
          </div>
        </div>
      </div>

      {/* Question Preview */}
      {firstQ && (
        <div className="rounded-xl border border-border bg-card p-6 max-w-lg mx-auto">
          <p className="text-xs text-muted-foreground mb-2">Question 1 of {questions.length}</p>
          <h4 className="text-lg font-medium mb-4">{firstQ.question_text || "Question preview"}</h4>
          <div className="space-y-2">
            {firstQ.options.map((opt, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-sm transition-colors ${
                  opt.is_correct ? "border-primary bg-primary/10 text-primary font-medium" : "border-border"
                }`}
              >
                {opt.text || `Option ${String.fromCharCode(65 + i)}`}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="gap-2 rounded-full">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={saveDraft} className="gap-2 rounded-full">
            <Save className="h-4 w-4" /> Save as Draft
          </Button>
          <Button onClick={publish} className="gap-2 rounded-full px-6">
            <Rocket className="h-4 w-4" /> Publish Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
