"use client";

import { useState, useEffect, useMemo } from "react";
import { useNotes } from "@/hooks/use-notes";
import { ViewMode } from "@/lib/types";
import { Sidebar } from "./sidebar";
import { NoteEditor } from "./note-editor";
import { NoteReader } from "./note-reader";
import { NotesGrid } from "./notes-grid";
import { CreateNoteForm } from "./create-note-form";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Folder, ArrowLeft } from "lucide-react";

interface NotesLayoutProps {
  initialViewMode?: ViewMode;
}

export function NotesLayout({ initialViewMode = "list" }: NotesLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  useEffect(() => {
    if (currentSection !== "home") {
      setSelectedCategory(null);
    }
  }, [currentSection]);

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
      case "home":
        return "Recent Notes";
      case "all":
        return "All Notes";
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

  const displayNotes = currentSection === "home" ? recentNotes : notes;

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    categories.forEach((c) => {
      if (c) stats[c] = 0;
    });

    notes.forEach((note) => {
      if (note.category) {
        if (stats[note.category] === undefined) {
          stats[note.category] = 0;
        }
        stats[note.category]++;
      }
    });

    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, notes]);

  const categoryNotes = useMemo(() => {
    if (!selectedCategory) return [];
    return notes.filter((n) => n.category === selectedCategory);
  }, [notes, selectedCategory]);

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
              {currentSection === "home" && (
                <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
                  <div className="flex-1 min-w-0">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  </div>
                  <Button
                    onClick={showCreateForm}
                    className="shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    New Note
                  </Button>
                </div>
              )}
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

              {currentSection === "home" && (
                <div className="mt-12 space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Categories</h2>
                  
                  {selectedCategory ? (
                    <div className="space-y-6">
                      <Button 
                        variant="ghost" 
                        onClick={() => setSelectedCategory(null)}
                        className="-ml-4 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Categories
                      </Button>
                      
                      <NotesGrid
                        notes={categoryNotes}
                        title={selectedCategory}
                        emptyMessage={`No notes in ${selectedCategory}.`}
                        isTrash={false}
                        isLoading={isLoading}
                        onRead={selectNoteForReading}
                        onEdit={selectNoteForEditing}
                        onToggleFavorite={toggleFavorite}
                        onDelete={deleteNote}
                        onRestore={restoreNote}
                        onPermanentlyDelete={permanentlyDeleteNote}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categoryStats.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => setSelectedCategory(cat.name)}
                          className="group flex flex-col items-start rounded-xl border border-border/50 bg-card p-5 text-left transition-all duration-200 hover:border-border hover:shadow-lg hover:shadow-black/5"
                        >
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Folder className="h-5 w-5" />
                          </div>
                          <h3 className="mb-1 w-full truncate text-base font-medium text-foreground">
                            {cat.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {cat.count} {cat.count === 1 ? "note" : "notes"}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
