import express from "express";
import userAuth from '../middlewares/auth.middleware';
import { create, getNote, getUserNotes, updateNote, deletePermanently, toggleArchive, toggleTrash, search, changeColor } from '../controllers/note.controller'
import { validateNote, validateUpdateNote } from "../validation/note.validation";
import { cacheNotesByUserId } from '../middlewares/redis.middleware';


const noteRouter = express.Router();



noteRouter.post('/', validateNote, userAuth, create);

noteRouter.get('/', userAuth, cacheNotesByUserId, getUserNotes);

noteRouter.get('/search', userAuth, search);

noteRouter.get('/:id', userAuth, cacheNotesByUserId, getNote);

noteRouter.put('/:id', userAuth, validateUpdateNote, updateNote);

noteRouter.delete('/:id', userAuth, deletePermanently);

noteRouter.put('/archive/:id', userAuth, toggleArchive);

noteRouter.put('/trash/:id', userAuth, toggleTrash);

noteRouter.put('/color/:id',userAuth , changeColor)


export default noteRouter;


