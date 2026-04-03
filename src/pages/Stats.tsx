import { BarChart3 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Stats() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 text-center py-20">
        <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {t("stats.title")}
        </h1>
        <p className="text-muted-foreground">{t("stats.subtitle")}</p>
      </div>
    </div>
  );
}
