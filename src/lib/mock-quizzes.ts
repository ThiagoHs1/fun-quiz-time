import type { Question, QuizFormData, Difficulty } from "./constants";
import { GRADIENTS } from "./constants";

export interface FullQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  cover_gradient: string;
  time_limit: number | null;
  shuffle_questions: boolean;
  show_answers: boolean;
  is_public: boolean;
  creator_name: string;
  play_count: number;
  rating_sum: number;
  rating_count: number;
  share_code: string;
  questions: Question[];
}

const MOCK_FULL_QUIZZES: FullQuiz[] = [
  {
    id: "1",
    title: "JavaScript Mastery",
    description: "Test your JS knowledge from basics to advanced concepts.",
    category: "Technology",
    difficulty: "hard",
    cover_gradient: GRADIENTS[0],
    time_limit: 30,
    shuffle_questions: false,
    show_answers: true,
    is_public: true,
    creator_name: "DevGuru",
    play_count: 1243,
    rating_sum: 470,
    rating_count: 100,
    share_code: "JS2024",
    questions: [
      {
        id: "q1",
        question_text: "What is the output of typeof null in JavaScript?",
        question_type: "multiple_choice",
        options: [
          { text: '"null"', is_correct: false },
          { text: '"object"', is_correct: true },
          { text: '"undefined"', is_correct: false },
          { text: '"boolean"', is_correct: false },
        ],
        explanation: "This is a well-known bug in JavaScript. typeof null returns 'object' due to how the language was originally implemented.",
        order_index: 0,
      },
      {
        id: "q2",
        question_text: "Which method creates a new array with the results of calling a function for every array element?",
        question_type: "multiple_choice",
        options: [
          { text: "forEach()", is_correct: false },
          { text: "map()", is_correct: true },
          { text: "filter()", is_correct: false },
          { text: "reduce()", is_correct: false },
        ],
        explanation: "map() creates a new array populated with the results of calling a provided function on every element.",
        order_index: 1,
      },
      {
        id: "q3",
        question_text: "JavaScript is a single-threaded language.",
        question_type: "true_false",
        options: [
          { text: "True", is_correct: true },
          { text: "False", is_correct: false },
        ],
        explanation: "JavaScript runs on a single thread, but uses an event loop and Web APIs to handle asynchronous operations.",
        order_index: 2,
      },
      {
        id: "q4",
        question_text: "What does the '===' operator check in JavaScript?",
        question_type: "multiple_choice",
        options: [
          { text: "Value only", is_correct: false },
          { text: "Type only", is_correct: false },
          { text: "Value and type", is_correct: true },
          { text: "Reference equality", is_correct: false },
        ],
        explanation: "The strict equality operator (===) checks both value and type without performing type coercion.",
        order_index: 3,
      },
      {
        id: "q5",
        question_text: "Which keyword is used to declare a constant in JavaScript?",
        question_type: "multiple_choice",
        options: [
          { text: "var", is_correct: false },
          { text: "let", is_correct: false },
          { text: "const", is_correct: true },
          { text: "static", is_correct: false },
        ],
        explanation: "The 'const' keyword was introduced in ES6 to declare variables that cannot be reassigned.",
        order_index: 4,
      },
    ],
  },
  {
    id: "2",
    title: "Solar System Explorer",
    description: "How much do you know about our cosmic neighborhood?",
    category: "Science",
    difficulty: "medium",
    cover_gradient: GRADIENTS[1],
    time_limit: null,
    shuffle_questions: false,
    show_answers: true,
    is_public: true,
    creator_name: "SpaceNerd",
    play_count: 892,
    rating_sum: 450,
    rating_count: 100,
    share_code: "SOLAR1",
    questions: [
      {
        id: "sq1",
        question_text: "Which planet is known as the Red Planet?",
        question_type: "multiple_choice",
        options: [
          { text: "Venus", is_correct: false },
          { text: "Mars", is_correct: true },
          { text: "Jupiter", is_correct: false },
          { text: "Saturn", is_correct: false },
        ],
        explanation: "Mars is called the Red Planet because iron oxide (rust) on its surface gives it a reddish appearance.",
        order_index: 0,
      },
      {
        id: "sq2",
        question_text: "The Sun is a star.",
        question_type: "true_false",
        options: [
          { text: "True", is_correct: true },
          { text: "False", is_correct: false },
        ],
        explanation: "The Sun is a G-type main-sequence star (G2V), informally known as a yellow dwarf.",
        order_index: 1,
      },
      {
        id: "sq3",
        question_text: "Which planet has the most moons?",
        question_type: "multiple_choice",
        options: [
          { text: "Jupiter", is_correct: false },
          { text: "Saturn", is_correct: true },
          { text: "Uranus", is_correct: false },
          { text: "Neptune", is_correct: false },
        ],
        explanation: "As of recent discoveries, Saturn has overtaken Jupiter with over 140 confirmed moons.",
        order_index: 2,
      },
    ],
  },
];

export function findQuizByShareCode(shareCode: string): FullQuiz | null {
  return MOCK_FULL_QUIZZES.find(
    (q) => q.share_code.toLowerCase() === shareCode.toLowerCase()
  ) ?? null;
}
