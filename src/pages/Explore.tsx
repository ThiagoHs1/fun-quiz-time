import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, SlidersHorizontal, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import QuizCard from "@/components/QuizCard";
import { MOCK_QUIZZES, CATEGORIES, type Difficulty } from "@/lib/constants";
import { findQuizByShareCode } from "@/lib/mock-quizzes";
import { toast } from "sonner";

type SortOption = "most_played" | "highest_rated" | "newest" | "most_questions";

const PAGE_SIZE = 12;

export default function Explore() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState<"All" | Difficulty>("All");
  const [sort, setSort] = useState<SortOption>("most_played");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [quickCode, setQuickCode] = useState("");
  const [quickError, setQuickError] = useState(false);
  const quickRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, category, difficulty, sort]);

  const filtered = useMemo(() => {
    let list = [...MOCK_QUIZZES];

    if (search) {
      const s = search.toLowerCase();
      list = list.filter((q) => q.title.toLowerCase().includes(s));
    }
    if (category !== "All") {
      list = list.filter((q) => q.category === category);
    }
    if (difficulty !== "All") {
      list = list.filter((q) => q.difficulty === difficulty);
    }

    switch (sort) {
      case "most_played": list.sort((a, b) => b.play_count - a.play_count); break;
      case "highest_rated": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => parseInt(b.id) - parseInt(a.id)); break;
      case "most_questions": list.sort((a, b) => b.question_count - a.question_count); break;
    }

    return list;
  }, [search, category, difficulty, sort]);

  const featured = useMemo(() => {
    return [...MOCK_QUIZZES]
      .sort((a, b) => b.play_count - a.play_count)
      .slice(0, 6);
  }, []);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleQuickPlay = () => {
    const code = quickCode.trim().toUpperCase();
    if (!code) return;
    const found = findQuizByShareCode(code);
    if (found) {
      navigate(`/play/${code}`);
    } else {
      setQuickError(true);
      quickRef.current?.classList.add("animate-shake");
      setTimeout(() => {
        quickRef.current?.classList.remove("animate-shake");
        setQuickError(false);
      }, 600);
    }
  };

  const difficulties: ("All" | Difficulty)[] = ["All", "easy", "medium", "hard"];

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Search */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-10 space-y-5">
          <h1
            className="text-3xl font-semibold text-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Explore Quizzes
          </h1>
          <p className="text-center text-muted-foreground">
            Discover quizzes created by the community
          </p>

          <div className="max-w-2xl mx-auto flex gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-12 text-base rounded-xl"
              />
            </div>

            {/* Quick play */}
            <div className="relative flex gap-1.5">
              <Input
                ref={quickRef}
                placeholder="Quiz code"
                value={quickCode}
                onChange={(e) => { setQuickCode(e.target.value.toUpperCase()); setQuickError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleQuickPlay()}
                maxLength={6}
                className={`w-28 h-12 text-center font-mono tracking-widest rounded-xl uppercase ${
                  quickError ? "border-destructive" : ""
                }`}
              />
              <Button
                size="icon"
                className="h-12 w-12 rounded-xl shrink-0"
                onClick={handleQuickPlay}
                disabled={!quickCode.trim()}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {quickError && (
            <p className="text-center text-sm text-destructive animate-fade-in">
              Quiz not found. Check the code and try again.
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-8">
        {/* Filters */}
        <div className="space-y-4">
          {/* Category pills */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground shrink-0">Category</span>
            <ScrollArea className="flex-1">
              <div className="flex gap-1.5 pb-2">
                {["All", ...CATEGORIES].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      category === c
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Difficulty + Sort */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Difficulty</span>
              <div className="flex gap-1">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                      difficulty === d
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger className="w-[160px] h-9 text-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most_played">Most Played</SelectItem>
                  <SelectItem value="highest_rated">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="most_questions">Most Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        {!search && category === "All" && difficulty === "All" && (
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ✨ Featured
            </h2>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4 snap-x snap-mandatory">
                {featured.map((quiz) => (
                  <div key={quiz.id} className="w-[280px] shrink-0 snap-start">
                    <QuizCard
                      {...quiz}
                      featured
                      onClick={() => quiz.share_code && navigate(`/play/${quiz.share_code}`)}
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} quiz{filtered.length !== 1 ? "zes" : ""} found
          </p>
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  {...quiz}
                  onClick={() => quiz.share_code && navigate(`/play/${quiz.share_code}`)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  className="rounded-full px-8"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <h3
              className="text-xl font-semibold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              No quizzes found
            </h3>
            <p className="text-muted-foreground mb-6">
              Be the first to create one!
            </p>
            <Button className="rounded-full" onClick={() => navigate("/create")}>
              Create Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
