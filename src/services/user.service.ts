import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import jwt from 'jsonwebtoken';
import { log } from 'console';

export const registerUser = async (userData: { username: string; email: string; password: string }): Promise<any> => {

  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already in use');
  }


  const hashedPassword = await bcrypt.hash(userData.password, 10);


  const user = new UserModel({ ...userData, password: hashedPassword });
  await user.save();
  return user;
};


export const loginUser = async (credentials: { email: string; password: string }): Promise<any> => {

  const user = await UserModel.findOne({ email: credentials.email });
  if (!user) {
    throw new Error('Invalid email or password');
  }


  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    `${process.env.JWT_SECRET_TOKEN}`,
    { expiresIn: '1d' }
  );
  const refreshtoken = jwt.sign(
    { userId: user._id, email: user.email },
    `${process.env.JWT_REFRESH_SECRET_TOKEN}`,
    { expiresIn: '30d' }
  );
  await UserModel.updateOne(
    { _id: user._id },
    { refreshToken: refreshtoken });

  return { message: 'logged in successfully!', user, token, refreshtoken};

};

export const refreshToken = async (credentials: { refreshtoken: string }): Promise<any> => {
  if (!credentials.refreshtoken) {
    throw new Error('refreshtoken required');
  }

  const verifyToken = (token: string, secret: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) return reject(new Error('invalid refreshtoken'));
        resolve(decoded);
      });
    });
  };

  try {
    const decoded = (await verifyToken(
      credentials.refreshtoken,
      `${process.env.JWT_REFRESH_SECRET_TOKEN}`
    )) as { userId: string; email: string };

    const user = await UserModel.findOne({
      _id: decoded.userId,
      refreshToken: credentials.refreshtoken,
    });

    if (!user) {
      throw new Error('refreshtoken not found in database');
    }

    const newToken = jwt.sign(
      { userId: user._id, email: user.email },
      `${process.env.JWT_SECRET_TOKEN}`,
      { expiresIn: '1d' }
    );

    return newToken;
  } catch (error) {
    throw error;
  }
};
