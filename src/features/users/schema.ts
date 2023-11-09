import { z } from "zod";

export const userSchema = z.object({
  userId: z.string(),
  name: z.string(),
});

export type User = z.infer<typeof userSchema>;
