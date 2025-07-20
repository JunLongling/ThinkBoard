import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";

export default function notesRoutes(io) {
  const router = express.Router();

  router.get("/", getAllNotes);
  router.get("/:id", getNoteById);

  router.post("/", async (req, res, next) => {
    try {
      const newNote = await createNote(req, res);
      if (newNote) io.emit("noteAdded", newNote);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const updatedNote = await updateNote(req, res);
      if (updatedNote) io.emit("noteUpdated", updatedNote);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const deletedId = await deleteNote(req, res);
      if (deletedId) io.emit("noteDeleted", deletedId);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
