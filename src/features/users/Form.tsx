import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, userSchema } from "./schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser, loginUser } from "./handlers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GetNotesProps } from "../notes/handlers";

const formSchema = userSchema.pick({
  name: true,
  content: true,
  category: true,
  published: true,
});

type Props = {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchNotes: (props: GetNotesProps) => void;
};

export default function UserForm({ user, setUser, fetchNotes }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? "Current User" : "Specify User"}</CardTitle>
      </CardHeader>
      <CardContent>
        {user ? (
          <div>
            <div className="flex items-center space-x-4">
              <Avatar className="rounded-full border border-stone-200">
                <AvatarImage src="public/tauri.svg" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium leading-none mb-2">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.userId}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant={"destructive"}
                onClick={async () => {
                  setUser(null);
                  fetchNotes({});
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <form>
            <Label className="block mb-4">
              <div className="mb-2">User</div>
              <Input type="text" {...form.register("name")} />
            </Label>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={"secondary"}
                onClick={async () => {
                  const { name } = form.getValues();

                  const response = await createUser(name);

                  if (!response.success) return;

                  fetchNotes({ user: response.data });
                  setUser(response.data);
                }}
              >
                Create
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  const { name } = form.getValues();

                  const response = await loginUser(name);

                  if (!response.success) return;

                  fetchNotes({ user: response.data });
                  setUser(response.data);
                }}
              >
                Login
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
