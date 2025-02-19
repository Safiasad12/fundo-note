import { INote } from '../interface/note.interface';
import Note from '../models/note.model';
import HttpStatus from "http-status-codes";
import redisClient from '../config/redis.config';


export const createNote = async (body: INote): Promise<INote> => {
  try {
    const newNote = await Note.create(body);

    await redisClient.del(`notes:${body.createdBy}`);
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
    await redisClient.setEx(`notes:${userId}`, 60, JSON.stringify(note));
    return note;
  } catch (error) {
    console.error('Error in getNoteById:', error);
    throw error;
  }
};

export const getNotesByUserId = async (userId: string, page: number): Promise<{data: INote[]} | {data: null}> => {
  try {
    const perPage = 1000;
    const totalNotes = await Note.countDocuments({createdBy:userId});
    const totalPages = Math.ceil(totalNotes/perPage);
    if(page>totalPages){
      return {data: null};
    }

    const notes= await Note.find({createdBy: userId})
    .skip((page-1)*perPage)
    .limit(perPage)
    .exec();

    await redisClient.setEx(`notes:${userId}`, 60, JSON.stringify(notes));
  
    return {data: notes};
    
  } catch (error) {
    throw error;
  }
};

export const updateNoteById = async (noteId: string, userId: any, updatedData: any): Promise<INote | null> => {
  try {
    
    updatedData.title = updatedData.newTitle;
    updatedData.description = updatedData.newDescription;
    updatedData.color = updatedData.color;
    const note = await Note.findOneAndUpdate(
      { _id: noteId, createdBy: userId, isTrash: false },
      { $set: updatedData },
      { new: true }
    );

    if (!note) {
      throw new Error('Note not found or unauthorized');
    }

    await redisClient.del(`notes:${userId}`);

    console.log(note)

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

    await redisClient.del(`notes:${userId}`);
    
    return true;
    
  } catch (error) {
    throw error;
  }
};

export const toggleArchiveById = async (noteId: string, userId: any): Promise<INote | null> => {
  try {
    const note = await Note.findOne({$and: [{ _id: noteId }, { createdBy: userId }, { isTrash: false }]}); 
    
    if (!note) {
      throw new Error('Note not found or user not authorized'); 
    }
    
    note.isArchive = !note.isArchive; 
    await note.save();

    await redisClient.del(`notes:${userId}`);

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

    await redisClient.del(`notes:${userId}`);

    return note;
  } catch (error) {
    console.error('Error in toggleTrash:', error);
    throw error;
  }
};


export const searchNotes = async (title: string, userId: string) => {
  try {
    const searchQuery = { 
      title: { $regex: title, $options: 'i' }, 
      createdBy: userId 
    };

    const notes = await Note.find(searchQuery);

    if (notes.length === 0) {
      return { status: HttpStatus.NOT_FOUND, message: 'No notes found matching the search criteria.' };
    }

    return { status: HttpStatus.OK, notes };
  } catch (error) {
    throw { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error searching notes.' };
  }
};


export const changeColorService = async (noteId: string, userId: any, color: string) =>{
  try{
    const note = await Note.findOne({_id: noteId})
    if (!note) {
      throw new Error('Note not found');
    }
    note.color = color;

    await note.save();
    console.log(userId);
    await redisClient.del(`notes:${userId}`);
    
    
    return note;
  }
  catch(err){
    console.log("Error in change color service", err);
  }
}