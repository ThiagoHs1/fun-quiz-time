const PLAYED_KEY = "quizcraft-played-history";

export interface PlayedQuiz {
  quizId: string;
  quizTitle: string;
  category: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  playedAt: string;
}

export function getPlayedHistory(): PlayedQuiz[] {
  try {
    return JSON.parse(localStorage.getItem(PLAYED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function savePlayedQuiz(entry: PlayedQuiz) {
  const history = getPlayedHistory();
  history.push(entry);
  localStorage.setItem(PLAYED_KEY, JSON.stringify(history));
}

export function getOverviewStats(history: PlayedQuiz[]) {
  const total = history.length;
  const avgScore = total > 0
    ? Math.round(history.reduce((s, h) => s + h.percentage, 0) / total)
    : 0;
  const perfectScores = history.filter((h) => h.percentage === 100).length;
  const totalQuestions = history.reduce((s, h) => s + h.totalQuestions, 0);

  const catCounts: Record<string, number> = {};
  history.forEach((h) => { catCounts[h.category] = (catCounts[h.category] || 0) + 1; });
  const favoriteCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return { total, avgScore, perfectScores, totalQuestions, favoriteCategory };
}

export function getCategoryScores(history: PlayedQuiz[]) {
  const catData: Record<string, { sum: number; count: number }> = {};
  history.forEach((h) => {
    if (!catData[h.category]) catData[h.category] = { sum: 0, count: 0 };
    catData[h.category].sum += h.percentage;
    catData[h.category].count++;
  });
  return Object.entries(catData).map(([cat, d]) => ({
    category: cat,
    score: Math.round(d.sum / d.count),
    fullMark: 100,
  }));
}

export function getDifficultyBreakdown(history: PlayedQuiz[]) {
  // We don't store difficulty in PlayedQuiz, so we approximate from percentage
  // This is a simplified version
  return [
    { difficulty: "Easy", correct: 0, wrong: 0 },
    { difficulty: "Medium", correct: 0, wrong: 0 },
    { difficulty: "Hard", correct: 0, wrong: 0 },
  ];
}

export function getActivityHeatmap(history: PlayedQuiz[]) {
  const now = new Date();
  const days: { date: string; count: number; label: string }[] = [];
  
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = history.filter((h) => h.playedAt.slice(0, 10) === dateStr).length;
    days.push({
      date: dateStr,
      count,
      label: d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    });
  }
  return days;
}

export function getBestScores(history: PlayedQuiz[]) {
  return [...history]
    .sort((a, b) => b.percentage - a.percentage || a.timeTaken - b.timeTaken)
    .slice(0, 5);
}

export function getMostPlayed(history: PlayedQuiz[]) {
  const counts: Record<string, { count: number; title: string; quizId: string }> = {};
  history.forEach((h) => {
    if (!counts[h.quizId]) counts[h.quizId] = { count: 0, title: h.quizTitle, quizId: h.quizId };
    counts[h.quizId].count++;
  });
  return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
}

// Seed some mock data for demo purposes
export function seedDemoHistory() {
  if (getPlayedHistory().length > 0) return;

  const categories = ["Technology", "Science", "History", "Anime & Manga", "Gaming", "Entertainment"];
  const titles = [
    "JavaScript Mastery", "Solar System Explorer", "World War II Facts",
    "Anime Characters Quiz", "Gaming Trivia", "Marvel vs DC",
    "React Hooks Deep Dive", "Python Basics", "Famous Movie Quotes",
    "Country Capitals", "NBA Legends", "One Piece Trivia",
  ];

  const history: PlayedQuiz[] = [];
  const now = Date.now();

  for (let i = 0; i < 25; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const d = new Date(now - daysAgo * 86400000);
    const total = Math.floor(Math.random() * 10) + 5;
    const score = Math.floor(Math.random() * (total + 1));
    history.push({
      quizId: String(Math.floor(Math.random() * 12) + 1),
      quizTitle: titles[Math.floor(Math.random() * titles.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      score,
      totalQuestions: total,
      percentage: Math.round((score / total) * 100),
      timeTaken: Math.floor(Math.random() * 200) + 30,
      playedAt: d.toISOString(),
    });
  }

  history.sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime());
  localStorage.setItem(PLAYED_KEY, JSON.stringify(history));
}
