"use client";

import { ReactNode } from "react";
import { Note } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Edit,
  MoreHorizontal,
  Star,
  Trash2,
  RotateCcw,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotesGridProps {
  notes: Note[];
  title: string;
  emptyMessage: string;
  emptyAction?: ReactNode;
  isTrash?: boolean;
  isLoading?: boolean;
  headerAction?: ReactNode;
  onRead: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentlyDelete?: (id: string) => void;
}

export function NotesGrid({
  notes,
  title,
  emptyMessage,
  emptyAction,
  isTrash = false,
  isLoading,
  headerAction,
  onRead,
  onEdit,
  onToggleFavorite,
  onDelete,
  onRestore,
  onPermanentlyDelete,
}: NotesGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-border/50 bg-card p-5"
            >
              <div className="mb-3 h-5 w-3/4 rounded bg-muted" />
              <div className="mb-2 h-3 w-full rounded bg-muted/50" />
              <div className="h-3 w-2/3 rounded bg-muted/50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/30 py-16 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
          {emptyAction && <div className="mt-4">{emptyAction}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
          {headerAction}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isTrash={isTrash}
            onRead={onRead}
            onEdit={onEdit}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onRestore={onRestore}
            onPermanentlyDelete={onPermanentlyDelete}
          />
        ))}
      </div>
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  isTrash: boolean;
  onRead: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentlyDelete?: (id: string) => void;
}

function NoteCard({
  note,
  isTrash,
  onRead,
  onEdit,
  onToggleFavorite,
  onDelete,
  onRestore,
  onPermanentlyDelete,
}: NoteCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border border-border/50 bg-card p-5 transition-all duration-200 hover:border-border hover:shadow-lg hover:shadow-black/5",
        isTrash && "opacity-70",
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="line-clamp-1 text-base font-medium text-foreground">
            {note.title || "Untitled"}
          </h3>
          {note.category && (
            <Badge variant="secondary" className="mt-1.5 text-xs font-normal">
              {note.category}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {note.is_favorite && !isTrash && (
            <Star className="h-4 w-4 fill-primary text-primary" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {isTrash ? (
                <>
                  <DropdownMenuItem onClick={() => onRestore?.(note.id)}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restore
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onPermanentlyDelete?.(note.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Forever
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => onRead(note.id)}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(note.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleFavorite(note.id)}>
                    <Star
                      className={cn(
                        "mr-2 h-4 w-4",
                        note.is_favorite && "fill-current",
                      )}
                    />
                    {note.is_favorite ? "Remove Favorite" : "Add to Favorite"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(note.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Preview */}
      <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {note.content || "No content"}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground/70">
          {formatDate(note.updated_at)}
        </span>
        {!isTrash && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRead(note.id)}
              className="h-7 px-2 text-xs"
            >
              <BookOpen className="mr-1 h-3 w-3" />
              Read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note.id)}
              className="h-7 px-2 text-xs"
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </div>
        )}
      </div>
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
