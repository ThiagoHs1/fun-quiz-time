import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Check } from "lucide-react";
import { CATEGORIES, GRADIENTS, type QuizFormData, type Difficulty } from "@/lib/constants";
import { toast } from "sonner";

interface Props {
  formData: QuizFormData;
  setFormData: (d: QuizFormData) => void;
  onNext: () => void;
}

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export default function StepInfo({ formData, setFormData, onNext }: Props) {
  const update = (partial: Partial<QuizFormData>) => setFormData({ ...formData, ...partial });

  const handleNext = () => {
    if (!formData.title.trim()) { toast.error("Title is required"); return; }
    if (!formData.category) { toast.error("Please select a category"); return; }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Quiz Information
        </h2>
        <p className="text-sm text-muted-foreground">Set up the basics for your quiz</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Title *</Label>
          <Input
            placeholder="How well do you know JavaScript?"
            maxLength={80}
            value={formData.title}
            onChange={(e) => update({ title: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.title.length}/80</p>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            placeholder="Test your JS knowledge from basics to advanced concepts."
            maxLength={200}
            value={formData.description}
            onChange={(e) => update({ description: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.description.length}/200</p>
        </div>

        <div>
          <Label>Category *</Label>
          <Select value={formData.category} onValueChange={(v) => update({ category: v as any })}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Difficulty</Label>
          <div className="flex gap-2 mt-1.5">
            {difficulties.map((d) => (
              <Button
                key={d}
                type="button"
                variant={formData.difficulty === d ? "default" : "outline"}
                size="sm"
                className="capitalize flex-1"
                onClick={() => update({ difficulty: d })}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Cover Gradient</Label>
          <div className="grid grid-cols-4 gap-2 mt-1.5">
            {GRADIENTS.map((g, i) => (
              <button
                key={i}
                className={`h-16 rounded-lg transition-all border-2 ${
                  formData.cover_gradient === g ? "border-primary scale-105 shadow-lg" : "border-transparent hover:border-border"
                }`}
                style={{ background: g }}
                onClick={() => update({ cover_gradient: g })}
              >
                {formData.cover_gradient === g && (
                  <Check className="h-5 w-5 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <Label>Time limit per question</Label>
              <p className="text-xs text-muted-foreground">Set a countdown for each question</p>
            </div>
            <Switch
              checked={formData.time_limit !== null}
              onCheckedChange={(v) => update({ time_limit: v ? 30 : null })}
            />
          </div>
          {formData.time_limit !== null && (
            <div className="pl-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Time limit</span>
                <span className="font-medium text-primary">{formData.time_limit}s</span>
              </div>
              <Slider
                value={[formData.time_limit]}
                onValueChange={([v]) => update({ time_limit: v })}
                min={10} max={120} step={5}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>Shuffle questions</Label>
              <p className="text-xs text-muted-foreground">Randomize question order</p>
            </div>
            <Switch checked={formData.shuffle_questions} onCheckedChange={(v) => update({ shuffle_questions: v })} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show correct answer after each question</Label>
              <p className="text-xs text-muted-foreground">Reveal the answer immediately</p>
            </div>
            <Switch checked={formData.show_answers} onCheckedChange={(v) => update({ show_answers: v })} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Public quiz</Label>
              <p className="text-xs text-muted-foreground">Visible in Explore page</p>
            </div>
            <Switch checked={formData.is_public} onCheckedChange={(v) => update({ is_public: v })} />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button onClick={handleNext} className="gap-2 rounded-full px-6">
          Next: Add Questions <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
