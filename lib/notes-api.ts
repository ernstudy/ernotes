const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

import type { Note } from "@/lib/types";

export const getNotesApi = async (token: string) => {
  const response = await fetch(`${apiBaseUrl}/notes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get notes");
  }

  return response.json();
};

export const createNewNoteApi = async (token: string, note: Partial<Note>) => {
  const response = await fetch(`${apiBaseUrl}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to create Note");
  }

  const data = await response.json();

  return data;
};

export const moveNoteToTrashApi = async (token: string, noteId: string) => {
  const response = await fetch(`${apiBaseUrl}/notes/${noteId}/trash`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create Note");
  }

  const data = await response.json();

  return data;
};

export const removeFromTrashApi = async (token: string, noteId: string) => {
  const response = await fetch(`${apiBaseUrl}/notes/${noteId}/untrash`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove note from trash");
  }

  const data = await response.json();

  return data;
};

export const deleteNotePermenantlyApi = async (
  token: string,
  noteId: string,
) => {
  const response = await fetch(`${apiBaseUrl}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete note permenantly");
  }

  return response.json();
};

export const updateNoteApi = async (
  token: string,
  note: Partial<Note>,
  noteId: string,
) => {
  const response = await fetch(`${apiBaseUrl}/notes/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to update Note");
  }

  const data = await response.json();

  return data;
};

export const addNoteToFavoritesApi = async (token: string, noteId: string) => {
  const response = await fetch(`${apiBaseUrl}/notes/${noteId}/favorite`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to add note to favorites");
  }

  const data = await response.json();

  return data;
};

export const removeNoteFromFavoritesApi = async (
  token: string,
  noteId: string,
) => {
  const response = await fetch(`${apiBaseUrl}/notes/${noteId}/unfavorite`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove note from favorites");
  }

  const data = await response.json();

  return data;
};
