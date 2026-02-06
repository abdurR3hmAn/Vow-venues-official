import mongoose from 'mongoose';
import { type IUser } from '../schema';

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);
