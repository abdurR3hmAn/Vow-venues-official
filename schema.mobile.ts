import { z } from "zod";

// Types for client-side use
export interface User {
  _id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Venue {
  _id: string;
  name: string;
  capacity: number;
  additionalMetric?: number;
  phone: string;
  address: string;
  price: number;
  email?: string;
  ownerId?: string;
  createdAt: Date;
}

export interface Booking {
  _id: string;
  venueId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

// Zod Validation Schemas
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
  email: z.string().email()
});

export const loginUserSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const insertVenueSchema = z.object({
  name: z.string(),
  capacity: z.number(),
  additionalMetric: z.number().optional(),
  phone: z.string(),
  address: z.string(),
  price: z.number(),
  email: z.string().email().optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export const createBookingSchema = z.object({
  venueId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  date: z.string(),
  guests: z.number(),
  notes: z.string().optional()
});

export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type CreateBooking = z.infer<typeof createBookingSchema>;
