import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { extractBoardId } from "../lib/boardUtils";

const HomePage = () => {
  const [boardInput, setBoardInput] = useState("");
  const navigate = useNavigate();

  const createNewBoard = async () => {
    try {
      const res = await api.post("/boards");
      const newBoardId = res.data._id;
      toast.success("New board created!");
      navigate(`/board/${newBoardId}`);
    } catch (error) {
      toast.error("Failed to create new board");
      console.error(error);
    }
  };

  const joinBoard = (e) => {
    e.preventDefault();

    try {
      const boardIdFromUrl = extractBoardId(boardInput);

      if (!boardIdFromUrl.match(/^[a-f0-9]{24}$/)) {
        toast.error("Invalid board ID");
        return;
      }

      navigate(`/board/${boardIdFromUrl}`);
    } catch (err) {
      toast.error(err.message || "Invalid input");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar />
      <div className="max-w-md mx-auto p-6 mt-20 text-center border rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Notes App</h1>
        <button
          onClick={createNewBoard}
          className="btn btn-primary mb-6 w-full"
        >
          Create New Board
        </button>
        <form onSubmit={joinBoard}>
          <input
            type="text"
            placeholder="Enter board link or ID"
            value={boardInput}
            onChange={(e) => setBoardInput(e.target.value)}
            className="input input-bordered w-full mb-4"
            aria-label="Board ID or link input"
          />
          <button type="submit" className="btn btn-secondary w-full">
            Join Board
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
