import { useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Link, MessageCircle, QrCode, Download } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface Props {
  shareCode: string;
  title: string;
  variant?: "ghost" | "outline";
  size?: "sm" | "icon" | "default";
}

export default function ShareDropdown({ shareCode, title, variant = "ghost", size = "sm" }: Props) {
  const [qrOpen, setQrOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const url = `${window.location.origin}/play/${shareCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(shareCode);
    toast.success("Code copied!");
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Jogue este quiz: ${title} → ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Check out this quiz: "${title}"`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank");
  };

  // Simple QR code generator using canvas
  useEffect(() => {
    if (!qrOpen || !canvasRef.current) return;
    drawQR(canvasRef.current, url);
  }, [qrOpen, url]);

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `quizcraft-${shareCode}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    toast.success("QR Code downloaded!");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className="gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            {size !== "icon" && "Share"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={copyLink} className="gap-2 cursor-pointer">
            <Link className="h-4 w-4" /> Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyCode} className="gap-2 cursor-pointer">
            <Copy className="h-4 w-4" /> Copy Code
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={shareWhatsApp} className="gap-2 cursor-pointer">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareTwitter} className="gap-2 cursor-pointer">
            <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">𝕏</span> Twitter/X
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setQrOpen(true)} className="gap-2 cursor-pointer">
            <QrCode className="h-4 w-4" /> QR Code
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center">QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <canvas ref={canvasRef} width={200} height={200} className="rounded-lg border border-border" />
            <p className="text-xs text-muted-foreground text-center font-mono">{shareCode}</p>
            <Button onClick={downloadQR} className="gap-2 rounded-full w-full">
              <Download className="h-4 w-4" /> Download PNG
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Simple QR-like pattern renderer (decorative - real QR would need a library)
function drawQR(canvas: HTMLCanvasElement, text: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = 200;
  const moduleCount = 21;
  const cellSize = size / moduleCount;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#000000";

  // Generate a simple hash-based pattern
  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return h;
  };

  // Draw finder patterns (corners)
  const drawFinder = (x: number, y: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (isBorder || isInner) {
          ctx.fillRect((x + c) * cellSize, (y + r) * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(moduleCount - 7, 0);
  drawFinder(0, moduleCount - 7);

  // Data area
  const seed = hash(text);
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= moduleCount - 8) || (r >= moduleCount - 8 && c < 8)) continue;
      const v = hash(`${seed}-${r}-${c}`) & 1;
      if (v) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }

  // Center text
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(size / 2 - 30, size / 2 - 8, 60, 16);
  ctx.fillStyle = "#000000";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText(text.slice(-10), size / 2, size / 2 + 4);
}
