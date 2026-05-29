export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isDeleted: boolean;
}

export type NoteSection = "home" | "all" | "favorites" | "trash";
export type ViewMode = "list" | "editor" | "create" | "read";
