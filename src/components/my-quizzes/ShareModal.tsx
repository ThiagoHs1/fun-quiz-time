import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  shareCode: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareModal({ shareCode, open, onOpenChange }: Props) {
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  if (!shareCode) return null;

  const url = `${window.location.origin}/play/${shareCode}`;

  const copyText = (text: string, type: "link" | "code") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">Quiz Code</p>
            <div className="flex gap-2">
              <Input readOnly value={shareCode} className="font-mono text-lg text-center tracking-widest" />
              <Button variant="outline" size="icon" onClick={() => copyText(shareCode, "code")}>
                {copied === "code" ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">Share Link</p>
            <div className="flex gap-2">
              <Input readOnly value={url} className="text-sm" />
              <Button variant="outline" size="icon" onClick={() => copyText(url, "link")}>
                {copied === "link" ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
