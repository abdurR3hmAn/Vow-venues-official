import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Users, Car, Phone, Mail, Star, Calendar, CreditCard, Navigation } from 'lucide-react'
import InteractiveMap from './InteractiveMap'

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

interface BookingFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  eventDate: string
  guestCount: number
  eventType: string
  specialRequirements: string
}

async function fetchVenue(id: string): Promise<Venue> {
  const response = await fetch(`/api/venues/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch venue')
  }
  return response.json()
}

export default function VenueBooking() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'details' | 'booking' | 'payment'>('details')
  const [bookingData, setBookingData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    guestCount: 0,
    eventType: 'wedding',
    specialRequirements: ''
  })
  const [selectedPayment, setSelectedPayment] = useState<'easypaisa' | 'jazzcash' | null>(null)

  const { data: venue, isLoading, error } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => fetchVenue(id!),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-yellow-200 border-t-yellow-600 rounded-full"
        />
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-500 text-white px-6 py-3 rounded-xl hover:bg-yellow-600 transition-colors"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    )
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveTab('payment')
  }

  const handlePayment = (method: 'easypaisa' | 'jazzcash') => {
    setSelectedPayment(method)
    // Here you would integrate with actual payment gateways
    alert(`Processing payment via ${method.toUpperCase()}...`)
  }

  const getClassBadge = (venueClass: string) => {
    const badges = {
      high: { emoji: '👑', label: 'Premium', color: 'bg-purple-500' },
      middle: { emoji: '💎', label: 'Executive', color: 'bg-blue-500' },
      standard: { emoji: '⭐', label: 'Standard', color: 'bg-green-500' }
    }
    const badge = badges[venueClass as keyof typeof badges] || badges.standard
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${badge.color}`}>
        <span className="mr-1">{badge.emoji}</span>
        {badge.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Venues</span>
            </motion.button>
            <div className="flex space-x-1">
              {['details', 'booking', 'payment'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-yellow-500 text-white'
                      : 'text-gray-600 hover:text-yellow-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Venue Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="relative h-64 md:h-80">
            <img
              src={venue.featuredImage || venue.images?.[0]}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{venue.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{venue.address}</span>
                </div>
                {getClassBadge(venue.class)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Venue Details */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Venue Details</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl">
                      <Users className="w-6 h-6 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-600">Capacity</p>
                        <p className="font-semibold">{venue.capacity} guests</p>
                      </div>
                    </div>
                    
                    {venue.additionalMetric && (
                      <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl">
                        <Car className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Parking</p>
                          <p className="font-semibold">{venue.additionalMetric} cars</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Starting Price</p>
                    <p className="text-2xl font-bold text-green-600">Rs. {venue.price.toLocaleString()}</p>
                  </div>

                  {venue.description && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{venue.description}</p>
                    </div>
                  )}

                  {venue.amenities && venue.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {venue.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-yellow-600" />
                      <a href={`tel:${venue.phone}`} className="text-yellow-600 hover:text-yellow-700">
                        {venue.phone}
                      </a>
                    </div>
                    {venue.contactEmail && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-yellow-600" />
                        <a href={`mailto:${venue.contactEmail}`} className="text-yellow-600 hover:text-yellow-700">
                          {venue.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={() => setActiveTab('booking')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-4 rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-lg"
                >
                  Book This Venue
                </motion.button>
              </div>

              {/* Google Maps */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
                
                {venue.latitude && venue.longitude ? (
                  <div className="space-y-4">
                    <div className="h-80 bg-gray-200 rounded-xl overflow-hidden">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${venue.latitude},${venue.longitude}&zoom=15`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${venue.name} Location`}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <motion.a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`}
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
                        href={`https://maps.google.com/?q=${venue.latitude},${venue.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>View on Map</span>
                      </motion.a>
                    </div>
                  </div>
                ) : (
                  <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-4" />
                      <p>Location coordinates not available</p>
                      <p className="text-sm mt-2">Address: {venue.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'booking' && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Information</h2>
                
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.customerName}
                        onChange={(e) => setBookingData(prev => ({ ...prev, customerName: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingData.customerEmail}
                        onChange={(e) => setBookingData(prev => ({ ...prev, customerEmail: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={bookingData.customerPhone}
                        onChange={(e) => setBookingData(prev => ({ ...prev, customerPhone: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingData.eventDate}
                        onChange={(e) => setBookingData(prev => ({ ...prev, eventDate: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max={venue.capacity}
                        value={bookingData.guestCount}
                        onChange={(e) => setBookingData(prev => ({ ...prev, guestCount: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                        placeholder="Number of guests"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Type
                      </label>
                      <select
                        value={bookingData.eventType}
                        onChange={(e) => setBookingData(prev => ({ ...prev, eventType: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      >
                        <option value="wedding">Wedding</option>
                        <option value="engagement">Engagement</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={bookingData.specialRequirements}
                      onChange={(e) => setBookingData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      placeholder="Any special requirements or additional services needed..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-4 rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-lg"
                  >
                    Proceed to Payment
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Options</h2>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Venue:</span>
                      <span className="font-medium">{venue.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{bookingData.eventDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span className="font-medium">{bookingData.guestCount}</span>
                    </div>
                    <div className="flex justify-between border-t border-yellow-300 pt-2 mt-4">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-bold text-lg">Rs. {venue.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
                  
                  <motion.button
                    onClick={() => handlePayment('easypaisa')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-4 p-6 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 transition-all duration-300 group"
                  >
                    <img
                      src="/easypaisa-logo.png"
                      alt="EasyPaisa"
                      className="h-8 w-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 group-hover:text-yellow-600">Pay with EasyPaisa</p>
                      <p className="text-sm text-gray-600">Secure mobile payment</p>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handlePayment('jazzcash')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-4 p-6 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 transition-all duration-300 group"
                  >
                    <img
                      src="/jazzcash-logo.png"
                      alt="JazzCash"
                      className="h-8 w-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 group-hover:text-yellow-600">Pay with JazzCash</p>
                      <p className="text-sm text-gray-600">Quick mobile wallet payment</p>
                    </div>
                  </motion.button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-600">
                  <p>🔒 Your payment information is secure and encrypted</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
