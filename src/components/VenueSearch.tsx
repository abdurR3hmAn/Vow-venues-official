import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Building2, Users, MapPin, Star, X } from 'lucide-react'

interface Venue {
  _id: string
  name: string
  capacity: number
  address: string
  price: number
  class: 'standard' | 'middle' | 'high'
  amenities?: string[]
}

interface VenueSearchProps {
  venues: Venue[]
  onVenueSelect: (venue: Venue) => void
  placeholder?: string
  className?: string
}

export default function VenueSearch({ 
  venues, 
  onVenueSelect, 
  placeholder = "Search venues...",
  className = ""
}: VenueSearchProps) {
  const [query, setQuery] = useState('')
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([])
  const [isOpen, setIsOpen] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter venues based on search query
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setFilteredVenues([])
      setIsOpen(false)
      return
    }

    const filtered = venues.filter(venue => {
      const searchText = query.toLowerCase()
      return (
        venue.name.toLowerCase().includes(searchText) ||
        venue.address.toLowerCase().includes(searchText) ||
        venue.class.toLowerCase().includes(searchText) ||
        venue.amenities?.some(amenity => amenity.toLowerCase().includes(searchText))
      )
    }).slice(0, 8) // Limit to 8 results

    setFilteredVenues(filtered)
    setIsOpen(filtered.length > 0)
  }, [query, venues])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleVenueClick = (venue: Venue) => {
    setQuery(venue.name)
    setIsOpen(false)
    setFilteredVenues([])
    onVenueSelect(venue)
  }

  const clearInput = () => {
    setQuery('')
    setFilteredVenues([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const getClassBadge = (venueClass: string) => {
    const badges = {
      high: { emoji: '👑', label: 'Premium', color: 'bg-purple-500' },
      middle: { emoji: '💎', label: 'Executive', color: 'bg-blue-500' },
      standard: { emoji: '⭐', label: 'Standard', color: 'bg-green-500' }
    }
    return badges[venueClass as keyof typeof badges] || badges.standard
  }

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Building2 className="h-6 w-6 text-yellow-500" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && filteredVenues.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-14 pr-12 py-5 text-lg border-2 border-yellow-200 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
        />

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {query && (
            <button
              onClick={clearInput}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Venue Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && filteredVenues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-yellow-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {filteredVenues.map((venue, index) => {
              const badge = getClassBadge(venue.class)

              return (
                <motion.button
                  key={venue._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleVenueClick(venue)}
                  className="w-full px-6 py-4 text-left hover:bg-yellow-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {venue.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-white text-xs font-medium ${badge.color}`}>
                          <span className="mr-1">{badge.emoji}</span>
                          {badge.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{venue.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{venue.capacity} guests</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-600">
                            {formatPrice(venue.price)}
                          </span>
                        </div>
                      </div>

                      {venue.amenities && venue.amenities.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {venue.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {amenity}
                            </span>
                          ))}
                          {venue.amenities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{venue.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Building2 className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0 ml-3" />
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {isOpen && query.length >= 2 && filteredVenues.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 text-center text-gray-500 z-50"
        >
          <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No venues found for "{query}"</p>
          <p className="text-sm mt-1">Try searching by name, location, or amenities</p>
        </motion.div>
      )}
    </div>
  )
}
