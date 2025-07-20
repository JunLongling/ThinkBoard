import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";

const NoteModal = ({ boardId, noteToEdit, onClose, onSave }) => {
  // noteToEdit is null for create mode, or existing note object for edit mode
  const [title, setTitle] = useState(noteToEdit?.title || "");
  const [content, setContent] = useState(noteToEdit?.content || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [noteToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      let res;

      if (noteToEdit) {
        // Edit mode - update existing note
        res = await api.put(`/notes/${noteToEdit._id}`, {
          title,
          content,
          boardId,
        });
        toast.success("Note updated successfully!");
      } else {
        // Create mode - new note
        res = await api.post("/notes", { title, content, boardId });
        toast.success("Note created successfully!");
      }

      onSave(res.data); // pass saved note back to parent
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-xl shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {noteToEdit ? "Edit Note" : "Create New Note"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              placeholder="Note Title"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              placeholder="Write your note here..."
              className="textarea textarea-bordered h-32"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? noteToEdit
                  ? "Saving..."
                  : "Creating..."
                : noteToEdit
                ? "Save Changes"
                : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
