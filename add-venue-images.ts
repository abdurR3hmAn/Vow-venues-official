import { Venue } from './models/venue';
import mongoose from './db';

const sampleImages = [
  'https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1520637836862-4d197d17c892?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop&crop=center',
];

async function addImagesToVenues() {
  try {
    await new Promise(resolve => {
      mongoose.connection.once('open', resolve);
    });

    console.log('Connected to MongoDB, updating venues with images...');

    const venues = await Venue.find();
    console.log(`Found ${venues.length} venues to update`);

    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i];
      const imageIndex = i % sampleImages.length;
      
      // Add a few images to each venue
      const venueImages = [
        sampleImages[imageIndex],
        sampleImages[(imageIndex + 1) % sampleImages.length],
        sampleImages[(imageIndex + 2) % sampleImages.length],
      ];

      await Venue.findByIdAndUpdate(venue._id, {
        featuredImage: sampleImages[imageIndex],
        images: venueImages
      });

      console.log(`Updated ${venue.name} with images`);
    }

    console.log('All venues updated with images!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating venues:', error);
    process.exit(1);
  }
}

addImagesToVenues();
