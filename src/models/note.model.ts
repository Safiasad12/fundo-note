import { Schema, model } from 'mongoose';
import { INote } from '../interface/note.interface';

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy:{type: String},
  isArchive:{type: Boolean, default: false},
  isTrash:{type: Boolean, default: false}
}, {
  timestamps: true,
});

const Note =  model<INote>('Note', NoteSchema);

export default Note;