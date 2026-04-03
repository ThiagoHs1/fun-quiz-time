import { useState } from "react";
import StepInfo from "@/components/create/StepInfo";
import StepQuestions from "@/components/create/StepQuestions";
import StepPreview from "@/components/create/StepPreview";
import { Progress } from "@/components/ui/progress";
import type { QuizFormData, Question } from "@/lib/constants";

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
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<QuizFormData>(defaultFormData);
  const [questions, setQuestions] = useState<Question[]>([]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
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
          />
        )}
      </div>
    </div>
  );
}
