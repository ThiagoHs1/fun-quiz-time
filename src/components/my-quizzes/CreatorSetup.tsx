import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, ArrowRight } from "lucide-react";
import { setCreatorName } from "@/lib/quiz-store";
import { toast } from "sonner";

interface Props {
  onComplete: (name: string) => void;
}

export default function CreatorSetup({ onComplete }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) { toast.error("Please enter a creator name"); return; }
    if (trimmed.length < 2) { toast.error("Name must be at least 2 characters"); return; }
    setCreatorName(trimmed);
    onComplete(trimmed);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 text-center py-20 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Start creating quizzes!</h1>
        <p className="text-muted-foreground mb-8">
          Choose a creator name to get started. This will be shown on your published quizzes.
        </p>
        <div className="space-y-4">
          <Input
            placeholder="Your creator name"
            maxLength={30}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-center text-lg h-12"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button onClick={handleSubmit} className="gap-2 rounded-full px-8 h-11 w-full">
            Create My First Quiz <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
