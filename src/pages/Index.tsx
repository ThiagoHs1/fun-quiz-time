import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuizCard from "@/components/QuizCard";
import { MOCK_QUIZZES } from "@/lib/constants";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-24 md:py-32 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" /> Free & Open to Everyone
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight max-w-3xl mx-auto leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Create, play & share{" "}
            <span className="text-primary">quizzes</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Build your own quiz in minutes or challenge yourself with quizzes from the community
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/create">
              <Button size="lg" className="gap-2 text-base px-8 rounded-full">
                <BrainCircuit className="h-5 w-5" /> Create a Quiz
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="text-base px-8 rounded-full">
                Explore Quizzes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Quizzes */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Popular Quizzes
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_QUIZZES.map((quiz) => (
            <QuizCard key={quiz.id} {...quiz} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
