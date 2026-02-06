import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Venue } from './models/venue';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function importVenues() {
  try {
    // Do not clear existing venues automatically to avoid data loss
    // If you need to reset, clear explicitly elsewhere

    const filePath = path.join(__dirname, "halls.txt");
    const data = await fs.promises.readFile(filePath, 'utf8');
    const lines = data.split('\n').filter(Boolean);

    const venues = [] as Array<{
      name: string;
      capacity: number;
      additionalMetric: number;
      phone: string;
      address: string;
      price: number;
      email?: string;
    }>;

    for (const line of lines) {
      try {
        const parts = line.split('\t').map(part => part.trim());
        if (parts.length < 6) {
          console.log('Skipping: insufficient parts:', line);
          continue;
        }

        const name = parts[0];
        const capacity = parseInt(parts[1], 10);
        const parking = parseInt(parts[2], 10);
        const phone = parts[3];
        const address = parts[4];
        // Sanitize price to handle commas (e.g., "100,000") and malformed values
        const priceRaw = parts[5] ?? '';
        const price = parseInt(priceRaw.replace(/,/g, ''), 10);
        let email = parts[6] || undefined;

        // Basic validation
        if (!name || isNaN(capacity) || isNaN(parking) || !phone || !address || isNaN(price)) {
          console.log('Skipping: invalid data:', line);
          continue;
        }

        // If the parsed email is clearly invalid (contains spaces or repeats address), drop it
        if (email && (email.includes(' ') || email.toLowerCase().includes('peshawar'))) {
          email = undefined;
        }

        venues.push({
          name,
          capacity,
          additionalMetric: parking,
          phone,
          address,
          price,
          email,
        });

        console.log('Successfully parsed venue:', name);

      } catch (error) {
        console.error('Error parsing line:', line);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
      }
    }

    if (venues.length > 0) {
      // Insert non-duplicates only (by name + address)
      let inserted = 0;
      for (const v of venues) {
        const exists = await Venue.findOne({ name: v.name, address: v.address }).lean();
        if (!exists) {
          await Venue.create(v);
          inserted++;
        }
      }
      console.log(`Successfully imported ${inserted} venues from halls.txt`);
    } else {
      console.log('No valid venues found to import');
    }

  } catch (error) {
    console.error('Error importing venues:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}
