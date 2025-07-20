import React, { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch {
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true, 
      disableStats: true,
      // Enable logging for debugging:
      logToConsole: true,
    });

    const channel = pusher.subscribe("notes-channel");

    channel.bind("note-added", (note) => {
      setNotes((prev) => [note, ...prev]);
    });

    channel.bind("note-updated", (note) => {
      setNotes((prev) => prev.map((n) => (n._id === note._id ? note : n)));
    });

    channel.bind("note-deleted", ({ _id }) => {
      setNotes((prev) => prev.filter((n) => n._id !== _id));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return (
    <NotesContext.Provider value={{ notes, loading, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
