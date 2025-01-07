import { INote } from '../interface/note.interface';
import Note from '../models/note.model';
import HttpStatus from "http-status-codes";


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
    if (!note || Object.keys(note).length===0) {
      return null;
    }
    return note;
  } catch (error) {
    console.error('Error in getNoteById:', error);
    throw error;
  }
};

export const getNotesByUserId = async (userId: string, page: number): Promise<{data: INote[]} | {data: null}> => {
  try {
    const perPage = 10;
    const totalNotes = await Note.countDocuments({createdBy:userId});
    const totalPages = Math.ceil(totalNotes/perPage);
    if(page>totalPages){
      return {data: null};
    }

    const notes= await Note.find({createdBy: userId})
    .skip((page-1)*perPage)
    .limit(perPage)
    .exec();

    
   

    // console.log(notes);
 

    // const notes = await Note.find({ createdBy: userId });
    // if (!notes || notes.length === 0) {
    //   throw new Error('No notes found for this user');
    // }

   
  
    return {data: notes};
    
  } catch (error) {
    throw error;
  }
};

export const updateNoteById = async (noteId: string, userId: any, updatedData: any): Promise<INote | null> => {
  try {
    
    updatedData.title = updatedData.newTitle;
    updatedData.description = updatedData.newDescription;
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
    const note = await Note.findOne({ _id: noteId, createdBy: userId, isTrash: true});

    if (!note) {
      throw new Error('Note not found or not authorized');
    }

    await Note.findByIdAndDelete(noteId);
    
    return true;
  } catch (error) {
    throw error;
  }
};

export const toggleArchiveById = async (noteId: string, userId: any): Promise<INote | null> => {
  try {
    const note = await Note.findOne({ _id: noteId , createdBy: userId }); 
    
    if (!note) {
      throw new Error('Note not found or user not authorized'); 
    }
    
    note.isArchive = !note.isArchive; 
    await note.save();
    return note;
  } catch (error) {
    console.error('Error in toggleArchive:', error); 
    throw error;
  }
};

export const toggleTrashById = async (noteId: string, userId: any): Promise<INote | null> => {
  try {
    const note = await Note.findOne({_id: noteId, createdBy: userId });
    if (!note) {
      throw new Error('Note not found or user not authorized');
    }
    note.isTrash = !note.isTrash;
    if (note.isTrash) {
      note.isArchive = false;
    }
    await note.save(); 
    return note;
  } catch (error) {
    console.error('Error in toggleTrash:', error);
    throw error;
  }
};


export const searchNotesService = async (title: string, userId: string) => {
  try {
    const searchQuery = { 
      title: { $regex: title, $options: 'i' }, 
      createdBy: userId 
    };

    // Search notes by title and userId
    const notes = await Note.find(searchQuery);

    if (notes.length === 0) {
      return { status: HttpStatus.NOT_FOUND, message: 'No notes found matching the search criteria.' };
    }

    return { status: HttpStatus.OK, notes };
  } catch (error) {
    throw { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error searching notes.' };
  }
};
