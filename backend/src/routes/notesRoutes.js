import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";
import { pusher } from "../utils/pusher.js";

const router = express.Router();

router.get("/", getAllNotes);

router.get("/:id", getNoteById);

router.post("/", async (req, res) => {
  try {
    const note = await createNote(req, res);
    if (note) {
      await pusher.trigger("notes-channel", "note-added", note);
    }
  } catch (error) {
    console.error("Error in POST /api/notes", error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const note = await updateNote(req, res);
    if (note) {
      await pusher.trigger("notes-channel", "note-updated", note);
    }
  } catch (error) {
    console.error("Error in PUT /api/notes/:id", error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedId = await deleteNote(req, res);
    if (deletedId) {
      await pusher.trigger("notes-channel", "note-deleted", { _id: deletedId });
    }
  } catch (error) {
    console.error("Error in DELETE /api/notes/:id", error);
  }
});

export default router;
