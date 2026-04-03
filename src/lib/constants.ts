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
    id: "1", title: "JavaScript Mastery", description: "Test your JS knowledge from basics to advanced concepts.", category: "Technology", difficulty: "hard" as Difficulty,
    question_count: 15, play_count: 1243, rating: 4.7, cover_gradient: GRADIENTS[0], share_code: "JS2024",
  },
  {
    id: "2", title: "Solar System Explorer", description: "How much do you know about our cosmic neighborhood?", category: "Science", difficulty: "medium" as Difficulty,
    question_count: 10, play_count: 892, rating: 4.5, cover_gradient: GRADIENTS[1], share_code: "SOLAR1",
  },
  {
    id: "3", title: "World War II Facts", description: "Challenge your knowledge of WWII history.", category: "History", difficulty: "hard" as Difficulty,
    question_count: 20, play_count: 567, rating: 4.3, cover_gradient: GRADIENTS[2], share_code: "WW2QZ1",
  },
  {
    id: "4", title: "Anime Characters Quiz", description: "Can you name these iconic anime characters?", category: "Anime & Manga", difficulty: "easy" as Difficulty,
    question_count: 12, play_count: 2100, rating: 4.8, cover_gradient: GRADIENTS[3], share_code: "ANIME1",
  },
  {
    id: "5", title: "90s Music Hits", description: "Test your knowledge of the greatest 90s bangers.", category: "Music", difficulty: "medium" as Difficulty,
    question_count: 8, play_count: 430, rating: 4.1, cover_gradient: GRADIENTS[4], share_code: "MUS90S",
  },
  {
    id: "6", title: "Country Capitals", description: "Match countries with their capital cities.", category: "Geography", difficulty: "easy" as Difficulty,
    question_count: 25, play_count: 3400, rating: 4.6, cover_gradient: GRADIENTS[5], share_code: "CAPS01",
  },
  {
    id: "7", title: "React Hooks Deep Dive", description: "How well do you understand React hooks?", category: "Technology", difficulty: "hard" as Difficulty,
    question_count: 10, play_count: 780, rating: 4.4, cover_gradient: GRADIENTS[6], share_code: "REACT1",
  },
  {
    id: "8", title: "NBA Legends", description: "Test your knowledge of basketball's greatest players.", category: "Sports", difficulty: "medium" as Difficulty,
    question_count: 15, play_count: 1100, rating: 4.2, cover_gradient: GRADIENTS[7], share_code: "NBA001",
  },
  {
    id: "9", title: "Marvel vs DC", description: "Do you know your superheroes?", category: "Entertainment", difficulty: "easy" as Difficulty,
    question_count: 20, play_count: 1850, rating: 4.6, cover_gradient: GRADIENTS[0], share_code: "HERO01",
  },
  {
    id: "10", title: "Python Basics", description: "Are you a Python beginner or expert?", category: "Technology", difficulty: "easy" as Difficulty,
    question_count: 12, play_count: 960, rating: 4.3, cover_gradient: GRADIENTS[1], share_code: "PYTH01",
  },
  {
    id: "11", title: "Famous Movie Quotes", description: "Name the movie from the iconic quote.", category: "Movies & TV", difficulty: "medium" as Difficulty,
    question_count: 15, play_count: 2200, rating: 4.7, cover_gradient: GRADIENTS[2], share_code: "MOVIE1",
  },
  {
    id: "12", title: "Gaming Trivia", description: "How much do you know about video games?", category: "Gaming", difficulty: "medium" as Difficulty,
    question_count: 18, play_count: 1500, rating: 4.5, cover_gradient: GRADIENTS[3], share_code: "GAME01",
  },
  {
    id: "13", title: "Basic Math Challenge", description: "Quick math problems to test your speed.", category: "Math", difficulty: "easy" as Difficulty,
    question_count: 10, play_count: 700, rating: 3.9, cover_gradient: GRADIENTS[4], share_code: "MATH01",
  },
  {
    id: "14", title: "English Idioms", description: "Do you know what these common idioms mean?", category: "Language", difficulty: "medium" as Difficulty,
    question_count: 14, play_count: 480, rating: 4.0, cover_gradient: GRADIENTS[5], share_code: "LANG01",
  },
  {
    id: "15", title: "General Knowledge Mix", description: "A random mix of fun trivia questions.", category: "General Knowledge", difficulty: "medium" as Difficulty,
    question_count: 20, play_count: 3100, rating: 4.4, cover_gradient: GRADIENTS[6], share_code: "GK0001",
  },
  {
    id: "16", title: "One Piece Trivia", description: "Test your knowledge of the Grand Line!", category: "Anime & Manga", difficulty: "hard" as Difficulty,
    question_count: 15, play_count: 1700, rating: 4.9, cover_gradient: GRADIENTS[7], share_code: "OP0001",
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
