import express from "express";
import Note from "../models/Note.js";
import { pusher } from "../config/env.js";

const router = express.Router();

// GET all notes by boardId
router.get("/", async (req, res) => {
  const { boardId } = req.query;
  if (!boardId) return res.status(400).json({ message: "boardId required" });

  try {
    const notes = await Note.find({ boardId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create note
router.post("/", async (req, res) => {
  const { title, content, boardId } = req.body;
  if (!boardId) return res.status(400).json({ message: "boardId required" });

  try {
    const note = new Note({ title, content, boardId });
    const savedNote = await note.save();

    // Trigger Pusher event
    pusher.trigger(`presence-board-${boardId}`, "note-added", savedNote);

    res.status(201).json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update note
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, boardId } = req.body;
  if (!boardId) return res.status(400).json({ message: "boardId required" });

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, boardId },
      { title, content },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ message: "Note not found" });

    pusher.trigger(`presence-board-${boardId}`, "note-updated", updatedNote);

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE note
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { boardId } = req.body;
  if (!boardId) return res.status(400).json({ message: "boardId required" });

  try {
    const deletedNote = await Note.findOneAndDelete({ _id: id, boardId });

    if (!deletedNote) return res.status(404).json({ message: "Note not found" });

    pusher.trigger(`presence-board-${boardId}`, "note-deleted", { _id: id });

    res.status(200).json({ message: "Note deleted", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
