"use client";

import { Note } from "@/lib/types";
import { EmptyState } from "./empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteReaderProps {
  note: Note | null;
  onEdit: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function NoteReader({
  note,
  onEdit,
  onToggleFavorite,
  onDelete,
  onBack,
}: NoteReaderProps) {
  if (!note) {
    return (
      <EmptyState
        title="No note selected"
        description="Select a note from the list to read it."
        actionLabel="Go Back"
        onAction={onBack}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Reader toolbar */}
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
            onClick={() => onEdit(note.id)}
            className="border-border/50 text-foreground/80 hover:bg-secondary hover:text-foreground"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Note
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
            onClick={() => onDelete(note.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Reader content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-semibold text-foreground">
            {note.title || "Untitled"}
          </h1>

          {note.category && (
            <div className="mb-6">
              <Badge variant="secondary" className="text-sm font-normal">
                {note.category}
              </Badge>
            </div>
          )}

          <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
            {note.content || "No content"}
          </div>

          <div className="mt-8 pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Last updated: {formatDate(note.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
