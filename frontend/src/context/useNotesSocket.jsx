import { useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

export const useNotesSocket = () => {
  const socket = useSocket();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
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

    return () => {
      socket.off("noteAdded", handleNoteAdded);
      socket.off("noteUpdated", handleNoteUpdated);
      socket.off("noteDeleted", handleNoteDeleted);
    };
  }, [socket]);

  return [notes, setNotes];
};
