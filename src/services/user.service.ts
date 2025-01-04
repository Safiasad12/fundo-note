import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import { sendEmail } from '../utils/user.util'
import { generateJwt, verifyJwt } from '../utils/jwtUtils';
import { ObjectId } from 'mongoose';

export const userRegister = async (userData: { username: string; email: string; password: string }): Promise<any> => {

  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already in use');
  }


  const hashedPassword = await bcrypt.hash(userData.password, 10);


  const user = new UserModel({ ...userData, password: hashedPassword });
  await user.save();
  return user;
};


export const userLogin = async (credentials: { email: string; password: string }): Promise<any> => {
  const user = await UserModel.findOne({ email: credentials.email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateJwt(user._id as ObjectId, user.email, `${process.env.JWT_SECRET_TOKEN}`, '1d');
  const refreshtoken = generateJwt(user._id as ObjectId, user.email, `${process.env.JWT_REFRESH_SECRET_TOKEN}`, '30d');
  
  await UserModel.updateOne({ _id: user._id }, { refreshToken: refreshtoken });

  return { message: 'Logged in successfully!', user, token, refreshtoken };
};


export const userRefreshToken = async (credentials: { refreshtoken: string }): Promise<any> => {
  if (!credentials.refreshtoken) {
    throw new Error('refreshtoken required');
  }

  try {
    const decoded: any = verifyJwt(
      credentials.refreshtoken,
      `${process.env.JWT_REFRESH_SECRET_TOKEN}`
    )

    const user = await UserModel.findOne({
      _id: decoded.userId,
      refreshToken: credentials.refreshtoken,
    });

    if (!user) {
      throw new Error('refreshtoken not found in database');
    }

    const newToken = generateJwt(user._id as ObjectId, user.email, `${process.env.JWT_SECRET_TOKEN}`, '1d');

    return newToken;
  } catch (error) {
    throw error;
  }
};


export const userForgotPassword = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Email not found');


    const token = generateJwt(user._id as ObjectId, user.email, `${ process.env.JWT_SECRET_TOKEN}`, '1d');
    await sendEmail(email, token);
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
};



export async function userResetPassword(body: any, userId: string): Promise<void> {
  console.log(userId);
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  try {
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  } catch (error) {
    console.error('Error resetting password:', error);
    throw new Error('An error occurred while resetting the password.');
  }
}