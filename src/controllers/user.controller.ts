import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, refreshToken } from '../services/user.service';


export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: `${user.username} registered successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await loginUser(req.body);
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
    const data = await refreshToken(req.body);
    res.status(200).json({
      newToken : data
    });
  } catch (error) {
    next(error);
  }
};
