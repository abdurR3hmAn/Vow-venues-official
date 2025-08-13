import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

interface Venue {
  _id: string
  name: string
  capacity: number
  additionalMetric?: number
  phone: string
  address: string
  price: number
  email?: string
}

async function fetchVenues(): Promise<Venue[]> {
  const response = await fetch('/api/venues')
  if (!response.ok) {
    throw new Error('Failed to fetch venues')
  }
  return response.json()
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['venues'],
    queryFn: fetchVenues
  })

  const filteredVenues = venues?.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Venue
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover beautiful wedding halls and event venues in Peshawar
        </p>
        
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search venues by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading venues...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading venues. Please try again.</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div key={venue._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
                <p className="text-gray-600 mb-4">{venue.address}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capacity:</span>
                    <span className="font-medium">{venue.capacity} guests</span>
                  </div>
                  {venue.additionalMetric && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Parking:</span>
                      <span className="font-medium">{venue.additionalMetric} cars</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium text-pink-600">Rs. {venue.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <a
                    href={`tel:${venue.phone}`}
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    📞 {venue.phone}
                  </a>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredVenues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No venues found matching your search.</p>
        </div>
      )}
    </div>
  )
}
