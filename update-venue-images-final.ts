import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from './db.js';
import { Venue } from './models/venue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to convert venue name to folder name format
function venueNameToFolderName(venueName: string): string {
  return venueName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
}

// Function to get images for a venue
function getVenueImages(venueName: string): { featuredImage: string; images: string[] } {
  const folderName = venueNameToFolderName(venueName);
  const imagesPath = path.join(__dirname, 'public', 'images', 'venues', folderName);
  
  console.log(`Looking for images in: ${imagesPath}`);
  
  // Check if folder exists
  if (!fs.existsSync(imagesPath)) {
    console.log(`No image folder found for venue: ${venueName} (${folderName})`);
    return { 
      featuredImage: '/images/venues/banner.png', 
      images: ['/images/venues/banner.png'] 
    };
  }
  
  // Get all image files from the folder
  const imageFiles = fs.readdirSync(imagesPath)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort(); // Sort to ensure consistent ordering
  
  if (imageFiles.length === 0) {
    console.log(`No image files found in folder for venue: ${venueName}`);
    return { 
      featuredImage: '/images/venues/banner.png', 
      images: ['/images/venues/banner.png'] 
    };
  }
  
  // Create full image paths
  const images = imageFiles.map(file => `/images/venues/${folderName}/${file}`);
  
  console.log(`Found ${images.length} images for ${venueName}:`, images);
  
  return {
    featuredImage: images[0], // Use first image as featured
    images: images
  };
}

async function updateVenueImages() {
  try {
    console.log('Starting venue image update...');
    
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
    
    for (const venue of venues) {
      console.log(`\nUpdating images for: ${venue.name}`);
      
      // Get local images for this venue
      const { featuredImage, images } = getVenueImages(venue.name);
      
      // Update venue with new image paths
      await Venue.updateOne(
        { _id: venue._id },
        { 
          $set: { 
            featuredImage: featuredImage,
            images: images
          }
        }
      );
      
      console.log(`✅ Updated ${venue.name}:`);
      console.log(`   Featured: ${featuredImage}`);
      console.log(`   Images: [${images.join(', ')}]`);
    }
    
    console.log('\n🎉 All venue images updated successfully!');
    
  } catch (error) {
    console.error('Error updating venue images:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  updateVenueImages();
}

export { updateVenueImages };
