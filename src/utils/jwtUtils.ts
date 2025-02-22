import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export const  generateJwt = (userId: ObjectId, email: string, secretKey: string, expiresIn: string): string => {
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

export const verifyJwt = (token: string, secretKey: string) => {
    const data = jwt.verify(token, secretKey);
    return data;
}
