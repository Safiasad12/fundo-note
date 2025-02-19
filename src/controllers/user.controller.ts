import { Request, Response, NextFunction } from 'express';
import { userRegister, userLogin, userRefreshToken, userForgotPassword, userResetPassword } from '../services/user.service';
import HttpStatus from "http-status-codes";


export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userRegister(req.body);
    res.status(201).json({
      message: `${user.firstname} ${user.lastname} registered successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await userLogin(req.body);
    res.status(200).json({
      message: `${data.user.username} ${data.message}`,
      token : data.token,
      refreshtoken: data.refreshtoken
    });
  } catch (error) {
    next(error);
  }
};

export const refreshtoken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await userRefreshToken(req.body);
    res.status(200).json({
      newToken : data
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try { 
    await userForgotPassword(req.body.email);
    res.status(HttpStatus.CREATED).json({
      code : HttpStatus.CREATED,
      message: "Reset password token sent to registered email id"
    });
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND).send({
      code: HttpStatus.NOT_FOUND,
      message : 'User not found'
    });
  }
};

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    await userResetPassword(req.body, req.body.createdBy);

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    res.status(HttpStatus.UNAUTHORIZED).send({
      code: HttpStatus.UNAUTHORIZED,
      message: error.message,
    });
  }
}






