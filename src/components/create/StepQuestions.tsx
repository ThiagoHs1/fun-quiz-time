import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, Copy, ArrowLeft, ArrowRight, GripVertical, X } from "lucide-react";
import { toast } from "sonner";
import type { Question, QuestionType, QuizOption } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  questions: Question[];
  setQuestions: (q: Question[]) => void;
  onBack: () => void;
  onNext: () => void;
}

function createEmptyQuestion(index: number): Question {
  return {
    id: crypto.randomUUID(),
    question_text: "",
    question_type: "multiple_choice",
    options: [
      { text: "", is_correct: true },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ],
    explanation: "",
    order_index: index,
  };
}

function SortableQuestion({
  q, index, onUpdate, onDelete, onDuplicate, t,
}: {
  q: Question; index: number;
  onUpdate: (q: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  t: (key: any) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: q.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const updateOption = (optIdx: number, partial: Partial<QuizOption>) => {
    const newOpts = q.options.map((o, i) => (i === optIdx ? { ...o, ...partial } : o));
    onUpdate({ ...q, options: newOpts });
  };

  const setCorrect = (optIdx: number) => {
    const newOpts = q.options.map((o, i) => ({ ...o, is_correct: i === optIdx }));
    onUpdate({ ...q, options: newOpts });
  };

  const addOption = () => {
    if (q.options.length >= 6) return;
    onUpdate({ ...q, options: [...q.options, { text: "", is_correct: false }] });
  };

  const removeOption = (optIdx: number) => {
    if (q.options.length <= 2) return;
    let newOpts = q.options.filter((_, i) => i !== optIdx);
    if (!newOpts.some((o) => o.is_correct)) newOpts[0].is_correct = true;
    onUpdate({ ...q, options: newOpts });
  };

  const setType = (type: QuestionType) => {
    if (type === "true_false") {
      onUpdate({ ...q, question_type: type, options: [{ text: "True", is_correct: true }, { text: "False", is_correct: false }] });
    } else {
      onUpdate({ ...q, question_type: type, options: [{ text: "", is_correct: true }, { text: "", is_correct: false }, { text: "", is_correct: false }, { text: "", is_correct: false }] });
    }
  };

  const optionLabels = "ABCDEF";

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem value={q.id} className="border rounded-lg px-1 mb-3 bg-card">
        <div className="flex items-center">
          <button {...attributes} {...listeners} className="p-2 cursor-grab text-muted-foreground hover:text-foreground">
            <GripVertical className="h-4 w-4" />
          </button>
          <AccordionTrigger className="flex-1 py-3 hover:no-underline">
            <span className="text-sm font-medium">
              Q{index + 1}. {q.question_text || <span className="text-muted-foreground italic">{t("questions.untitled")}</span>}
            </span>
          </AccordionTrigger>
        </div>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div>
            <Label>{t("questions.questionText")} *</Label>
            <Input placeholder="What is the capital of France?" maxLength={300} value={q.question_text} onChange={(e) => onUpdate({ ...q, question_text: e.target.value })} />
            <p className="text-xs text-muted-foreground mt-1">{q.question_text.length}/300</p>
          </div>

          <div>
            <Label>{t("questions.type")}</Label>
            <RadioGroup value={q.question_type} onValueChange={(v) => setType(v as QuestionType)} className="flex gap-4 mt-1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="multiple_choice" id={`mc-${q.id}`} />
                <Label htmlFor={`mc-${q.id}`} className="cursor-pointer">{t("questions.multipleChoice")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="true_false" id={`tf-${q.id}`} />
                <Label htmlFor={`tf-${q.id}`} className="cursor-pointer">{t("questions.trueFalse")}</Label>
              </div>
            </RadioGroup>
          </div>

          {q.question_type === "multiple_choice" ? (
            <div className="space-y-2">
              <Label>{t("questions.options")}</Label>
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <button type="button" onClick={() => setCorrect(oi)} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${opt.is_correct ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                    {optionLabels[oi]}
                  </button>
                  <Input placeholder={`Option ${optionLabels[oi]}`} value={opt.text} onChange={(e) => updateOption(oi, { text: e.target.value })} className="flex-1" />
                  {q.options.length > 2 && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeOption(oi)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              {q.options.length < 6 && (
                <Button variant="outline" size="sm" className="mt-1 gap-1" onClick={addOption}>
                  <Plus className="h-3.5 w-3.5" /> {t("questions.addOption")}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label>{t("questions.correctAnswer")}</Label>
              <div className="flex gap-2">
                {q.options.map((opt, oi) => (
                  <Button key={oi} variant={opt.is_correct ? "default" : "outline"} className="flex-1" onClick={() => setCorrect(oi)}>
                    {opt.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>{t("questions.explanation")}</Label>
            <Textarea placeholder={t("questions.explainPlaceholder")} maxLength={500} value={q.explanation} onChange={(e) => onUpdate({ ...q, explanation: e.target.value })} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={onDuplicate}>
              <Copy className="h-3.5 w-3.5" /> {t("questions.duplicate")}
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" /> {t("questions.delete")}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

export default function StepQuestions({ questions, setQuestions, onBack, onNext }: Props) {
  const { t } = useI18n();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const addQuestion = () => setQuestions([...questions, createEmptyQuestion(questions.length)]);
  const updateQuestion = (id: string, updated: Question) => setQuestions(questions.map((q) => (q.id === id ? updated : q)));
  const deleteQuestion = (id: string) => setQuestions(questions.filter((q) => q.id !== id));
  const duplicateQuestion = (q: Question) => setQuestions([...questions, { ...q, id: crypto.randomUUID(), order_index: questions.length }]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    setQuestions(arrayMove(questions, oldIndex, newIndex).map((q, i) => ({ ...q, order_index: i })));
  };

  const handleNext = () => {
    if (questions.length < 3) { toast.error(t("questions.min3")); return; }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) { toast.error(`${t("game.question")} ${i + 1} ${t("questions.needsText")}`); return; }
      if (q.question_type === "multiple_choice") {
        const filled = q.options.filter((o) => o.text.trim());
        if (filled.length < 2) { toast.error(`${t("game.question")} ${i + 1} ${t("questions.needs2Options")}`); return; }
      }
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("questions.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {questions.length} {questions.length !== 1 ? t("questions.questions") : t("questions.question")} {t("questions.added")}
          </p>
        </div>
        <Button onClick={addQuestion} className="gap-1 rounded-full">
          <Plus className="h-4 w-4" /> {t("questions.addQuestion")}
        </Button>
      </div>

      {questions.length > 0 && <Progress value={Math.min((questions.length / 3) * 100, 100)} className="h-1.5" />}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <Accordion type="single" collapsible className="space-y-0">
            {questions.map((q, i) => (
              <SortableQuestion key={q.id} q={q} index={i} onUpdate={(updated) => updateQuestion(q.id, updated)} onDelete={() => deleteQuestion(q.id)} onDuplicate={() => duplicateQuestion(q)} t={t} />
            ))}
          </Accordion>
        </SortableContext>
      </DndContext>

      {questions.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-3">{t("questions.noQuestions")}</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="gap-2 rounded-full">
          <ArrowLeft className="h-4 w-4" /> {t("questions.back")}
        </Button>
        <Button onClick={handleNext} className="gap-2 rounded-full px-6">
          {t("questions.previewPublish")} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
