import { NotebookIcon } from "lucide-react";

const NotesNotFound = ({ boardId, onCreateNote }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/10 rounded-full p-8" aria-hidden="true">
        <NotebookIcon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">No notes yet</h3>
      <p className="text-base-content/70">
        Ready to organize your thoughts? Create your first note to get started on your journey.
      </p>
      {boardId ? (
        onCreateNote ? (
          <button
            onClick={onCreateNote}
            className="btn btn-primary"
            data-testid="create-note-btn"
          >
            Create Your First Note
          </button>
        ) : (
          <a
            href={`/board/${boardId}/create`}
            className="btn btn-primary"
            data-testid="create-note-btn"
          >
            Create Your First Note
          </a>
        )
      ) : (
        <a href="/" className="btn btn-primary">
          Go to Home
        </a>
      )}
    </div>
  );
};

export default NotesNotFound;
