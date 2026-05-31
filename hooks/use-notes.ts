"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Note, NoteSection, ViewMode } from "@/lib/types";
import { mockNotes, mockCategories } from "@/lib/mock-data";
import { createNewNote, getNotes, moveNoteToTrashApi } from "@/lib/notes-api";
import { getAccessToken } from "@/helpers/acess-token";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<string[]>(mockCategories);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<NoteSection>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  type TrashNoteData = {
    deleted_at: Date;
    is_archived: boolean;
    updated_at: Date;
  };

  const renderNotes = async () => {
    const token = getAccessToken();
    const res = await getNotes(token);
    const allNotes = await res.notes;
    console.log(allNotes);

    setNotes(allNotes);
  };

  useEffect(() => {
    renderNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filter by section
    switch (currentSection) {
      case "favorites":
        filtered = filtered.filter(
          (note) => note.is_favorite && !note.is_archived,
        );
        break;
      case "trash":
        filtered = filtered.filter((note) => note.is_archived);
        break;
      default:
        filtered = filtered.filter((note) => !note.is_archived);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.category.toLowerCase().includes(query),
      );
    }

    // Sort by updatedAt (most recent first)
    return filtered.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  }, [notes, currentSection, searchQuery]);

  const recentNotes = useMemo(() => {
    return filteredNotes.slice(0, 10);
  }, [filteredNotes]);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) || null,
    [notes, selectedNoteId],
  );

  const createNote = async (data: {
    title: string;
    content: string;
    category: string;
  }) => {
    // const noteData = { title, content, category };
    const token = getAccessToken();

    const res = await createNewNote(token, data);
    console.log("note created", res);
    renderNotes();
  };

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, ...updates, updatedAt: new Date() }
            : note,
        ),
      );

      // Add new category if it doesn't exist
      if (updates.category && !categories.includes(updates.category)) {
        setCategories((prev) => [...prev, updates.category!]);
      }
    },
    [categories],
  );

  const deleteNote = async (noteId: string) => {
    const token = getAccessToken();

    const noteToTrash: TrashNoteData = {
      deleted_at: new Date(),
      is_archived: true,
      updated_at: new Date(),
    };
    const deletedNote = await moveNoteToTrashApi(token, noteToTrash, noteId);
    renderNotes();
  };

  const restoreNote = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isDeleted: false } : note,
      ),
    );
  }, []);

  const permanentlyDeleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
        setViewMode("list");
      }
    },
    [selectedNoteId],
  );

  const toggleFavorite = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.is_favorite } : note,
      ),
    );
  }, []);

  const selectNoteForEditing = useCallback((id: string) => {
    setSelectedNoteId(id);
    setViewMode("editor");
  }, []);

  const selectNoteForReading = useCallback((id: string) => {
    setSelectedNoteId(id);
    setViewMode("read");
  }, []);

  const showCreateForm = useCallback(() => {
    setViewMode("create");
    setSelectedNoteId(null);
  }, []);

  const showDashboard = useCallback(() => {
    setViewMode("list");
    setSelectedNoteId(null);
  }, []);

  return {
    notes: filteredNotes,
    recentNotes,
    categories,
    selectedNote,
    selectedNoteId,
    currentSection,
    viewMode,
    searchQuery,
    isLoading,
    setSelectedNoteId,
    setCurrentSection,
    setViewMode,
    setSearchQuery,
    setIsLoading,
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
  };
}
