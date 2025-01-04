import HttpStatus from 'http-status-codes';
import {verifyJwt} from '../utils/jwtUtils'
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

    // console.log(bearerToken)

    const secret = process.env.JWT_SECRET_TOKEN as string;
    const decoded: any = verifyJwt(bearerToken, secret);

    req.body.createdBy = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default userAuth;