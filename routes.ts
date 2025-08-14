import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import mongoose from "mongoose";
import { type IVenue } from "./schema";
import { Feedback } from "./models/feedback";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok",
      server: "running",
      mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
  });

  // Venue routes
  app.get("/api/venues", async (_req, res) => {
    try {
      const venues = await storage.getVenues();
      // Ensure all IDs are strings in response
      const venuesWithStringIds = venues.map(venue => ({
        ...venue,
        _id: venue._id.toString()
      }));
      res.json(venuesWithStringIds);
    } catch (error) {
      console.error('Error fetching venues:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      const venueId = req.params.id;
      
      // Try to fetch venue
      const venue = await storage.getVenueById(venueId);

      if (!venue) {
        console.log('Venue not found:', venueId);
        return res.status(404).json({ message: "Venue not found" });
      }

      // Ensure ID is a string in response
      const venueData = {
        ...venue,
        _id: typeof venue._id === 'object' ? venue._id.toString() : venue._id
      };

      res.json(venueData);
    } catch (error) {
      console.error('Error fetching venue:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reviews endpoint - get all feedback/reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      // Fetch real feedback from database
      const feedback = await Feedback.find()
        .sort({ createdAt: -1 }) // Most recent first
        .lean();

      // Transform to match frontend interface
      const reviews = feedback.map(item => ({
        id: item._id.toString(),
        name: item.name,
        email: item.email,
        rating: item.rating,
        subject: item.subject,
        message: item.message,
        feedbackType: item.feedbackType,
        venueExperience: item.venueExperience,
        wouldRecommend: item.wouldRecommend,
        date: item.date || item.createdAt,
        verified: item.verified || false
      }));

      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Feedback endpoint
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = req.body;

      // Log feedback data (in production, you'd save to database)
      console.log('Feedback received:', {
        timestamp: new Date().toISOString(),
        name: feedbackData.name,
        email: feedbackData.email,
        type: feedbackData.feedbackType,
        rating: feedbackData.rating,
        subject: feedbackData.subject,
        wouldRecommend: feedbackData.wouldRecommend
      });

      // In a real application, you would:
      // 1. Validate the feedback data
      // 2. Save to database
      // 3. Send confirmation email
      // 4. Trigger notifications to admin team

      res.json({
        success: true,
        message: "Feedback submitted successfully",
        id: `feedback_${Date.now()}`
      });
    } catch (error) {
      console.error('Error processing feedback:', error);
      res.status(500).json({
        success: false,
        message: "Failed to submit feedback"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
