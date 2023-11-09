import { Card, CardContent } from "@/components/ui/card";
import { Note } from "./schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GetNotesProps, deleteNote } from "./handlers";
import { User } from "../users/schema";

type Props = {
  user: User | null;
  fetchNotes: (props: GetNotesProps) => void;
  notes: Note[];
};

const NotesTable = ({ user, notes, fetchNotes }: Props) => {
  return (
    <Card className="p-4">
      {/* <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader> */}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.noteId}>
                <TableCell className="font-medium">{note.title}</TableCell>
                <TableCell>{note.category}</TableCell>
                <TableCell>{JSON.stringify(note.published)}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      await deleteNote(note.noteId);
                      fetchNotes({ user });
                    }}
                  >
                    Delete
                  </Button>
                  <Button size="sm" variant="secondary">
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NotesTable;
