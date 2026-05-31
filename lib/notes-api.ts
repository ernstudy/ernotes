const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

type Note = {
  title: string;
  content: string;
  category: string;
};

type NoteToTrash = {
  deleted_at: Date;
  is_archived: boolean;
  updated_at: Date;
};

export const getNotes = async (token: string) => {
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

export const createNewNote = async (token: string, note: Note) => {
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

export const moveNoteToTrashApi = async (
  token: string,
  noteToTrash: NoteToTrash,
  noteId: string,
) => {
  const response = await fetch(`${apiBaseUrl}/notes/${noteId}/trash`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(noteToTrash),
  });

  if (!response.ok) {
    throw new Error("Failed to create Note");
  }

  const data = await response.json();

  return data;
};
