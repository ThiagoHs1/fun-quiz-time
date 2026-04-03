export const CATEGORIES = [
  "Technology", "Science", "History", "Geography", "Sports",
  "Entertainment", "Anime & Manga", "Gaming", "Music",
  "Movies & TV", "General Knowledge", "Language", "Math", "Custom",
] as const;

export type Category = typeof CATEGORIES[number];
export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "multiple_choice" | "true_false";

export interface QuizOption {
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: QuizOption[];
  explanation: string;
  order_index: number;
}

export interface QuizFormData {
  title: string;
  description: string;
  category: Category | "";
  difficulty: Difficulty;
  cover_gradient: string;
  time_limit: number | null;
  shuffle_questions: boolean;
  show_answers: boolean;
  is_public: boolean;
}

export const GRADIENTS = [
  "linear-gradient(135deg, hsl(262, 83%, 58%), hsl(310, 80%, 55%))",
  "linear-gradient(135deg, hsl(200, 85%, 50%), hsl(262, 83%, 58%))",
  "linear-gradient(135deg, hsl(340, 80%, 55%), hsl(30, 90%, 55%))",
  "linear-gradient(135deg, hsl(170, 70%, 45%), hsl(200, 85%, 50%))",
  "linear-gradient(135deg, hsl(30, 90%, 55%), hsl(50, 95%, 55%))",
  "linear-gradient(135deg, hsl(262, 83%, 40%), hsl(200, 85%, 30%))",
  "linear-gradient(135deg, hsl(340, 70%, 40%), hsl(262, 83%, 50%))",
  "linear-gradient(135deg, hsl(170, 70%, 30%), hsl(262, 60%, 40%))",
];

export const MOCK_QUIZZES = [
  {
    id: "1", title: "JavaScript Mastery", category: "Technology", difficulty: "hard" as Difficulty,
    question_count: 15, play_count: 1243, rating: 4.7, cover_gradient: GRADIENTS[0],
  },
  {
    id: "2", title: "Solar System Explorer", category: "Science", difficulty: "medium" as Difficulty,
    question_count: 10, play_count: 892, rating: 4.5, cover_gradient: GRADIENTS[1],
  },
  {
    id: "3", title: "World War II Facts", category: "History", difficulty: "hard" as Difficulty,
    question_count: 20, play_count: 567, rating: 4.3, cover_gradient: GRADIENTS[2],
  },
  {
    id: "4", title: "Anime Characters Quiz", category: "Anime & Manga", difficulty: "easy" as Difficulty,
    question_count: 12, play_count: 2100, rating: 4.8, cover_gradient: GRADIENTS[3],
  },
  {
    id: "5", title: "90s Music Hits", category: "Music", difficulty: "medium" as Difficulty,
    question_count: 8, play_count: 430, rating: 4.1, cover_gradient: GRADIENTS[4],
  },
  {
    id: "6", title: "Country Capitals", category: "Geography", difficulty: "easy" as Difficulty,
    question_count: 25, play_count: 3400, rating: 4.6, cover_gradient: GRADIENTS[5],
  },
];

export function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
