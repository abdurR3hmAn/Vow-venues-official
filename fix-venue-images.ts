import { Venue } from './models/venue';
import mongoose from './db';

const premiumVenueImages = [
  'https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=800&h=600&fit=crop&crop=center', // Elegant ballroom
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center', // Luxury wedding venue
  'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop&crop=center', // Garden wedding venue
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&crop=center', // Modern banquet hall
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop&crop=center', // Crystal chandelier venue
  'https://images.unsplash.com/photo-1520637736862-4d197d17c892?w=800&h=600&fit=crop&crop=center', // Outdoor wedding venue
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center', // Elegant reception hall
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=600&fit=crop&crop=center', // Beautiful event space
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=600&fit=crop&crop=center', // Rustic wedding venue
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop&crop=center', // Sophisticated banquet
  'https://images.unsplash.com/photo-1481336153-14edb8f7dce4?w=800&h=600&fit=crop&crop=center', // Royal wedding hall
  'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop&crop=center', // Intimate venue
  'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&h=600&fit=crop&crop=center', // Grand ballroom
  'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800&h=600&fit=crop&crop=center', // Premium banquet
  'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=600&fit=crop&crop=center', // Luxury reception
];

async function fixVenueImages() {
  try {
    await new Promise(resolve => {
      mongoose.connection.once('open', resolve);
    });

    console.log('Connected to MongoDB, fixing venue images...');

    const venues = await Venue.find();
    console.log(`Found ${venues.length} venues to fix`);

    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i];
      const imageIndex = i % premiumVenueImages.length;
      
      // Create a unique set of images for each venue
      const venueImages = [
        premiumVenueImages[imageIndex],
        premiumVenueImages[(imageIndex + 3) % premiumVenueImages.length],
        premiumVenueImages[(imageIndex + 7) % premiumVenueImages.length],
      ];

      const updateData = {
        featuredImage: premiumVenueImages[imageIndex],
        images: venueImages
      };

      await Venue.findByIdAndUpdate(venue._id, updateData, { new: true });
      console.log(`✅ Fixed ${venue.name} with featured image: ${updateData.featuredImage}`);
    }

    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const updatedVenues = await Venue.find().limit(3);
    updatedVenues.forEach(venue => {
      console.log(`📸 ${venue.name}: ${venue.featuredImage}`);
    });

    console.log('\n🎉 All venues updated with unique images!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing venues:', error);
    process.exit(1);
  }
}

fixVenueImages();
