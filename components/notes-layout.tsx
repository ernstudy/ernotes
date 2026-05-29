"use client";

import { useState, useEffect } from "react";
import { useNotes } from "@/hooks/use-notes";
import { ViewMode } from "@/lib/types";
import { Sidebar } from "./sidebar";
import { NoteEditor } from "./note-editor";
import { NoteReader } from "./note-reader";
import { NotesGrid } from "./notes-grid";
import { CreateNoteForm } from "./create-note-form";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface NotesLayoutProps {
  initialViewMode?: ViewMode;
}

export function NotesLayout({ initialViewMode = "list" }: NotesLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
    notes,
    recentNotes,
    categories,
    selectedNote,
    currentSection,
    viewMode,
    searchQuery,
    isLoading,
    setCurrentSection,
    setSearchQuery,
    createNote,
    updateNote,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    toggleFavorite,
    selectNoteForEditing,
    selectNoteForReading,
    showCreateForm,
    showDashboard,
    setViewMode,
  } = useNotes();

  // Set initial view mode on mount
  useEffect(() => {
    if (initialViewMode !== "list") {
      setViewMode(initialViewMode);
    }
  }, []);

  const handleCreateNote = (data: { title: string; content: string; category: string }) => {
    createNote(data);
    showDashboard();
  };

  const handleSectionChange = (section: typeof currentSection) => {
    setCurrentSection(section);
    showDashboard();
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case "favorites":
        return "Favorites";
      case "trash":
        return "Trash";
      default:
        return "Recent Notes";
    }
  };

  const getSectionEmptyMessage = () => {
    switch (currentSection) {
      case "favorites":
        return "No favorite notes yet. Star a note to add it here.";
      case "trash":
        return "Trash is empty.";
      default:
        return "No notes yet. Create your first note to get started.";
    }
  };

  const displayNotes = currentSection === "all" ? recentNotes : notes;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        currentSection={currentSection}
        searchQuery={searchQuery}
        isMobileOpen={isMobileSidebarOpen}
        onSectionChange={handleSectionChange}
        onSearchChange={setSearchQuery}
        onCreateNote={showCreateForm}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="flex items-center border-b border-border/50 px-4 py-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-medium">
            {(viewMode === "editor" || viewMode === "read") && selectedNote
              ? selectedNote.title || "Untitled"
              : viewMode === "create"
              ? "Create Note"
              : getSectionTitle()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === "create" ? (
            <CreateNoteForm
              categories={categories}
              onSave={handleCreateNote}
              onCancel={showDashboard}
            />
          ) : viewMode === "read" ? (
            <NoteReader
              note={selectedNote}
              onEdit={selectNoteForEditing}
              onToggleFavorite={toggleFavorite}
              onDelete={deleteNote}
              onBack={showDashboard}
            />
          ) : viewMode === "editor" ? (
            <NoteEditor
              note={selectedNote}
              categories={categories}
              isTrashSection={currentSection === "trash"}
              onUpdateNote={updateNote}
              onToggleFavorite={toggleFavorite}
              onDeleteNote={deleteNote}
              onRestoreNote={restoreNote}
              onPermanentlyDeleteNote={permanentlyDeleteNote}
              onBack={showDashboard}
            />
          ) : (
            <div className="h-full overflow-auto px-6 py-8 lg:px-8">
              <NotesGrid
                notes={displayNotes}
                title={getSectionTitle()}
                emptyMessage={getSectionEmptyMessage()}
                isTrash={currentSection === "trash"}
                isLoading={isLoading}
                onRead={selectNoteForReading}
                onEdit={selectNoteForEditing}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteNote}
                onRestore={restoreNote}
                onPermanentlyDelete={permanentlyDeleteNote}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
