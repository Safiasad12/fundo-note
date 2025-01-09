import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";
import { createNote, getNoteById, getNotesByUserId, updateNoteById, deletePermanentlyById, toggleArchiveById, toggleTrashById, searchNotes } from "../services/note.service";


export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newNote = await createNote(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      message: "Note created successfully",
      data: newNote,
    });

  } catch (error) {
    console.error(`Cannot create note:`, error);
    next({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create note",
      error: (error as Error).message,
    });
  }
};

export const getNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = req.body.createdBy;

    const note = await getNoteById(noteId, userId);

    if (!note) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'Note not found',
      });
    }

    res.status(HttpStatus.OK).json(note);

  } catch (error) {
    console.error('Error retrieving note:', error);

    next({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error retrieving note',
      error: (error as Error).message,
    });
  }
};

export const getUserNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.createdBy;

    const page = req.query.page ? parseInt(req.query.page as string) : 1;
  
    const { data: notes } = await getNotesByUserId(userId, page);

    if(!notes){
      res.status(HttpStatus.NOT_FOUND).json({
        message : 'Note not found',
      });
    }

    res.status(HttpStatus.OK).json({ message:  notes });
  } catch (error) {
    console.error('Error retrieving notes:', error);

    next({
      code: HttpStatus.UNAUTHORIZED,
      message: 'Error retrieving notes',
      error: (error as Error).message,
    });
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    const userId = req.body.createdBy;
    const updateData = req.body;
    const temp = await updateNoteById(noteId, userId, updateData);
    console.log(temp);
   
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'Note updated',
      NoteId: noteId
    });
  } catch (error) {
    next({
      code: HttpStatus.NOT_FOUND,
      message: 'Error updating note',
      error: (error as Error).message,
    });
  }
};

export const deletePermanently = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    const userId = req.body.createdBy;


    await deletePermanentlyById(noteId, userId);

    console.log(userId);

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'Note permanently deleted',
      deletedNoteId: noteId
    });
  } catch (error) {
    next({
      code: HttpStatus.FORBIDDEN,
      message: 'Error updating note',
      error: (error as Error).message,
    });
  }
};

export const toggleArchive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    const userId = req.body.createdBy;

    const note = await toggleArchiveById(noteId, userId);
    if (note) {
      res.status(HttpStatus.OK).json({
        message: note.isArchive ? 'Note archived' : 'Note unarchived',
        archivedNote: note
      });
    }
  } catch (error) {
    console.error('Error toggling archive status:', error);
    next({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error toggling archive status',
      error: (error as Error).message
    });
  }
};

export const toggleTrash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    const userId = req.body.createdBy;
    const note = await toggleTrashById(noteId, userId);
    if (note) {
      res.status(HttpStatus.OK).json({
        message: note.isTrash ? 'Note moved to trash' : 'Note restored from trash',
        trashedNote: note
      });
    }
  } catch (error) {
    console.error('Error toggling trash status:', error);
    next({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error toggling trash status',
      error: (error as Error).message
    });
  }
};


export const search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title } = req.query; 
    if (!title) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Title query parameter is required.',
      });
      return;
    }

    const { status, notes, message } = await searchNotes(title as string, req.body.createdBy);

    if (status === HttpStatus.NOT_FOUND) {
      res.status(HttpStatus.NOT_FOUND).json({ message });
      return;
    }

    res.status(status).json({ notes });
  } catch (error) {
    next(error);
  }
};
