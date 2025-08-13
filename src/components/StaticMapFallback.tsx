import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'

interface StaticMapFallbackProps {
  venue: {
    name: string
    latitude?: number
    longitude?: number
    address: string
  }
}

export default function StaticMapFallback({ venue }: StaticMapFallbackProps) {
  const venueLocation = venue.latitude && venue.longitude 
    ? { lat: venue.latitude, lng: venue.longitude }
    : { lat: 34.0151, lng: 71.5249 } // Default Peshawar coordinates

  return (
    <div className="space-y-4">
      {/* Static Map Image */}
      <div className="h-80 bg-gray-200 rounded-xl overflow-hidden relative">
        <img
          src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop&crop=center`}
          alt="Map placeholder"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <MapPin className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
            <p className="text-sm opacity-90">{venue.address}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <motion.a
          href={`https://www.google.com/maps/dir/?api=1&destination=${venueLocation.lat},${venueLocation.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span>Get Directions</span>
        </motion.a>
        
        <motion.a
          href={`https://maps.google.com/?q=${venueLocation.lat},${venueLocation.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open in Maps</span>
        </motion.a>
      </div>

      {/* Information Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800 mb-1">
              Interactive map temporarily unavailable
            </p>
            <p className="text-yellow-700">
              Use the buttons above to get directions or view the location in Google Maps.
            </p>
            {venue.latitude && venue.longitude && (
              <p className="text-yellow-600 mt-2">
                Coordinates: {venue.latitude.toFixed(6)}, {venue.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
