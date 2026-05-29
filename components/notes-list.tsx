"use client";

import { Note } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  isLoading?: boolean;
}

export function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  isLoading,
}: NotesListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-secondary/50 p-3"
          >
            <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">No notes found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onSelectNote(note.id)}
          className={cn(
            "group flex flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition-all duration-150",
            selectedNoteId === note.id
              ? "bg-primary/10"
              : "hover:bg-secondary"
          )}
        >
          <div className="flex w-full items-center justify-between gap-2">
            <span
              className={cn(
                "line-clamp-1 text-sm font-medium",
                selectedNoteId === note.id
                  ? "text-foreground"
                  : "text-foreground/90"
              )}
            >
              {note.title || "Untitled"}
            </span>
            {note.isFavorite && !note.isDeleted && (
              <Star className="h-3 w-3 shrink-0 fill-primary text-primary" />
            )}
          </div>
          <span className="line-clamp-1 text-xs text-muted-foreground">
            {formatDate(note.updatedAt)}
          </span>
        </button>
      ))}
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const noteDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - noteDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return noteDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
}
