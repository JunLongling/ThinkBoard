import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  SunIcon,
  MoonIcon,
  UserPlusIcon,
  Share2Icon,
  XIcon,
} from "lucide-react";
import { useNotes } from "../context/NotesContext";
import toast from "react-hot-toast";
import { extractBoardId } from "../lib/boardUtils";

const Navbar = ({ onCreateNote }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { boardId: paramBoardId } = useParams();
  const location = useLocation();
  const { boardId: contextBoardId } = useNotes();
  const navigate = useNavigate();

  const currentBoardId = paramBoardId || contextBoardId;

  const [showJoinOverlay, setShowJoinOverlay] = useState(false);
  const [joinInput, setJoinInput] = useState("");

  const showNewNoteButton =
    currentBoardId &&
    (location.pathname === `/board/${currentBoardId}` ||
      location.pathname === `/board/${currentBoardId}/create`);

  const showJoinBoardButton = location.pathname.startsWith("/board");

  const showShareBoardButton =
    currentBoardId && location.pathname === `/board/${currentBoardId}`;

  const handleShare = () => {
    const url = `${window.location.origin}/board/${currentBoardId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Board link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy board link"));
  };

  const handleJoinBoard = () => {
    try {
      const boardIdFromUrl = extractBoardId(joinInput);

      if (!boardIdFromUrl.match(/^[a-f0-9]{24}$/)) {
        toast.error("Invalid board ID");
        return;
      }

      navigate(`/board/${boardIdFromUrl}`);
      setShowJoinOverlay(false);
      setJoinInput("");
    } catch (err) {
      toast.error(err.message || "Invalid input");
    }
  };

  return (
    <header className="bg-base-100 px-4 sm:px-0 relative">
      <div className="mx-auto max-w-6xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/"
          className="text-3xl font-bold text-primary font-mono tracking-tight"
        >
          ThinkBoard
        </Link>

        <div className="flex items-center gap-4">
          {showJoinBoardButton && (
            <button
              onClick={() => setShowJoinOverlay(true)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <UserPlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Join Board</span>
            </button>
          )}

          {showShareBoardButton && (
            <button
              onClick={handleShare}
              className="btn btn-outline flex items-center gap-2"
              aria-label="Share Board Link"
            >
              <Share2Icon className="w-5 h-5" />
              <span className="hidden sm:inline">Share Board</span>
            </button>
          )}

          {showNewNoteButton && (
            <button
              onClick={() => {
                if (onCreateNote) {
                  onCreateNote();
                } else {
                  navigate(`/board/${currentBoardId}/create`);
                }
              }}
              className="btn btn-primary flex items-center gap-2"
              aria-label="Create new note"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">New Note</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="btn btn-outline btn-sm p-2"
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Join Board Overlay */}
      {showJoinOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-xl w-96 shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowJoinOverlay(false)}
              aria-label="Close join board overlay"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Join a Board</h2>
            <input
              type="text"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              placeholder="Enter board link or ID"
              className="input input-bordered w-full mb-4"
              aria-label="Board ID or link input"
            />
            <button
              onClick={handleJoinBoard}
              className="btn btn-primary w-full"
              aria-label="Join board button"
            >
              Join
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
