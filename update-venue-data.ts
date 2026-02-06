import { Venue } from './models/venue';
import mongoose from './db';

// Sample data for venue classifications and locations
const venueData = [
  { name: 'Elite Royale Wedding Palace', class: 'high', lat: 34.0151, lng: 71.5249, description: 'Luxurious wedding palace with premium amenities and royal ambiance.', amenities: ['Air Conditioning', 'VIP Parking', 'Catering Kitchen', 'Bridal Suite', 'Sound System', 'Lighting'], contactEmail: 'bookings@eliteroyale.pk' },
  { name: 'Majestic Elegance Banquet Hall', class: 'high', lat: 34.0089, lng: 71.5157, description: 'Elegant banquet hall featuring modern architecture and sophisticated interiors.', amenities: ['Central AC', 'Premium Parking', 'Professional Catering', 'Changing Rooms', 'Advanced AV System'], contactEmail: 'events@majesticelegance.pk' },
  { name: 'Premier Luxury Banquet Hall', class: 'high', lat: 34.0234, lng: 71.5312, description: 'Premier venue offering luxury amenities and exceptional service for memorable events.', amenities: ['Climate Control', 'Valet Parking', 'Gourmet Catering', 'Bridal Lounge', 'Stage & Backdrop'], contactEmail: 'info@premierluxury.pk' },
  { name: 'Pearl Continental Hotel Peshawar', class: 'high', lat: 34.0151, lng: 71.5249, description: 'Five-star hotel venue with world-class facilities and professional event management.', amenities: ['Hotel Rooms', 'Multiple Halls', 'International Cuisine', 'Business Center', 'Spa Services'], contactEmail: 'events@pc.gov.pk' },
  { name: 'Crown Regency Banquet Hall', class: 'middle', lat: 34.0089, lng: 71.5157, description: 'Modern banquet hall with executive-class amenities and professional service.', amenities: ['Air Conditioning', 'Parking', 'Catering Facility', 'Sound System', 'Decorations'], contactEmail: 'bookings@crownregency.pk' },
  { name: 'Royal Excellency Marquee', class: 'middle', lat: 34.0234, lng: 71.5312, description: 'Spacious marquee venue perfect for large celebrations and corporate events.', amenities: ['Tent Structure', 'Generator Backup', 'Catering Space', 'Guest Parking', 'Security'], contactEmail: 'events@royalexcellency.pk' },
  { name: 'Imperial Grand Banquet Hall', class: 'middle', lat: 34.0151, lng: 71.5249, description: 'Grand banquet hall with imperial design and comprehensive event services.', amenities: ['Grand Hall', 'AC', 'Kitchen Facility', 'Parking Area', 'Photography Area'], contactEmail: 'imperial@grand.pk' },
  { name: 'Regal Elite Banquet Hall', class: 'middle', lat: 34.0089, lng: 71.5157, description: 'Elite venue combining traditional elegance with modern conveniences.', amenities: ['Elegant Interior', 'Climate Control', 'Catering', 'Parking', 'Stage Setup'], contactEmail: 'info@regalelite.pk' },
  { name: 'Grand Imperial Marquee', class: 'middle', lat: 34.0234, lng: 71.5312, description: 'Imperial-style marquee offering flexibility and grandeur for special occasions.', amenities: ['Marquee Setup', 'Power Supply', 'Washrooms', 'Parking', 'Security Guard'], contactEmail: 'bookings@grandimperial.pk' },
  { name: 'Haleem Banquet', class: 'standard', lat: 34.0151, lng: 71.5249, description: 'Traditional banquet hall offering quality service at affordable rates.', amenities: ['Basic AC', 'Parking', 'Kitchen', 'Tables & Chairs', 'Basic Sound'], contactEmail: 'haleem@banquet.pk' },
  { name: 'Roman Gathering Hall', class: 'standard', lat: 34.0089, lng: 71.5157, description: 'Community hall perfect for family gatherings and local celebrations.', amenities: ['Hall Space', 'Fan Cooling', 'Basic Kitchen', 'Parking', 'Seating'], contactEmail: 'roman@gathering.pk' },
  { name: 'Galaxy Event Hall', class: 'standard', lat: 34.0234, lng: 71.5312, description: 'Modern event hall suitable for various occasions and celebrations.', amenities: ['Event Space', 'Air Cooling', 'Catering Area', 'Parking Space', 'Basic AV'], contactEmail: 'galaxy@events.pk' },
  { name: 'Al-Madina Marriage Hall', class: 'standard', lat: 34.0151, lng: 71.5249, description: 'Islamic-themed marriage hall with traditional decor and family-friendly environment.', amenities: ['Prayer Area', 'Separate Sections', 'Basic Catering', 'Parking', 'Traditional Decor'], contactEmail: 'almadina@marriage.pk' },
  { name: 'Sunehri Mahal Wedding Hall', class: 'standard', lat: 34.0089, lng: 71.5157, description: 'Golden-themed wedding hall offering traditional ambiance for memorable celebrations.', amenities: ['Traditional Decor', 'Basic AC', 'Kitchen Facility', 'Parking', 'Stage Area'], contactEmail: 'sunehri@mahal.pk' },
  { name: 'Dream Marriage Hall', class: 'standard', lat: 34.0234, lng: 71.5312, description: 'Affordable marriage hall making wedding dreams come true with quality service.', amenities: ['Basic Facilities', 'Cooling System', 'Kitchen', 'Parking Area', 'Seating Arrangement'], contactEmail: 'dream@marriage.pk' }
];

// Sample coordinates for Peshawar venues (using different areas)
const peshawarAreas = [
  { lat: 34.0151, lng: 71.5249 }, // University Town
  { lat: 34.0089, lng: 71.5157 }, // Saddar
  { lat: 34.0234, lng: 71.5312 }, // Hayatabad
  { lat: 34.0067, lng: 71.5098 }, // Cantt
  { lat: 34.0278, lng: 71.5201 }, // Board Bazar
  { lat: 34.0156, lng: 71.5234 }, // G.T Road
  { lat: 34.0198, lng: 71.5278 }, // Ring Road
  { lat: 34.0123, lng: 71.5189 }, // Arbab Road
];

async function updateVenueData() {
  try {
    await new Promise(resolve => {
      mongoose.connection.once('open', resolve);
    });

    console.log('Connected to MongoDB, updating venue data...');

    const venues = await Venue.find();
    console.log(`Found ${venues.length} venues to update`);

    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i];
      
      // Find matching venue data or use defaults
      const venueInfo = venueData.find(v => v.name === venue.name) || {
        class: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'middle' : 'standard',
        lat: peshawarAreas[i % peshawarAreas.length].lat + (Math.random() - 0.5) * 0.01,
        lng: peshawarAreas[i % peshawarAreas.length].lng + (Math.random() - 0.5) * 0.01,
        description: `Beautiful ${venue.name.toLowerCase()} perfect for your special celebrations and memorable events.`,
        amenities: ['Air Conditioning', 'Parking', 'Catering', 'Sound System', 'Seating'],
        contactEmail: `info@${venue.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.pk`
      };

      const updateData = {
        class: venueInfo.class,
        latitude: venueInfo.lat,
        longitude: venueInfo.lng,
        description: venueInfo.description,
        amenities: venueInfo.amenities,
        contactEmail: venueInfo.contactEmail
      };

      await Venue.findByIdAndUpdate(venue._id, updateData, { new: true });
      console.log(`✅ Updated ${venue.name} - Class: ${updateData.class}, Location: ${updateData.latitude}, ${updateData.longitude}`);
    }

    // Verify updates
    console.log('\n🔍 Verifying updates...');
    const updatedVenues = await Venue.find().limit(5);
    updatedVenues.forEach(venue => {
      console.log(`📍 ${venue.name}: ${venue.class} class at ${venue.latitude}, ${venue.longitude}`);
    });

    console.log('\n🎉 All venues updated with class and location data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating venue data:', error);
    process.exit(1);
  }
}

updateVenueData();
