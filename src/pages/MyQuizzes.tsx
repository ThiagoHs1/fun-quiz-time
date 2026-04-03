import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MyQuizzes() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 text-center py-20">
        <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          My Quizzes
        </h1>
        <p className="text-muted-foreground mb-6">Your created quizzes will appear here after you publish them.</p>
        <Link to="/create">
          <Button className="rounded-full">Create Your First Quiz</Button>
        </Link>
      </div>
    </div>
  );
}
