import { invoke } from "@tauri-apps/api/tauri";
import { Note, noteSchema } from "./schema";
import { z } from "zod";
import { User } from "../users/schema";

export const createNote = async (
  note: Pick<Note, "title" | "content" | "category" | "published"> &
    Pick<User, "name">
) => {
  const response = await invoke("create_note", { note });

  return response;
};

export const updateNote = async (
  note: Pick<Note, "noteId" | "title" | "content" | "category" | "published"> &
    Pick<User, "name">
) => {
  return invoke("update_note", { note });
};

export type GetNotesProps = {
  user?: User | null;
};
export const getNotes = async ({ user }: GetNotesProps) => {
  const response = user
    ? await invoke("get_user_notes", { userId: user.userId })
    : await invoke("get_all_notes");
  const parseResponse = z.array(noteSchema).safeParse(response);

  return parseResponse;
};

export const deleteNote = async (id: string) => {
  return invoke("delete_note", { id });
};
