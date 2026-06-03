"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { NotesLayout } from "@/components/notes-layout";
import { LandingPage } from "@/components/landing-page";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const { user, isAuthloading } = useAuth();
  const [showCreateOnMount, setShowCreateOnMount] = useState(false);

  const handleShowCreateNote = useCallback(() => {
    setShowCreateOnMount(true);
  }, []);

  if (isAuthloading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-10 w-10 text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user?.isAuthenticated) {
    return <LandingPage onShowCreateNote={handleShowCreateNote} />;
  }

  return (
    <NotesLayout initialViewMode={showCreateOnMount ? "create" : "list"} />
  );
}
