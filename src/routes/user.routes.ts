import { Router } from 'express';
import { register, login, refreshtoken, forgotPassword, resetPassword } from '../controllers/user.controller';
import { validateRegister, validateLogin } from '../validation/user.validation'; 
import userAuth from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter.post('/register', validateRegister, register);

userRouter.post('/login', validateLogin, login);

userRouter.post('/refreshtoken', refreshtoken);

userRouter.post('/forgot-password', forgotPassword);

userRouter.post('/reset-password', userAuth, resetPassword);

export default userRouter;  