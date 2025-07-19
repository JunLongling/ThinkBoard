import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log("API response data:", res.data);

        // Defensive: ensure res.data is an array
        if (Array.isArray(res.data)) {
          setNotes(res.data);
        } else if (res.data && Array.isArray(res.data.notes)) {
          // In case your API sends { notes: [...] }
          setNotes(res.data.notes);
        } else {
          console.warn("Unexpected notes data shape:", res.data);
          setNotes([]); // fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching notes", error.response || error);
        toast.error("Failed to load notes");
        setNotes([]); // fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}

        {!loading && (!Array.isArray(notes) || notes.length === 0) && <NotesNotFound />}

        {Array.isArray(notes) && notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
