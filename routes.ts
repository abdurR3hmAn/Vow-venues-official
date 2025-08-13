import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import mongoose from "mongoose";
import { type IVenue } from "./schema";

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
      // In a real application, you would fetch reviews from database
      // For now, returning mock data
      const mockReviews = [
        {
          id: '1',
          name: 'Sarah Ahmed',
          email: 'sarah@example.com',
          rating: 5,
          subject: 'Amazing venue selection and service!',
          message: 'I found the perfect wedding hall through Vow Venues. The booking process was smooth and the staff was very helpful. Elite Royale Wedding Palace exceeded our expectations.',
          feedbackType: 'venue',
          venueExperience: 'Elite Royale Wedding Palace - Outstanding service, beautiful decoration, excellent food quality',
          wouldRecommend: true,
          date: '2024-01-15',
          verified: true
        },
        {
          id: '2',
          name: 'Ahmed Khan',
          email: 'ahmed@example.com',
          rating: 4,
          subject: 'Great platform with good variety',
          message: 'Vow Venues has a good selection of halls in Peshawar. The filtering system made it easy to find venues within our budget.',
          feedbackType: 'general',
          wouldRecommend: true,
          date: '2024-01-20',
          verified: true
        }
      ];

      res.json(mockReviews);
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
