"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { NotesLayout } from "@/components/notes-layout";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  const { user, loading } = useAuth();
  const [showCreateOnMount, setShowCreateOnMount] = useState(false);

  const handleShowCreateNote = useCallback(() => {
    setShowCreateOnMount(true);
  }, []);

  if (loading) return null;

  if (!user?.isAuthenticated) {
    return <LandingPage onShowCreateNote={handleShowCreateNote} />;
  }

  return (
    <NotesLayout initialViewMode={showCreateOnMount ? "create" : "list"} />
  );
}
