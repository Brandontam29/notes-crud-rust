import { z } from "zod";

export const noteSchema = z.object({
  noteId: z.string(),
  authorId: z.string().nullable().optional(),
  title: z.string(),
  content: z.string(),
  category: z.string().optional(),
  published: z.boolean().optional(),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
});

export type Note = z.infer<typeof noteSchema>;
