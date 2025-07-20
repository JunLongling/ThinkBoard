import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const socket = io(import.meta.env.VITE_API_BASE_URL);

function useNotesSocket() {
  const [notes, setNotes] = useState([]);
  const socketRef = useRef(socket);

  useEffect(() => {
    const socket = socketRef.current;

    const handleNoteAdded = (newNote) => {
      setNotes((prevNotes) => [newNote, ...prevNotes]);
    };

    const handleNoteUpdated = (updatedNote) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note))
      );
    };

    const handleNoteDeleted = (deletedId) => {
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== deletedId));
    };

    socket.on("noteAdded", handleNoteAdded);
    socket.on("noteUpdated", handleNoteUpdated);
    socket.on("noteDeleted", handleNoteDeleted);

    return () => {
      socket.off("noteAdded", handleNoteAdded);
      socket.off("noteUpdated", handleNoteUpdated);
      socket.off("noteDeleted", handleNoteDeleted);
    };
  }, []);

  return [notes, setNotes];
}

const HomePage = () => {
  const [notes, setNotes] = useNotesSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log("API response data:", res.data);

        if (Array.isArray(res.data)) {
          setNotes(res.data);
        } else if (res.data && Array.isArray(res.data.notes)) {
          setNotes(res.data.notes);
        } else {
          console.warn("Unexpected notes data shape:", res.data);
          setNotes([]);
        }
      } catch (error) {
        console.error("Error fetching notes", error.response || error);
        toast.error("Failed to load notes");
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [setNotes]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}

        {!loading && (!Array.isArray(notes) || notes.length === 0) && <NotesNotFound />}

        {Array.isArray(notes) && notes.length > 0 && (
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
