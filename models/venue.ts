import mongoose from 'mongoose';
import { type IVenue } from '../schema';

const venueSchema = new mongoose.Schema<IVenue>({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  additionalMetric: { type: Number },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  email: { type: String },
  ownerId: { type: String },
  images: [{ type: String }],
  featuredImage: { type: String }
}, {
  timestamps: true
});

export const Venue = mongoose.model<IVenue>('Venue', venueSchema);
