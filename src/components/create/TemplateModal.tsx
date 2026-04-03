import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { QUIZ_TEMPLATES, type QuizTemplate } from "@/lib/quiz-templates";
import { Code, Sparkles, Globe, FlaskConical, FileText } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Code, Sparkles, Globe, FlaskConical, FileText,
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: QuizTemplate) => void;
}

export default function TemplateModal({ open, onOpenChange, onSelect }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Start from Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUIZ_TEMPLATES.map((t) => {
            const Icon = ICON_MAP[t.icon] || FileText;
            return (
              <Card
                key={t.name}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => { onSelect(t); onOpenChange(false); }}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                    {t.questions.length > 0 && (
                      <p className="text-xs text-primary mt-1">{t.questions.length} questions</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
