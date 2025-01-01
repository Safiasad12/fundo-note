import { Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  description: string;
  createdBy:string;
}