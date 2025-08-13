import { Schema, model, Document, Types } from 'mongoose';
import { IUser, IVenue } from './schema';

// Mongoose Schemas
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const venueSchema = new Schema<IVenue>({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  additionalMetric: { type: Number },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  email: { type: String },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Models
export const User = model<IUser>('User', userSchema);
export const Venue = model<IVenue>('Venue', venueSchema);
