import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Building2, Calendar } from 'lucide-react'
import LocationAutocomplete from './LocationAutocomplete'

interface AdvancedSearchProps {
  onVenueSearch: (query: string) => void
  onLocationSelect: (location: {
    placeId: string
    mainText: string
    secondaryText: string
    fullText: string
  }) => void
  venueSearchTerm: string
}

export default function AdvancedSearch({ 
  onVenueSearch, 
  onLocationSelect, 
  venueSearchTerm 
}: AdvancedSearchProps) {
  const [activeTab, setActiveTab] = useState<'venue' | 'location'>('venue')

  return (
    <div className="max-w-2xl mx-auto">
      {/* Search Type Tabs */}
      <div className="flex mb-4 bg-white/20 rounded-2xl p-1 backdrop-blur-sm">
        <motion.button
          onClick={() => setActiveTab('venue')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'venue'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
              : 'text-gray-700 hover:bg-white/30'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="font-medium">Search Venues</span>
        </motion.button>
        
        <motion.button
          onClick={() => setActiveTab('location')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
            activeTab === 'location'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
              : 'text-gray-700 hover:bg-white/30'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span className="font-medium">Search by Location</span>
        </motion.button>
      </div>

      {/* Search Input */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'venue' ? (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-yellow-500" />
            </div>
            <motion.input
              type="text"
              placeholder="Search venues by name, type, or features..."
              value={venueSearchTerm}
              onChange={(e) => onVenueSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 text-lg border-2 border-yellow-200 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
        ) : (
          <LocationAutocomplete
            placeholder="Search by city, area, or specific location..."
            onLocationSelect={onLocationSelect}
            className="w-full"
          />
        )}
      </motion.div>

      {/* Search Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-center"
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            {activeTab === 'venue' ? (
              <>
                <div className="flex items-center space-x-1">
                  <Building2 className="w-4 h-4" />
                  <span>Venue names</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Event types</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>💎</span>
                  <span>Amenities</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Cities & Areas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🏢</span>
                  <span>Landmarks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>Addresses</span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
