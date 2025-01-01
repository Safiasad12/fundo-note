import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const userAuthorization = (req: Request, res: Response, next: NextFunction): void=> {
  const authHeader = req.headers["token-key"];

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header is missing' });
  }
  let token = null;
  if(typeof authHeader === 'string'){
    token = authHeader.split(' ')[1]; 
  }
  if (!token) {
    res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(`${token}`, `${process.env.JWT_SECRET_TOKEN}`); 
    (req as any).body.user = decoded;
    next();
  } catch (err) {
      next(err);
  }
};

export default userAuthorization;
