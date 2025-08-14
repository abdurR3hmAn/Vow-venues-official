import mongoose from './db'
import { storage } from './storage'

// Mapping of venue names to their image folder names (normalized)
const venueImageMap: Record<string, string> = {
  // Convert venue names to URL-friendly folder names
  'Haleem Banquet': 'haleem-banquet',
  'Roman Gathering Hall': 'roman-gathering-hall',
  'Unique Wdding Hall': 'unique-wedding-hall',
  'Galaxy Event Hall': 'galaxy-event-hall',
  'Al-Madina Marriage Hall': 'al-madina-marriage-hall',
  'Rehman Banquet Hall': 'rehman-banquet-hall',
  'Sunehri Mahal Wedding Hall': 'sunehri-mahal-wedding-hall',
  'Gulzar Banquet Hall': 'gulzar-banquet-hall',
  'Zarqa Banquet Hall': 'zarqa-banquet-hall',
  'Jasmine Banquet Hall': 'jasmine-banquet-hall',
  'Shalimar Banquet Hall': 'shalimar-banquet-hall',
  'Marbella Cave': 'marbella-cave',
  'Sabrina Gulbahar Banquet Hall': 'sabrina-gulbahar-banquet-hall',
  'Casa Loma Banquet Hall': 'casa-loma-banquet-hall',
  'Dream Marriage Hall': 'dream-marriage-hall',
  'Peshawar Services Club Banquet Hall': 'peshawar-services-club-banquet-hall',
  'Feroz Banquet Hall': 'feroz-banquet-hall',
  'Basant Banquet Hall': 'basant-banquet-hall',
  'Royal Club Wedding Hall': 'royal-club-wedding-hall',
  'Al Noor Banquet Hall': 'al-noor-banquet-hall',
  'Gulshan Banquet Hall': 'gulshan-banquet-hall',
  'Sajjad Banquet Hall': 'sajjad-banquet-hall',
  'Pearl Continental Hotel Peshawar': 'pearl-continental-hotel-peshawar',
  'monal marquee peshawar': 'monal-marquee-peshawar',
  'Imperial Grand Banquet Hall': 'imperial-grand-banquet-hall',
  'Elite Royale Wedding Palace': 'elite-royale-wedding-palace',
  'Crown Regency Banquet Hall': 'crown-regency-banquet-hall',
  'Majestic Elegance Banquet Hall': 'majestic-elegance-banquet-hall',
  'Premier Luxury Banquet Hall': 'premier-luxury-banquet-hall',
  'Grand Imperial Marquee': 'grand-imperial-marquee',
  'Regal Elite Banquet Hall': 'regal-elite-banquet-hall',
  'Testing Purpose': 'testing-purpose'
}

// Function to generate image URLs for a venue
function generateVenueImages(venueFolderName: string): {
  featuredImage: string
  images: string[]
} {
  const baseUrl = '/images/venues'
  
  // Default images if specific venue folder doesn't exist
  const defaultImages = [
    'https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop&crop=center'
  ]
  
  // Try to use local images first, fallback to placeholder
  const localImages = [
    `${baseUrl}/${venueFolderName}/1.jpg`,
    `${baseUrl}/${venueFolderName}/2.jpg`,
    `${baseUrl}/${venueFolderName}/3.jpg`,
    `${baseUrl}/${venueFolderName}/4.jpg`,
    `${baseUrl}/${venueFolderName}/5.jpg`
  ]
  
  return {
    featuredImage: localImages[0],
    images: localImages
  }
}

async function updateVenueImages() {
  try {
    console.log('Starting venue images update...')
    
    // Get all venues
    const venues = await storage.getVenues()
    console.log(`Found ${venues.length} venues to update`)
    
    let updatedCount = 0
    
    for (const venue of venues) {
      const venueFolderName = venueImageMap[venue.name]
      
      if (venueFolderName) {
        const imageData = generateVenueImages(venueFolderName)
        
        // Update venue with new image paths
        await storage.updateVenue(venue._id.toString(), {
          featuredImage: imageData.featuredImage,
          images: imageData.images
        })
        
        console.log(`✅ Updated images for: ${venue.name}`)
        updatedCount++
      } else {
        console.log(`⚠️  No image mapping found for: ${venue.name}`)
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} venues with new image paths`)
    console.log('Image folder structure expected:')
    console.log('public/images/venues/[venue-folder-name]/1.jpg, 2.jpg, 3.jpg, etc.')
    
  } catch (error) {
    console.error('❌ Error updating venue images:', error)
  } finally {
    mongoose.disconnect()
  }
}

// Run the update if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateVenueImages()
}

export { updateVenueImages, venueImageMap }
