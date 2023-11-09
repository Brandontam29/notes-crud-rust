import { useCallback, useEffect, useState } from "react";

import NotesForm from "@/features/notes/Form";
import { GetNotesProps, getNotes } from "@/features/notes/handlers";
import { Note } from "@/features/notes/schema";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import NotesTable from "@/features/notes/NotesTable";
import UserForm from "@/features/users/Form";
import { User } from "@/features/users/schema";

const HomePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const fetchNotes = useCallback(async (props: GetNotesProps) => {
    const response = await getNotes(props);

    if (!response.success) {
      toast({
        title: "Sorry, there was an error getting notes.",
        description: "Please try to refresh.",
      });
      return;
    }

    setNotes(response.data);
  }, []);

  useEffect(() => {
    fetchNotes({});
  }, []);

  return (
    <>
      <div className="container py-4 md:py-8 grid grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-4 md:space-y-8">
          <NotesForm user={user} fetchNotes={fetchNotes} />

          <UserForm user={user} setUser={setUser} fetchNotes={fetchNotes} />
        </div>

        <div>
          <NotesTable notes={notes} fetchNotes={fetchNotes} user={user} />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default HomePage;
