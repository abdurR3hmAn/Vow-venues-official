import mongoose from './db.js';
import { Venue } from './models/venue.js';

// Common coordinates for major venues in Peshawar and surrounding areas
const venueCoordinates = {
  // Peshawar venues
  'Elite Royale Wedding Palace': { latitude: 34.0151, longitude: 71.5249 },
  'Majestic Elegance Banquet Hall': { latitude: 34.0086, longitude: 71.5201 },
  'Premier Luxury Banquet Hall': { latitude: 34.0204, longitude: 71.5350 },
  'Royal Excellency Marquee': { latitude: 34.0095, longitude: 71.5280 },
  'Imperial Grand Banquet Hall': { latitude: 34.0180, longitude: 71.5320 },
  'Grand Imperial Marquee': { latitude: 34.0130, longitude: 71.5260 },
  'monal marquee peshawar': { latitude: 34.0200, longitude: 71.5400 },
  'Crown Regency Banquet Hall': { latitude: 34.0120, longitude: 71.5240 },
  'Regal Elite Banquet Hall': { latitude: 34.0160, longitude: 71.5300 },
  'Haleem Banquet': { latitude: 34.0140, longitude: 71.5220 },
  'Roman Gathering Hall': { latitude: 34.0110, longitude: 71.5180 },
  'Unique Wdding Hall': { latitude: 34.0170, longitude: 71.5310 },
  'Galaxy Event Hall': { latitude: 34.0190, longitude: 71.5340 },
  'Al-Madina Marriage Hall': { latitude: 34.0080, longitude: 71.5160 },
  'Rehman Banquet Hall': { latitude: 34.0210, longitude: 71.5380 },
  'Khan Marriage Hall': { latitude: 34.0100, longitude: 71.5200 },
  'Platinum Events Marquee': { latitude: 34.0220, longitude: 71.5420 },
  'Diamond Wedding Palace': { latitude: 34.0070, longitude: 71.5140 },
  'Crystal Banquet Hall': { latitude: 34.0230, longitude: 71.5440 },
  'Paradise Wedding Hall': { latitude: 34.0060, longitude: 71.5120 },
  'Golden Gate Marquee': { latitude: 34.0240, longitude: 71.5460 },
  'Pearl Palace Events': { latitude: 34.0050, longitude: 71.5100 },
  'Royal Crown Banquet': { latitude: 34.0250, longitude: 71.5480 },
  'Emerald Wedding Hall': { latitude: 34.0040, longitude: 71.5080 },
  'Sapphire Events Marquee': { latitude: 34.0260, longitude: 71.5500 },
  'Ruby Palace Banquet': { latitude: 34.0030, longitude: 71.5060 },
  'Silver Star Wedding Hall': { latitude: 34.0270, longitude: 71.5520 },
  'Gold Leaf Marquee': { latitude: 34.0020, longitude: 71.5040 },
  'Platinum Star Banquet': { latitude: 34.0280, longitude: 71.5540 },
  'Diamond Crown Events': { latitude: 34.0010, longitude: 71.5020 },
  'Royal Diamond Wedding': { latitude: 34.0290, longitude: 71.5560 },
  'Crystal Crown Marquee': { latitude: 34.0000, longitude: 71.5000 },
  'Pearl Crown Banquet': { latitude: 34.0300, longitude: 71.5580 }
};

async function addCoordinatesToVenues() {
  try {
    console.log('Starting to add coordinates to venues...');
    
    // Wait for MongoDB connection
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve(true);
      } else {
        mongoose.connection.once('open', resolve);
      }
    });
    
    console.log('Connected to MongoDB');
    
    // Get all venues
    const venues = await Venue.find({});
    console.log(`Found ${venues.length} venues to update`);
    
    let updatedCount = 0;
    
    for (const venue of venues) {
      console.log(`\nProcessing venue: ${venue.name}`);
      
      // Check if venue already has coordinates
      if (venue.latitude && venue.longitude) {
        console.log(`  ✓ Already has coordinates: ${venue.latitude}, ${venue.longitude}`);
        continue;
      }
      
      // Look for matching coordinates
      const coordinates = venueCoordinates[venue.name];
      
      if (coordinates) {
        // Update venue with coordinates
        await Venue.updateOne(
          { _id: venue._id },
          { 
            $set: { 
              latitude: coordinates.latitude,
              longitude: coordinates.longitude
            }
          }
        );
        
        console.log(`  ✅ Added coordinates: ${coordinates.latitude}, ${coordinates.longitude}`);
        updatedCount++;
      } else {
        // Add default Peshawar coordinates for venues without specific coordinates
        const defaultCoords = {
          latitude: 34.0151 + (Math.random() - 0.5) * 0.02, // Add some variation around Peshawar
          longitude: 71.5249 + (Math.random() - 0.5) * 0.02
        };
        
        await Venue.updateOne(
          { _id: venue._id },
          { 
            $set: { 
              latitude: defaultCoords.latitude,
              longitude: defaultCoords.longitude
            }
          }
        );
        
        console.log(`  ⚠️  Added default coordinates: ${defaultCoords.latitude.toFixed(6)}, ${defaultCoords.longitude.toFixed(6)}`);
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} venues with coordinates!`);
    
  } catch (error) {
    console.error('Error adding coordinates to venues:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  addCoordinatesToVenues();
}

export { addCoordinatesToVenues };
