import { useState } from "react";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";

interface Props {
  quizTitle: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ quizTitle, open, onOpenChange, onConfirm }: Props) {
  const [typed, setTyped] = useState("");
  const { t } = useI18n();

  const handleOpenChange = (v: boolean) => {
    if (!v) setTyped("");
    onOpenChange(v);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete.description")} <strong>"{quizTitle}"</strong> {t("delete.toConfirm")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input placeholder={t("delete.placeholder")} value={typed} onChange={(e) => setTyped(e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel>{t("delete.cancel")}</AlertDialogCancel>
          <AlertDialogAction disabled={typed !== quizTitle} onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {t("delete.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
