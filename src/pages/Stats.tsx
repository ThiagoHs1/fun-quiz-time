import { BarChart3 } from "lucide-react";

export default function Stats() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 text-center py-20">
        <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Statistics
        </h1>
        <p className="text-muted-foreground">Play some quizzes to see your stats here!</p>
      </div>
    </div>
  );
}
