import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, boardId, onEdit, setNotes }) => {
  if (!boardId) {
    console.warn("NoteCard missing boardId!");
    return null;
  }

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${note._id}`, { data: { boardId } });
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div
      onClick={() => onEdit?.(note)}
      className="cursor-pointer card bg-base-100 border border-base-300 border-t-4 border-primary hover:shadow-lg transition-all duration-200"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost btn-xs"
              aria-label="Edit note"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(note);
              }}
            >
              <PenSquareIcon className="w-4 h-4" />
            </button>
            <button
              className="btn btn-ghost btn-xs text-error"
              aria-label="Delete note"
              onClick={handleDelete}
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
