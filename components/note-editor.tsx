"use client";

import { useEffect, useRef, useState } from "react";
import { Note } from "@/lib/types";
import { EmptyState } from "./empty-state";
import { CategoryCombobox } from "./category-combobox";
import { Star, Trash2, RotateCcw, Trash, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  note: Note | null;
  categories: string[];
  isTrashSection?: boolean;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onRestoreNote: (id: string) => void;
  onPermanentlyDeleteNote: (id: string) => void;
  onBack: () => void;
}

export function NoteEditor({
  note,
  categories,
  isTrashSection,
  onUpdateNote,
  onToggleFavorite,
  onDeleteNote,
  onRestoreNote,
  onPermanentlyDeleteNote,
  onBack,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState(note?.category || "");
  const [isSaving, setIsSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when note changes
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setCategory(note?.category || "");
  }, [note?.id, note?.title, note?.content, note?.category]);

  // Focus title on new note
  useEffect(() => {
    if (note && !note.title && titleRef.current) {
      titleRef.current.focus();
    }
  }, [note?.id]);

  // Autosave with debounce
  const handleSave = (
    newTitle: string,
    newContent: string,
    newCategory: string,
  ) => {
    if (!note || note.is_archived) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(() => {
      onUpdateNote(note.id, {
        title: newTitle,
        content: newContent,
        category: newCategory,
      });
      setIsSaving(false);
    }, 500);
  };

  const handleManualSave = () => {
    if (!note || note.is_archived) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    onUpdateNote(note.id, { title, content, category });
    setTimeout(() => setIsSaving(false), 300);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    handleSave(value, content, category);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    handleSave(title, value, category);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    handleSave(title, content, value);
  };

  if (!note) {
    return (
      <EmptyState
        title="No note selected"
        description="Select a note from the list or create a new one to start writing."
        actionLabel="Go Back"
        onAction={onBack}
      />
    );
  }

  if (isTrashSection) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                This note is in trash
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRestoreNote(note.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPermanentlyDeleteNote(note.id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Forever
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-6 py-8 opacity-60">
          <h1 className="mb-4 text-3xl font-semibold text-foreground">
            {note.title || "Untitled"}
          </h1>
          <div className="whitespace-pre-wrap text-foreground/80">
            {note.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSave}
            disabled={isSaving}
            className="border-border/50 text-foreground/80 hover:bg-secondary hover:text-foreground"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Note"}
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(note.id)}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              note.is_favorite && "text-primary hover:text-primary",
            )}
          >
            <Star
              className={cn("h-4 w-4", note.is_favorite && "fill-current")}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteNote(note.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled"
            className="mb-4 w-full border-0 bg-transparent text-3xl font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />

          <div className="mb-6">
            <Label className="mb-2 block text-sm text-muted-foreground">
              Category
            </Label>
            <div className="max-w-xs">
              <CategoryCombobox
                categories={categories}
                value={category}
                onChange={handleCategoryChange}
              />
            </div>
          </div>

          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing..."
            className="min-h-[400px] w-full resize-none border-0 bg-transparent text-foreground/90 leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
