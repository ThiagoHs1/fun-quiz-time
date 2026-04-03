import type { QuizFormData, Question } from "./constants";
import { generateShareCode } from "./constants";
import type { FullQuiz } from "./mock-quizzes";

const CREATOR_NAME_KEY = "quizcraft-creator-name";
const DRAFTS_KEY = "quizcraft-drafts";
const PUBLISHED_KEY = "quizcraft-published";

export interface DraftQuiz {
  id: string;
  formData: QuizFormData;
  questions: Question[];
  savedAt: string;
}

export interface MockResult {
  id: string;
  quiz_id: string;
  player_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken: number;
  played_at: string;
  answers: { question_id: string; selected_index: number; correct: boolean; time: number }[];
}

// Creator name
export function getCreatorName(): string | null {
  return localStorage.getItem(CREATOR_NAME_KEY);
}

export function setCreatorName(name: string) {
  localStorage.setItem(CREATOR_NAME_KEY, name);
}

// Drafts
export function getDrafts(): DraftQuiz[] {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
  } catch { return []; }
}

export function saveDraft(draft: DraftQuiz) {
  const drafts = getDrafts();
  const idx = drafts.findIndex((d) => d.id === draft.id);
  if (idx >= 0) drafts[idx] = draft; else drafts.push(draft);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function deleteDraft(id: string) {
  const drafts = getDrafts().filter((d) => d.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

// Published quizzes (localStorage mock for now)
export function getPublishedQuizzes(): FullQuiz[] {
  try {
    return JSON.parse(localStorage.getItem(PUBLISHED_KEY) || "[]");
  } catch { return []; }
}

export function savePublishedQuiz(quiz: FullQuiz) {
  const quizzes = getPublishedQuizzes();
  const idx = quizzes.findIndex((q) => q.id === quiz.id);
  if (idx >= 0) quizzes[idx] = quiz; else quizzes.push(quiz);
  localStorage.setItem(PUBLISHED_KEY, JSON.stringify(quizzes));
}

export function deletePublishedQuiz(id: string) {
  const quizzes = getPublishedQuizzes().filter((q) => q.id !== id);
  localStorage.setItem(PUBLISHED_KEY, JSON.stringify(quizzes));
}

export function publishDraft(draft: DraftQuiz, creatorName: string): FullQuiz {
  const quiz: FullQuiz = {
    id: draft.id,
    title: draft.formData.title,
    description: draft.formData.description,
    category: draft.formData.category || "General Knowledge",
    difficulty: draft.formData.difficulty,
    cover_gradient: draft.formData.cover_gradient,
    time_limit: draft.formData.time_limit,
    shuffle_questions: draft.formData.shuffle_questions,
    show_answers: draft.formData.show_answers,
    is_public: draft.formData.is_public,
    creator_name: creatorName,
    play_count: 0,
    rating_sum: 0,
    rating_count: 0,
    share_code: generateShareCode(),
    questions: draft.questions,
  };
  savePublishedQuiz(quiz);
  deleteDraft(draft.id);
  return quiz;
}

// Mock results for stats
export function getResultsForQuiz(quizId: string): MockResult[] {
  try {
    const all: MockResult[] = JSON.parse(localStorage.getItem("quizcraft-results") || "[]");
    return all.filter((r) => r.quiz_id === quizId);
  } catch { return []; }
}

export function getAllMyQuizzes(creatorName: string): { published: FullQuiz[]; drafts: DraftQuiz[] } {
  const published = getPublishedQuizzes().filter(
    (q) => q.creator_name.toLowerCase() === creatorName.toLowerCase()
  );
  const drafts = getDrafts();
  return { published, drafts };
}
