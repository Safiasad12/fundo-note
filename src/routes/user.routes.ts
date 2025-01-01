import { Router } from 'express';
import { register, login, refreshtoken } from '../controllers/user.controller';
import { validateRegister, validateLogin } from '../validation/user.validation'; 

const userRouter = Router();

userRouter.post('/register', validateRegister, register);

userRouter.post('/login', validateLogin, login);

userRouter.post('/refreshtoken', refreshtoken);

export default userRouter;  