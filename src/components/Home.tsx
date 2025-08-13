import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Users, Car, Phone, Star, Calendar, Heart, Sparkles, Crown } from 'lucide-react'

interface Venue {
  _id: string
  name: string
  capacity: number
  additionalMetric?: number
  phone: string
  address: string
  price: number
  email?: string
  images?: string[]
  featuredImage?: string
  class: 'standard' | 'middle' | 'high'
  latitude?: number
  longitude?: number
  description?: string
  amenities?: string[]
  contactEmail?: string
}

interface FilterState {
  priceRange: [number, number]
  capacityRange: [number, number]
  venueClass: string[]
  searchTerm: string
}

async function fetchVenues(): Promise<Venue[]> {
  const response = await fetch('/api/venues')
  if (!response.ok) {
    throw new Error('Failed to fetch venues')
  }
  return response.json()
}

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)

const VenueCard = ({ venue, index }: { venue: Venue, index: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  // Default placeholder image if no image is provided
  const imageUrl = venue.featuredImage || venue.images?.[0] || `https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=400&h=250&fit=crop&crop=center`

  const handleBookNow = () => {
    navigate(`/venue/${venue._id}`)
  }

  const getClassBadge = (venueClass: string) => {
    const badges = {
      high: { emoji: '👑', label: 'Premium', color: 'from-purple-500 to-pink-500' },
      middle: { emoji: '💎', label: 'Executive', color: 'from-blue-500 to-indigo-500' },
      standard: { emoji: '⭐', label: 'Standard', color: 'from-green-500 to-teal-500' }
    }
    const badge = badges[venueClass as keyof typeof badges] || badges.standard
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${badge.color}`}>
        <span className="mr-1">{badge.emoji}</span>
        {badge.label}
      </span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-yellow-200"
    >
      {/* Featured Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <motion.img
          src={imageUrl}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
          onError={(e) => {
            console.log(`Failed to load image for ${venue.name}:`, imageUrl)
            e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=400&h=250&fit=crop&crop=center'
          }}
          onLoad={() => {
            console.log(`Successfully loaded image for ${venue.name}:`, imageUrl)
          }}
        />

        {/* Premium Badge */}
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-2 rounded-full shadow-lg"
          >
            <Crown className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Floating Sparkles */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-6 left-6 text-yellow-400"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-6 right-16 text-amber-400"
            >
              <Sparkles className="w-3 h-3" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="p-6">
        <motion.h3
          className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {venue.name}
        </motion.h3>

        <div className="flex items-center text-gray-600 mb-4 group-hover:text-gray-800 transition-colors duration-300">
          <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
          <span className="text-sm">{venue.address}</span>
        </div>

        <div className="space-y-3 mb-6">
          <motion.div
            className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-gray-600 font-medium">Capacity</span>
            </div>
            <span className="font-bold text-gray-900">{venue.capacity} guests</span>
          </motion.div>

          {venue.additionalMetric && (
            <motion.div
              className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center">
                <Car className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-gray-600 font-medium">Parking</span>
              </div>
              <span className="font-bold text-gray-900">{venue.additionalMetric} cars</span>
            </motion.div>
          )}

          <motion.div
            className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-gray-600 font-medium">Starting Price</span>
            <div className="text-right">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Rs. {venue.price.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-3">
          <motion.a
            href={`tel:${venue.phone}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-yellow-200 text-yellow-600 rounded-xl hover:bg-yellow-50 transition-all duration-300 font-medium group"
          >
            <Phone className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Call Now
          </motion.a>

          <motion.button
            onClick={handleBookNow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-3 rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center group"
          >
            <Calendar className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            Book Now
          </motion.button>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Calendar className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Book {venue.name}</h3>
                <p className="text-gray-600">Choose how you'd like to make your booking</p>
              </div>

              <div className="space-y-4">
                <motion.button
                  onClick={handleWhatsAppBooking}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500 text-white px-6 py-4 rounded-xl hover:bg-green-600 transition-all duration-300 font-medium shadow-lg flex items-center justify-center space-x-3"
                >
                  <span className="text-xl">📱</span>
                  <span>Book via WhatsApp</span>
                </motion.button>

                <motion.button
                  onClick={handleEmailBooking}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-500 text-white px-6 py-4 rounded-xl hover:bg-blue-600 transition-all duration-300 font-medium shadow-lg flex items-center justify-center space-x-3"
                >
                  <span className="text-xl">📧</span>
                  <span>{venue.email ? 'Book via Email' : 'Call to Book'}</span>
                </motion.button>

                <motion.button
                  onClick={() => setShowBookingModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000000],
    capacityRange: [0, 5000],
    venueClass: [],
    searchTerm: ''
  })

  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['venues'],
    queryFn: fetchVenues
  })

  const filteredVenues = venues?.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPrice = venue.price >= filters.priceRange[0] && venue.price <= filters.priceRange[1]
    const matchesCapacity = venue.capacity >= filters.capacityRange[0] && venue.capacity <= filters.capacityRange[1]
    const matchesClass = filters.venueClass.length === 0 || filters.venueClass.includes(venue.class)

    return matchesSearch && matchesPrice && matchesCapacity && matchesClass
  }) || []

  const handleClassFilter = (className: string) => {
    setFilters(prev => ({
      ...prev,
      venueClass: prev.venueClass.includes(className)
        ? prev.venueClass.filter(c => c !== className)
        : [...prev.venueClass, className]
    }))
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 2000000],
      capacityRange: [0, 5000],
      venueClass: [],
      searchTerm: ''
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-white to-amber-100 opacity-50" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <FloatingElement>
              <motion.h1
                className="text-6xl md:text-7xl font-bold mb-6"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Find Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Perfect Venue
                </span>
              </motion.h1>
            </FloatingElement>

            <FloatingElement delay={0.2}>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover breathtaking wedding halls and event venues in Peshawar.
                Create unforgettable memories in spaces designed for your special moments.
              </p>
            </FloatingElement>

            <FloatingElement delay={0.4}>
              <div className="max-w-2xl mx-auto relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-yellow-500" />
                </div>
                <motion.input
                  type="text"
                  placeholder="Search venues by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 text-lg border-2 border-yellow-200 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <motion.div
                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-8 py-3 rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-lg">
                    Search
                  </button>
                </motion.div>
              </div>
            </FloatingElement>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <FloatingElement delay={0.6}>
        <div className="bg-white/90 backdrop-blur-sm border-y border-yellow-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-lg"
            >
              <span className="text-lg">🎛️</span>
              <span>Advanced Filters ({filteredVenues.length} venues)</span>
            </motion.button>
          </div>
        </div>
      </FloatingElement>

      {/* Stats Section */}
      <FloatingElement delay={0.7}>
        <div className="bg-white/80 backdrop-blur-sm border-y border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "50+", label: "Premium Venues", icon: Crown },
                { number: "10K+", label: "Happy Couples", icon: Heart },
                { number: "5⭐", label: "Average Rating", icon: Star },
                { number: "24/7", label: "Support", icon: Phone },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </FloatingElement>

      {/* Venues Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FloatingElement delay={0.8}>
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Featured Venues
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked premium venues for your special celebration
            </p>
          </div>
        </FloatingElement>

        {isLoading && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-pink-200 border-t-pink-600 rounded-full mx-auto mb-6"
            />
            <motion.p
              className="text-xl text-gray-600"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Discovering amazing venues for you...
            </motion.p>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">😔</span>
            </div>
            <p className="text-xl text-red-600 font-medium">Oops! Something went wrong</p>
            <p className="text-gray-600 mt-2">Please try refreshing the page</p>
          </motion.div>
        )}

        {!isLoading && !error && (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVenues.map((venue, index) => (
                <VenueCard key={venue._id} venue={venue} index={index} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {!isLoading && !error && filteredVenues.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
