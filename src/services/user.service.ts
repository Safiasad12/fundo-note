import UserModel from '../models/user.model';

export const registerUser = async (userData: { username: string; email: string; password: string }): Promise<any> => {

  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user = new UserModel({ ...userData});
  await user.save();
  return user;
};


export const loginUser = async (credentials: { email: string; password: string }): Promise<any> => {

  const user = await UserModel.findOne({ email: credentials.email });
  if (!user) {
    throw new Error('Invalid email or password');
  }


  if(credentials.password===user.password) {
    return { message: 'logged in successfully!', user};
  } else {
  throw new Error('Invalid email or password');
  }

};