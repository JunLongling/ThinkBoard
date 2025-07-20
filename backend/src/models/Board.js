import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);
export default Board;
