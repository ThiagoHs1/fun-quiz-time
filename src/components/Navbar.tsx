import { Link, useLocation } from "react-router-dom";
import { BrainCircuit, Sun, Moon, Menu, X, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTheme, COLOR_THEMES } from "@/lib/theme";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/explore", label: "Explore" },
  { to: "/create", label: "Create" },
  { to: "/my-quizzes", label: "My Quizzes" },
  { to: "/stats", label: "Stats" },
];

export default function Navbar() {
  const { theme, colorTheme, toggleTheme, setColorTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <BrainCircuit className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
          <span className="text-xl font-bold tracking-tight hidden sm:inline" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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

        <div className="flex items-center gap-1">
          {/* Color theme picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Palette className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-xs">Color Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {COLOR_THEMES.map((t) => (
                <DropdownMenuItem
                  key={t.value}
                  onClick={() => setColorTheme(t.value)}
                  className="gap-2 cursor-pointer"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-border shrink-0"
                    style={{ backgroundColor: `hsl(${t.hue} 55%)` }}
                  />
                  <span className="flex-1">{t.label}</span>
                  {colorTheme === t.value && (
                    <span className="text-primary text-xs">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl pb-4 animate-slide-down">
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
