import { Link, useLocation } from "react-router-dom";
import { BrainCircuit, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/explore", label: "Explore" },
  { to: "/create", label: "Create" },
  { to: "/my-quizzes", label: "My Quizzes" },
  { to: "/stats", label: "Stats" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <BrainCircuit className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            QuizCraft
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={location.pathname === link.to ? "secondary" : "ghost"}
                size="sm"
                className="font-medium"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl pb-4">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
              <div className={`px-6 py-3 text-sm font-medium transition-colors hover:bg-muted ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}>
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
