import express from "express";
import userAuth from '../middlewares/auth.middleware';
import { create, getNote,getUserNotes,updateNote,deletePermanently,toggleArchive,toggleTrash } from '../controllers/note.controller'
import { validateNote, validateUpdateNote } from "../validation/note.validation";

const noteRouter = express.Router();

noteRouter.post('/', validateNote, userAuth, create);
noteRouter.get('/', userAuth, getUserNotes);
noteRouter.get('/:id', userAuth, getNote);
noteRouter.put('/:id', userAuth, validateUpdateNote, updateNote);
noteRouter.delete('/:id', userAuth, deletePermanently);
noteRouter.put('/archive/:id', userAuth, toggleArchive);
noteRouter.put('/trash/:id', userAuth, toggleTrash);

export default noteRouter;


