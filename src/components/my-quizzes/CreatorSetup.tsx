import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, ArrowRight } from "lucide-react";
import { setCreatorName } from "@/lib/quiz-store";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface Props {
  onComplete: (name: string) => void;
}

export default function CreatorSetup({ onComplete }: Props) {
  const [name, setName] = useState("");
  const { t } = useI18n();

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) { toast.error(t("creator.enterName")); return; }
    if (trimmed.length < 2) { toast.error(t("creator.minLength")); return; }
    setCreatorName(trimmed);
    onComplete(trimmed);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 text-center py-20 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t("creator.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("creator.subtitle")}</p>
        <div className="space-y-4">
          <Input placeholder={t("creator.placeholder")} maxLength={30} value={name} onChange={(e) => setName(e.target.value)} className="text-center text-lg h-12" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          <Button onClick={handleSubmit} className="gap-2 rounded-full px-8 h-11 w-full">
            {t("creator.btn")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
