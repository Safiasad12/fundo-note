import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interface/user.interface';

const userSchema: Schema = new Schema(
  {
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: { type: String, require: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken:{type: String}
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
