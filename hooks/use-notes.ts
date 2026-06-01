"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Note, NoteSection, ViewMode } from "@/lib/types";
import { mockCategories } from "@/lib/mock-data";
import {
  addNoteToFavoritesApi,
  createNewNoteApi,
  deleteNotePermenantlyApi,
  getNotesApi,
  moveNoteToTrashApi,
  removeFromTrashApi,
  removeNoteFromFavoritesApi,
  updateNoteApi,
} from "@/lib/notes-api";
import { getAccessToken } from "@/helpers/acess-token";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<string[]>(mockCategories);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<NoteSection>("home");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = getAccessToken();
  const [updatedNoteForApi, setUpdatedNoteForApi] = useState<{
    title?: string;
    content?: string;
    category?: string;
  }>({});
  const [updatedNoteIdForApi, setUpdatedNoteIdForApi] = useState<string | null>(
    null,
  );

  const renderNotes = async () => {
    const res = await getNotesApi(token);
    const allNotes = await res.notes;

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

  // create new note
  const createNote = async (data: {
    title: string;
    content: string;
    category: string;
  }) => {
    const newNote = await createNewNoteApi(token, data);

    setNotes((preNotes) => [...preNotes, newNote]);
  };

  // Update note
  const updateNote = (noteId: string, data: Partial<Note>) => {
    // store updated note temporarily then save to api when going back to dashboard
    setUpdatedNoteForApi((prev) => ({ ...prev, ...data }));
    setUpdatedNoteIdForApi((prevId) => (prevId === null ? noteId : prevId));

    // update note in ui immediately for better user experience
    const tempNotes = notes.map((note) =>
      note.id === noteId ? { ...note, ...data, updated_at: new Date() } : note,
    );

    setNotes(tempNotes);
  };

  // save updated note to api when going back to dashboard
  const saveUpdatedNoteToApi = async () => {
    if (updatedNoteIdForApi == null) return;

    await updateNoteApi(token, updatedNoteForApi, updatedNoteIdForApi);

    setUpdatedNoteIdForApi(null);
    setUpdatedNoteForApi({});
  };

  // delete - move note to trash
  const deleteNote = async (noteId: string) => {
    await moveNoteToTrashApi(token, noteId);

    const tempNotes = notes.map((note) =>
      note.id === noteId
        ? { ...note, is_archived: true, updated_at: new Date() }
        : note,
    );

    setNotes(tempNotes);
  };

  // restore note - remove from trash
  const restoreNote = async (noteID: string) => {
    // don't returnn anything form the api
    await removeFromTrashApi(token, noteID);

    const tempNotes = notes.map((note) =>
      note.id === noteID ? { ...note, is_archived: false } : note,
    );

    setNotes(tempNotes);
  };

  // delete note permenantly
  const permanentlyDeleteNote = async (noteId: string) => {
    // don't return anything from the api
    await deleteNotePermenantlyApi(token, noteId);

    const tempNotes = notes.filter((note) => note.id !== noteId);

    setNotes(tempNotes);
  };

  // add to favorites and remove from favorites
  const toggleFavorite = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);

    if (!note) return;

    if (note.is_favorite) {
      // if its already a favorite, remove it from favorites
      await removeNoteFromFavoritesApi(token, noteId);
      const tempNotes = notes.map((n) =>
        n.id === noteId ? { ...n, is_favorite: false } : n,
      );

      setNotes(tempNotes);
    } else {
      await addNoteToFavoritesApi(token, noteId);

      const tempNotes = notes.map((n) =>
        n.id === noteId ? { ...n, is_favorite: true } : n,
      );

      setNotes(tempNotes);
    }
  };

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

  const showDashboard = useCallback(async () => {
    setViewMode("list");
    setSelectedNoteId(null);

    // save updated note to api when going back to dashboard
    await saveUpdatedNoteToApi();
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
