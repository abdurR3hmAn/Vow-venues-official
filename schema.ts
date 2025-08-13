import { z } from "zod";

// Interfaces for TypeScript
export interface IUser {
  _id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface IVenue {
  _id: string;
  name: string;
  capacity: number;
  additionalMetric?: number;
  phone: string;
  address: string;
  price: number;
  email?: string;
  ownerId?: string;
  images?: string[];
  featuredImage?: string;
  createdAt: Date;
}

// Zod Validation Schemas
export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address")
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
  email: z.string().email().optional(),
  images: z.array(z.string().url()).optional(),
  featuredImage: z.string().url().optional()
});



// Types for client-side use
export type User = IUser;
export type Venue = IVenue;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
