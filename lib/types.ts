export interface Note {
  id: string;
  user_id: string;

  title: string;
  content: string;
  category: string;
  is_favorite: boolean;
  is_archived: boolean;
  deleted_at: Date;

  created_at: Date;
  updated_at: Date;
}

export type NoteSection = "home" | "all" | "favorites" | "trash";
export type ViewMode = "list" | "editor" | "create" | "read";
