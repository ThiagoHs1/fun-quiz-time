import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Plus, Edit, BarChart3, Share2, Copy, Trash2, Rocket,
  HelpCircle, Play,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import CreatorSetup from "@/components/my-quizzes/CreatorSetup";
import QuizStatsModal from "@/components/my-quizzes/QuizStatsModal";
import ShareModal from "@/components/my-quizzes/ShareModal";
import DeleteConfirmModal from "@/components/my-quizzes/DeleteConfirmModal";
import {
  getCreatorName, getDrafts, getPublishedQuizzes,
  deleteDraft, deletePublishedQuiz, publishDraft, saveDraft,
  type DraftQuiz,
} from "@/lib/quiz-store";
import type { FullQuiz } from "@/lib/mock-quizzes";

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Science: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  History: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "Anime & Manga": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  Gaming: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Entertainment: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/10 text-green-600 dark:text-green-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function MyQuizzes() {
  const navigate = useNavigate();
  const { t, tCat, tDiff } = useI18n();
  const [creatorName, setCreatorName] = useState<string | null>(getCreatorName());
  const [drafts, setDrafts] = useState<DraftQuiz[]>([]);
  const [published, setPublished] = useState<FullQuiz[]>([]);
  const [statsQuiz, setStatsQuiz] = useState<FullQuiz | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string; type: "draft" | "published" } | null>(null);

  const refresh = () => {
    setDrafts(getDrafts());
    const name = getCreatorName();
    if (name) {
      setPublished(getPublishedQuizzes().filter((q) => q.creator_name.toLowerCase() === name.toLowerCase()));
    }
  };

  useEffect(() => { refresh(); }, [creatorName]);

  if (!creatorName) {
    return <CreatorSetup onComplete={(name) => { setCreatorName(name); toast.success(`Welcome, ${name}!`); }} />;
  }

  const handlePublishDraft = (draft: DraftQuiz) => {
    const quiz = publishDraft(draft, creatorName);
    toast.success(`${t("myQuizzes.publishedSuccess")} ${quiz.share_code}`);
    refresh();
  };

  const handleDuplicate = (quiz: FullQuiz) => {
    const draft: DraftQuiz = {
      id: crypto.randomUUID(),
      formData: {
        title: `${quiz.title} (Copy)`, description: quiz.description, category: quiz.category as any,
        difficulty: quiz.difficulty, cover_gradient: quiz.cover_gradient, time_limit: quiz.time_limit,
        shuffle_questions: quiz.shuffle_questions, show_answers: quiz.show_answers, is_public: quiz.is_public,
      },
      questions: quiz.questions.map((q) => ({ ...q, id: crypto.randomUUID() })),
      savedAt: new Date().toISOString(),
    };
    saveDraft(draft);
    toast.success(t("myQuizzes.duplicated"));
    refresh();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "draft") deleteDraft(deleteTarget.id);
    else deletePublishedQuiz(deleteTarget.id);
    toast.success(t("myQuizzes.deleted"));
    setDeleteTarget(null);
    refresh();
  };

  const isEmpty = drafts.length === 0 && published.length === 0;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{t("myQuizzes.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("myQuizzes.creatingAs")} <span className="font-medium text-foreground">{creatorName}</span>
            </p>
          </div>
          <Link to="/create">
            <Button className="gap-2 rounded-full"><Plus className="h-4 w-4" /> {t("myQuizzes.newQuiz")}</Button>
          </Link>
        </div>

        {isEmpty && (
          <div className="text-center py-20">
            <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("myQuizzes.noQuizzes")}</h2>
            <p className="text-muted-foreground mb-6">{t("myQuizzes.createFirst")}</p>
            <Link to="/create"><Button className="rounded-full px-8">{t("myQuizzes.createFirstBtn")}</Button></Link>
          </div>
        )}

        {drafts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("myQuizzes.drafts")}</h2>
            <div className="space-y-3">
              {drafts.map((draft) => (
                <Card key={draft.id} className="p-0 overflow-hidden">
                  <div className="flex items-stretch">
                    <div className="w-20 sm:w-28 shrink-0 flex items-center justify-center" style={{ background: draft.formData.cover_gradient || "hsl(var(--muted))" }}>
                      <HelpCircle className="h-8 w-8 text-white/40" />
                    </div>
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{draft.formData.title || t("preview.untitled")}</h3>
                            <Badge variant="secondary" className="shrink-0 text-xs">{t("create.draft")}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{draft.formData.description || t("myQuizzes.noDescription")}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {draft.formData.category && (
                              <Badge variant="outline" className={`text-xs ${categoryColors[draft.formData.category] || ""}`}>{tCat(draft.formData.category)}</Badge>
                            )}
                            <Badge variant="outline" className={`text-xs capitalize ${difficultyColors[draft.formData.difficulty] || ""}`}>{tDiff(draft.formData.difficulty)}</Badge>
                            <span className="text-xs text-muted-foreground">{draft.questions.length} {t("questions.questions")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-1 p-3 border-l border-border">
                      <Button variant="ghost" size="sm" className="gap-1.5 justify-start" onClick={() => navigate(`/create?draft=${draft.id}`)}>
                        <Edit className="h-3.5 w-3.5" /> {t("myQuizzes.edit")}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5 justify-start" onClick={() => handlePublishDraft(draft)}>
                        <Rocket className="h-3.5 w-3.5" /> {t("myQuizzes.publish")}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5 justify-start text-destructive hover:text-destructive" onClick={() => setDeleteTarget({ id: draft.id, title: draft.formData.title || "Untitled Quiz", type: "draft" })}>
                        <Trash2 className="h-3.5 w-3.5" /> {t("myQuizzes.delete")}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {published.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t("myQuizzes.published")}</h2>
            <div className="space-y-3">
              {published.map((quiz) => (
                <Card key={quiz.id} className="p-0 overflow-hidden">
                  <div className="flex items-stretch">
                    <div className="w-20 sm:w-28 shrink-0 flex items-center justify-center" style={{ background: quiz.cover_gradient || "hsl(var(--muted))" }}>
                      <HelpCircle className="h-8 w-8 text-white/40" />
                    </div>
                    <div className="flex-1 p-4 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{quiz.title}</h3>
                          <Badge className="shrink-0 text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" variant="outline">{t("myQuizzes.published")}</Badge>
                          {!quiz.is_public && <Badge variant="secondary" className="shrink-0 text-xs">{t("preview.private")}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{quiz.description}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <Badge variant="outline" className={`text-xs ${categoryColors[quiz.category] || ""}`}>{tCat(quiz.category)}</Badge>
                          <Badge variant="outline" className={`text-xs capitalize ${difficultyColors[quiz.difficulty] || ""}`}>{tDiff(quiz.difficulty)}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Play className="h-3 w-3" /> {quiz.play_count} {t("myQuizzes.plays")}</span>
                          <span className="text-xs text-muted-foreground">★ {quiz.rating_count > 0 ? (quiz.rating_sum / quiz.rating_count).toFixed(1) : "—"}</span>
                          <span className="text-xs text-muted-foreground">{quiz.questions.length} {t("questions.questions")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-1 p-3 border-l border-border">
                      <Button variant="ghost" size="sm" className="gap-1.5 justify-start" onClick={() => navigate(`/create?edit=${quiz.id}`)}>
                        <Edit className="h-3.5 w-3.5" /> {t("myQuizzes.edit")}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5 justify-start" onClick={() => setStatsQuiz(quiz)}>
                        <BarChart3 className="h-3.5 w-3.5" /> {t("myQuizzes.stats")}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5 justify-start" onClick={() => setShareCode(quiz.share_code)}>
                        <Share2 className="h-3.5 w-3.5" /> {t("myQuizzes.share")}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5 justify-start" onClick={() => handleDuplicate(quiz)}>
                        <Copy className="h-3.5 w-3.5" /> {t("myQuizzes.duplicate")}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5 justify-start text-destructive hover:text-destructive" onClick={() => setDeleteTarget({ id: quiz.id, title: quiz.title, type: "published" })}>
                        <Trash2 className="h-3.5 w-3.5" /> {t("myQuizzes.delete")}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <QuizStatsModal quiz={statsQuiz} open={!!statsQuiz} onOpenChange={(v) => !v && setStatsQuiz(null)} />
      <ShareModal shareCode={shareCode} open={!!shareCode} onOpenChange={(v) => !v && setShareCode(null)} />
      <DeleteConfirmModal quizTitle={deleteTarget?.title || null} open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}
