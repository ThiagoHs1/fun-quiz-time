import { useNavigate } from "react-router-dom";
import QuizCard from "@/components/QuizCard";
import { MOCK_QUIZZES } from "@/lib/constants";

export default function Explore() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Explore Quizzes
        </h1>
        <p className="text-muted-foreground mb-8">Discover quizzes created by the community</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_QUIZZES.map((quiz) => (
            <QuizCard key={quiz.id} {...quiz} />
          ))}
        </div>
      </div>
    </div>
  );
}
