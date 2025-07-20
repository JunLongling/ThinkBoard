import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    const { boardId } = req.query;
    if (!boardId) throw new Error("boardId is required");

    const notes = await Note.find({ boardId }).sort({ createdAt: -1 });
    return notes; // return, don't send res here
  } catch (error) {
    console.error("Error in getAllNotes", error);
    throw error;
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, boardId } = req.body;
    if (!boardId) throw new Error("boardId is required");

    const note = new Note({ title, content, boardId });
    const savedNote = await note.save();
    return savedNote; // return the created note
  } catch (error) {
    console.error("Error in createNote", error);
    throw error;
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content, boardId } = req.body;
    if (!boardId) throw new Error("boardId is required");

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, boardId },
      { title, content },
      { new: true }
    );
    if (!updatedNote) throw new Error("Note not found");

    return updatedNote; // return updated note
  } catch (error) {
    console.error("Error in updateNote", error);
    throw error;
  }
}

export async function deleteNote(req, res) {
  try {
    const { boardId } = req.body;
    if (!boardId) throw new Error("boardId is required");

    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, boardId });
    if (!deletedNote) throw new Error("Note not found");

    return deletedNote._id; // return deleted note id
  } catch (error) {
    console.error("Error in deleteNote", error);
    throw error;
  }
}

export async function getNoteById(req, res) {
  try {
    const { id } = req.params;
    const { boardId } = req.query;
    if (!boardId) throw new Error("boardId is required");

    const note = await Note.findOne({ _id: id, boardId });
    if (!note) throw new Error("Note not found");

    return note;
  } catch (error) {
    console.error("Error in getNoteById", error);
    throw error;
  }
}
