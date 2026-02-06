import mongoose from 'mongoose';

export interface IBooking {
  _id: string;
  venueId: string;
  venueName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  specialRequirements?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>({
  venueId: { 
    type: String, 
    required: true,
    ref: 'Venue'
  },
  venueName: { 
    type: String, 
    required: true 
  },
  customerName: { 
    type: String, 
    required: true,
    trim: true
  },
  customerEmail: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  customerPhone: { 
    type: String, 
    required: true,
    trim: true
  },
  eventDate: { 
    type: String, 
    required: true 
  },
  guestCount: { 
    type: Number, 
    required: true,
    min: 1
  },
  eventType: { 
    type: String, 
    required: true,
    enum: ['wedding', 'engagement', 'birthday', 'corporate', 'other'],
    default: 'wedding'
  },
  specialRequirements: { 
    type: String,
    trim: true
  },
  totalAmount: { 
    type: Number, 
    required: true,
    min: 0
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ venueId: 1, eventDate: 1 });
bookingSchema.index({ customerEmail: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ eventDate: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
