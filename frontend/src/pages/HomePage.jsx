import { useNotes } from "../context/NotesContext";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const { notes, setNotes, loading } = useNotes();

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}

        {!loading && notes.length === 0 && <NotesNotFound />}

        {notes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
