import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const socket = useSocket();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wait for socket to be ready before fetching and subscribing
  useEffect(() => {
    if (!socket) return;

    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (error) {
        toast.error("Failed to load notes");
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();

    // Socket event handlers
    const handleNoteAdded = (newNote) => {
      setNotes((prev) => [newNote, ...prev]);
    };

    const handleNoteUpdated = (updatedNote) => {
      setNotes((prev) =>
        prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
      );
    };

    const handleNoteDeleted = (deletedId) => {
      setNotes((prev) => prev.filter((note) => note._id !== deletedId));
    };

    socket.on("noteAdded", handleNoteAdded);
    socket.on("noteUpdated", handleNoteUpdated);
    socket.on("noteDeleted", handleNoteDeleted);

    // Cleanup listeners on unmount or socket change
    return () => {
      socket.off("noteAdded", handleNoteAdded);
      socket.off("noteUpdated", handleNoteUpdated);
      socket.off("noteDeleted", handleNoteDeleted);
    };
  }, [socket]);

  // While socket not connected, show loading or nothing
  if (!socket) return <div>Connecting to server...</div>;

  return (
    <NotesContext.Provider value={{ notes, setNotes, loading }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within a NotesProvider");
  return context;
};
