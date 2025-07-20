import React, { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { getAnonymousUserId } from "../lib/anonymousUserId";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [boardId, setBoardId] = useState(null);

  const userId = getAnonymousUserId();

  useEffect(() => {
    if (!boardId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await api.get("/notes", { params: { boardId } });
        setNotes(res.data);
      } catch (error) {
        toast.error("Failed to load notes");
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [boardId]);

  useEffect(() => {
    if (!boardId) return;

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true,
      disableStats: true,
      authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/pusher/auth`,
      auth: {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          user_id: userId,
        },
      },
      authorizer: (channel, options) => ({
        authorize: (socketId, callback) => {
          const payload = {
            socket_id: socketId,
            channel_name: channel.name,
            user_id: userId,
          };

          console.log("🔒 Sending auth payload:", payload);

          fetch(`${import.meta.env.VITE_API_BASE_URL}/pusher/auth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
            .then((res) => {
              if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
              return res.json();
            })
            .then((data) => callback(null, data))
            .catch((err) => {
              console.error("❌ Pusher auth error:", err);
              callback(err);
            });
        },
      }),
      logToConsole: true,
    });

    const channel = pusher.subscribe(`presence-board-${boardId}`);

    channel.bind("note-added", (note) => {
      setNotes((prev) => [note, ...prev]);
    });

    channel.bind("note-updated", (note) => {
      setNotes((prev) => prev.map((n) => (n._id === note._id ? note : n)));
    });

    channel.bind("note-deleted", ({ _id }) => {
      setNotes((prev) => prev.filter((n) => n._id !== _id));
    });

    channel.bind("pusher:member_added", (member) => {
      console.log("✅ Member joined:", member.id);
    });

    channel.bind("pusher:member_removed", (member) => {
      console.log("⛔ Member left:", member.id);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [boardId, userId]);

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, loading, boardId, setBoardId }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
