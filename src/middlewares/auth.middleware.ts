import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let bearerToken = req.header('Authorization');
    if (!bearerToken) {
      throw {
        code: HttpStatus.BAD_REQUEST,
        message: 'Authorization token is required',
      };
    }
    bearerToken = bearerToken.split(' ')[1];

    const secret = process.env.JWT_SECRET_TOKEN as string;
    const decoded: any = jwt.verify(bearerToken, secret);

    req.body.createdBy = decoded.userId;
    next();
  } catch (err) {
      next(err);
  }
};

export default userAuthorization;
