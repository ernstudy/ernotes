"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "./auth-modal";
import { FileText } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

interface LandingPageProps {
  onShowCreateNote?: () => void;
}

export function LandingPage({ onShowCreateNote }: LandingPageProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [pendingAction, setPendingAction] = useState<"create" | null>(null);
  const { user } = useAuth();

  // After authentication, trigger pending action
  useEffect(() => {
    if (
      user?.isAuthenticated &&
      pendingAction === "create" &&
      onShowCreateNote
    ) {
      onShowCreateNote();
      setPendingAction(null);
    }
  }, [user?.isAuthenticated, pendingAction, onShowCreateNote]);

  const openAuthModal = (mode: "login" | "register", action?: "create") => {
    setAuthMode(mode);

    if (action) {
      setPendingAction(action);
    }
    setIsAuthModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
    if (!user?.isAuthenticated) {
      setPendingAction(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Image
                src="/android-chrome-192x192.png"
                alt="ERNotes"
                width={32}
                height={32}
              />
            </div>
            <span className="text-xl font-semibold text-foreground">
              ERNotes
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => openAuthModal("login")}
              className="text-foreground/80 hover:text-foreground"
            >
              Login
            </Button>
            <Button
              onClick={() => openAuthModal("register")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Capture ideas,
            <br />
            <span className="text-primary">stay organized.</span>
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Free and fast note-taking designed for clarity, focus, and
            organization. Capture thoughts, ideas, and important information in
            seconds, keep everything neatly organized, and find what you need
            whenever you need it.
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              onClick={() => openAuthModal("login", "create")}
              className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            >
              Create Note
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ERNotes. Developed by{" "}
          <a
            href="https://ernstudy.com"
            className="text-segundary font-bold hover:underline"
          >
            Ernstudy
          </a>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseModal}
        initialMode={authMode}
      />
    </div>
  );
}
