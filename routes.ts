import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import mongoose from "mongoose";
import { type IVenue } from "./schema";
import { Feedback } from "./models/feedback";
import { Booking } from "./models/booking";
import emailService from "./services/emailService";

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

      // Create new feedback record
      const feedback = new Feedback({
        name: feedbackData.name,
        email: feedbackData.email,
        phone: feedbackData.phone,
        feedbackType: feedbackData.feedbackType,
        rating: feedbackData.rating,
        subject: feedbackData.subject,
        message: feedbackData.message,
        venueExperience: feedbackData.venueExperience,
        wouldRecommend: feedbackData.wouldRecommend,
        verified: false // New feedback starts unverified
      });

      // Save to database
      const savedFeedback = await feedback.save();

      console.log('Feedback saved:', {
        id: savedFeedback._id,
        name: feedbackData.name,
        email: feedbackData.email,
        rating: feedbackData.rating,
        subject: feedbackData.subject
      });

      res.json({
        success: true,
        message: "Feedback submitted successfully",
        id: savedFeedback._id.toString()
      });
    } catch (error) {
      console.error('Error processing feedback:', error);
      res.status(500).json({
        success: false,
        message: "Failed to submit feedback"
      });
    }
  });

  // Booking submission endpoint
  app.post("/api/bookings", async (req, res) => {
    try {
      console.log('[Booking] New booking request:', req.body);

      const {
        venueId,
        customerName,
        customerEmail,
        customerPhone,
        eventDate,
        guestCount,
        eventType,
        specialRequirements
      } = req.body;

      // Validate required fields
      if (!venueId || !customerName || !customerEmail || !customerPhone || !eventDate || !guestCount) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided"
        });
      }

      // Get venue details
      const venue = await storage.getVenueById(venueId);
      if (!venue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found"
        });
      }

      // Check if guest count exceeds venue capacity
      if (guestCount > venue.capacity) {
        return res.status(400).json({
          success: false,
          message: `Guest count (${guestCount}) exceeds venue capacity (${venue.capacity})`
        });
      }

      // Check if event date is in the future
      const eventDateObj = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDateObj < today) {
        return res.status(400).json({
          success: false,
          message: "Event date must be in the future"
        });
      }

      // Create booking record
      const booking = new Booking({
        venueId: venue._id.toString(),
        venueName: venue.name,
        customerName,
        customerEmail,
        customerPhone,
        eventDate,
        guestCount,
        eventType: eventType || 'wedding',
        specialRequirements,
        totalAmount: venue.price,
        status: 'pending',
        paymentStatus: 'pending'
      });

      const savedBooking = await booking.save();
      const bookingId = savedBooking._id.toString();

      console.log('[Booking] Booking saved with ID:', bookingId);

      // Prepare data for email service
      const venueData = {
        name: venue.name,
        email: venue.email || venue.contactEmail,
        phone: venue.phone,
        address: venue.address,
        price: venue.price
      };

      const bookingData = {
        customerName,
        customerEmail,
        customerPhone,
        eventDate,
        guestCount,
        eventType: eventType || 'wedding',
        specialRequirements
      };

      // Send emails (non-blocking)
      const emailPromises = [];

      // Send notification to venue owner
      if (venueData.email) {
        console.log('[Booking] Sending notification to venue owner:', venueData.email);
        emailPromises.push(
          emailService.sendBookingNotification(venueData, bookingData, bookingId)
            .catch(error => console.error('[Booking] Failed to send venue notification:', error))
        );
      } else {
        console.log('[Booking] No email address found for venue:', venue.name);
      }

      // Send confirmation to customer
      console.log('[Booking] Sending confirmation to customer:', customerEmail);
      emailPromises.push(
        emailService.sendBookingConfirmation(venueData, bookingData, bookingId)
          .catch(error => console.error('[Booking] Failed to send customer confirmation:', error))
      );

      // Execute email sending in background (don't wait for completion)
      Promise.all(emailPromises).then(() => {
        console.log('[Booking] All emails sent successfully');
      }).catch((error) => {
        console.error('[Booking] Some emails failed to send:', error);
      });

      // Return success response immediately
      res.json({
        success: true,
        message: "Booking submitted successfully",
        bookingId: bookingId,
        booking: {
          id: bookingId,
          venueName: venue.name,
          customerName,
          eventDate,
          guestCount,
          totalAmount: venue.price,
          status: 'pending'
        }
      });

    } catch (error) {
      console.error('[Booking] Error processing booking:', error);
      res.status(500).json({
        success: false,
        message: "Failed to process booking. Please try again."
      });
    }
  });

  // Get bookings for a specific venue (for venue owners)
  app.get("/api/venues/:venueId/bookings", async (req, res) => {
    try {
      const { venueId } = req.params;
      const bookings = await Booking.find({ venueId }).sort({ createdAt: -1 });

      res.json({
        success: true,
        bookings
      });
    } catch (error) {
      console.error('[Booking] Error fetching venue bookings:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bookings"
      });
    }
  });

  // Get bookings for a specific customer
  app.get("/api/bookings/customer/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const bookings = await Booking.find({ customerEmail: email }).sort({ createdAt: -1 });

      res.json({
        success: true,
        bookings
      });
    } catch (error) {
      console.error('[Booking] Error fetching customer bookings:', error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bookings"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
