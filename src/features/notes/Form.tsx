import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { noteSchema } from "./schema";
import { GetNotesProps, createNote } from "./handlers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { User } from "@/features/users/schema";

const formSchema = noteSchema.pick({
  title: true,
  content: true,
  category: true,
  published: true,
});

type Props = {
  user: User | null;
  fetchNotes: (props: GetNotesProps) => void;
};

export default function FormComponent({ user, fetchNotes }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Note</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <Label className="block mb-4">
            <div className="mb-2">Title</div>
            <Input type="text" {...form.register("title")} />
          </Label>

          <Label className="block mb-4">
            <div className="mb-2">Content</div>
            <Input type="text" {...form.register("content")} />
          </Label>

          <Label className="block mb-4">
            <div className="mb-2">Category</div>
            <Input type="text" {...form.register("category")} />
          </Label>

          <Label className="block mb-4">
            <div className="mb-2">Published</div>
            <Controller
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
              control={form.control}
              name="published"
              defaultValue={false}
            />
          </Label>

          <Button
            type="button"
            onClick={async () => {
              const { title, content, category, published } = form.getValues();

              if (!user)
                return toast({
                  title: "You are not signed in!",
                  description: "If you already have an account, please login.",
                });
              const response = await createNote({
                name: user.name,
                title,
                content,
                category,
                published,
              });

              if (response) {
                toast({ title: "Note was successfully created" });
              }

              fetchNotes({});
            }}
          >
            Create
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
