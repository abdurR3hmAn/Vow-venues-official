import nodemailer from 'nodemailer';

interface BookingData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  specialRequirements?: string;
}

interface VenueData {
  name: string;
  email?: string;
  phone: string;
  address: string;
  price: number;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail', // You can change this to other email services
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });
  }

  // Send booking notification to venue owner
  async sendBookingNotification(venueData: VenueData, bookingData: BookingData, bookingId: string) {
    if (!venueData.email) {
      console.log(`No email address found for venue: ${venueData.name}`);
      return;
    }

    const subject = `New Booking Request - ${venueData.name}`;
    const html = this.generateVenueOwnerEmailTemplate(venueData, bookingData, bookingId);

    try {
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@vowvenues.com',
        to: venueData.email,
        subject: subject,
        html: html
      });

      console.log(`Booking notification sent to ${venueData.email} for venue ${venueData.name}`);
      return result;
    } catch (error) {
      console.error(`Failed to send booking notification to ${venueData.email}:`, error);
      throw error;
    }
  }

  // Send booking confirmation to customer
  async sendBookingConfirmation(venueData: VenueData, bookingData: BookingData, bookingId: string) {
    const subject = `Booking Confirmation - ${venueData.name}`;
    const html = this.generateCustomerEmailTemplate(venueData, bookingData, bookingId);

    try {
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@vowvenues.com',
        to: bookingData.customerEmail,
        subject: subject,
        html: html
      });

      console.log(`Booking confirmation sent to ${bookingData.customerEmail}`);
      return result;
    } catch (error) {
      console.error(`Failed to send booking confirmation to ${bookingData.customerEmail}:`, error);
      throw error;
    }
  }

  // Email template for venue owner
  private generateVenueOwnerEmailTemplate(venueData: VenueData, bookingData: BookingData, bookingId: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Booking Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #ea580c; }
          .value { color: #333; }
          .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          .booking-id { background: #ea580c; color: white; padding: 5px 10px; border-radius: 5px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Booking Request</h1>
            <p>You have received a new booking request for ${venueData.name}</p>
          </div>
          
          <div class="content">
            <div class="booking-details">
              <h2>Booking Details</h2>
              <p><strong>Booking ID:</strong> <span class="booking-id">${bookingId}</span></p>
              
              <div class="detail-row">
                <span class="label">Customer Name:</span>
                <span class="value">${bookingData.customerName}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${bookingData.customerEmail}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">${bookingData.customerPhone}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Event Date:</span>
                <span class="value">${new Date(bookingData.eventDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Number of Guests:</span>
                <span class="value">${bookingData.guestCount}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Event Type:</span>
                <span class="value">${bookingData.eventType.charAt(0).toUpperCase() + bookingData.eventType.slice(1)}</span>
              </div>
              
              ${bookingData.specialRequirements ? `
              <div class="detail-row">
                <span class="label">Special Requirements:</span>
                <span class="value">${bookingData.specialRequirements}</span>
              </div>
              ` : ''}
              
              <div class="detail-row">
                <span class="label">Venue Price:</span>
                <span class="value">Rs. ${venueData.price.toLocaleString()}</span>
              </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Contact the customer directly to confirm availability</li>
              <li>Discuss payment terms and advance booking amount</li>
              <li>Arrange a venue visit if needed</li>
              <li>Confirm the booking details</li>
            </ul>
            
            <p>Please respond to the customer as soon as possible to confirm or discuss the booking.</p>
          </div>
          
          <div class="footer">
            <p>This email was sent from Vow Venues booking platform</p>
            <p>For support, contact us at support@vowvenues.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Email template for customer
  private generateCustomerEmailTemplate(venueData: VenueData, bookingData: BookingData, bookingId: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #ea580c; }
          .value { color: #333; }
          .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          .booking-id { background: #ea580c; color: white; padding: 5px 10px; border-radius: 5px; font-family: monospace; }
          .venue-info { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Request Submitted</h1>
            <p>Thank you for choosing Vow Venues!</p>
          </div>
          
          <div class="content">
            <p>Dear ${bookingData.customerName},</p>
            
            <p>Your booking request has been successfully submitted. The venue owner will contact you shortly to confirm availability and discuss further details.</p>
            
            <div class="booking-details">
              <h2>Your Booking Details</h2>
              <p><strong>Booking ID:</strong> <span class="booking-id">${bookingId}</span></p>
              
              <div class="detail-row">
                <span class="label">Venue:</span>
                <span class="value">${venueData.name}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Event Date:</span>
                <span class="value">${new Date(bookingData.eventDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Number of Guests:</span>
                <span class="value">${bookingData.guestCount}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Event Type:</span>
                <span class="value">${bookingData.eventType.charAt(0).toUpperCase() + bookingData.eventType.slice(1)}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Venue Price:</span>
                <span class="value">Rs. ${venueData.price.toLocaleString()}</span>
              </div>
            </div>
            
            <div class="venue-info">
              <h3>Venue Contact Information</h3>
              <p><strong>Address:</strong> ${venueData.address}</p>
              <p><strong>Phone:</strong> ${venueData.phone}</p>
              ${venueData.email ? `<p><strong>Email:</strong> ${venueData.email}</p>` : ''}
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>The venue owner will contact you within 24 hours</li>
              <li>They will confirm availability for your requested date</li>
              <li>Payment terms and advance booking amount will be discussed</li>
              <li>You may arrange a venue visit if needed</li>
            </ul>
            
            <p>If you have any questions, please don't hesitate to contact us or the venue directly.</p>
          </div>
          
          <div class="footer">
            <p>Thank you for using Vow Venues!</p>
            <p>For support, contact us at support@vowvenues.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
