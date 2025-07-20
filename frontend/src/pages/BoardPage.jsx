import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import NoteModal from "../components/NoteModal";
import { useNotes } from "../context/NotesContext";

const BoardPage = () => {
  const { boardId } = useParams();
  const { notes, loading, setBoardId, setNotes } = useNotes();

  const [editingNote, setEditingNote] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);

  useEffect(() => {
    setBoardId(boardId);
  }, [boardId, setBoardId]);

  const handleSave = (savedNote) => {
    setNotes((prevNotes) => {
      const index = prevNotes.findIndex((n) => n._id === savedNote._id);
      if (index === -1) {
        return [savedNote, ...prevNotes];
      } else {
        const updated = [...prevNotes];
        updated[index] = savedNote;
        return updated;
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar onCreateNote={() => setCreatingNew(true)} />

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center py-10">Loading notes...</div>}

        {!loading && notes.length === 0 && (
          <NotesNotFound boardId={boardId} onCreateNote={() => setCreatingNew(true)} />
        )}

        {notes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                boardId={boardId}
                onEdit={(note) => setEditingNote(note)}
                setNotes={setNotes}
              />
            ))}
          </div>
        )}
      </div>

      {(editingNote || creatingNew) && (
        <NoteModal
          boardId={boardId}
          noteToEdit={editingNote}
          onClose={() => {
            setEditingNote(null);
            setCreatingNew(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default BoardPage;
