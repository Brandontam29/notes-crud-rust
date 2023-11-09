import { invoke } from "@tauri-apps/api/tauri";
import { userSchema } from "./schema";

export const createUser = async (name: string) => {
  const response = await invoke("create_user", { name });

  const parseResponse = userSchema.safeParse(response);

  return parseResponse;
};

export const loginUser = async (name: string) => {
  const response = await invoke("login_user", { name });

  const parseResponse = userSchema.safeParse(response);
  return parseResponse;
};
