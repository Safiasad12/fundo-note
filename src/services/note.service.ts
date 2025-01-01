import { INote } from '../interface/note.interface';
import Note from '../models/note.model';

export const createNote = async (body: INote): Promise<INote> => {
  try {
    const newNote = await Note.create(body);
    return newNote;
  } catch (error) {
    throw new Error('Error creating note');
  }
};

export const getNoteById = async (noteId: string, userId: any): Promise<INote | null> => {
  try {
    const note = await Note.findOne({ _id: noteId , createdBy: userId });
    if (!note) {
      throw new Error('Note not found');
    }
    return note;
  } catch (error) {
    console.error('Error in getNoteById:', error);
    throw error;
  }
};

export const getNotesByUserId = async (userId: string): Promise<{ data: INote[], source: string }> => {
  try {
    const notes = await Note.find({ createdBy: userId });
    if (!notes || notes.length === 0) {
      throw new Error('No notes found for this user');
    }
    return { data: notes, source: 'Data retrieved from database' };
  } catch (error) {
    throw error;
  }
};

export const updateNoteById = async (noteId: string, userId: any, updatedData: any): Promise<INote | null> => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, createdBy: userId},
      { $set: updatedData },
      { new: true }
    );

    if (!note) {
      throw new Error('Note not found or unauthorized');
    }

    return note;
  } catch (error) {
    throw error;
  }
};

export const deletePermanentlyById = async (noteId: string, userId: any): Promise<boolean> => {
  try {
    const note = await Note.findOne({ _id: noteId, createdBy: userId});

    if (!note) {
      throw new Error('Note not found or not authorized');
    }

    await Note.findByIdAndDelete(noteId);

    return true;
  } catch (error) {
    throw error;
  }
};

