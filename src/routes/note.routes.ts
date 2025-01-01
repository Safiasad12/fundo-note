import express from "express";
import userAuth from '../middlewares/auth.middleware';
import { create, getNote,getUserNotes,updateNote,deletePermanently } from '../controllers/note.controller'
import { validateNote, validateUpdateNote } from "../validation/note.validation";

const noteRouter = express.Router();

noteRouter.post('/', validateNote, userAuth, create);
noteRouter.get('/', userAuth, getUserNotes);
noteRouter.get('/:id', userAuth, getNote);
noteRouter.put('/:id', userAuth, validateUpdateNote, updateNote);
noteRouter.delete('/:id', userAuth, deletePermanently);

export default noteRouter;


