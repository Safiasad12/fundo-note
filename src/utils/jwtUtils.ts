// utils/jwtUtils.ts
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export const generateJwt = (userId: ObjectId, email: string, secretKey: string, expiresIn: string = '1h'): string => {
  try {
    const token = jwt.sign({ userId, email }, secretKey, { expiresIn });
    return token;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`JWT generation failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred during JWT generation');
    }
  }
};

export const verifyJwt = (token: string, secretKey: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        if (error instanceof Error) {
          return reject(new Error(`Invalid token: ${error.message}`));
        } else {
          return reject(new Error('Invalid token: An unknown error occurred'));
        }
      }
      resolve(decoded);
    });
  });
};
