import React from 'react'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Vow Venues
        </h1>
        <p className="text-xl text-gray-600">
          Your trusted partner in finding the perfect venue for your special day
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We believe that every celebration deserves the perfect venue. Our platform connects 
            couples and event planners with the most beautiful and suitable venues in Peshawar, 
            making the venue selection process simple, transparent, and stress-free.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-pink-600 mr-2">•</span>
              Comprehensive venue listings with detailed information
            </li>
            <li className="flex items-start">
              <span className="text-pink-600 mr-2">•</span>
              Direct contact with venue owners and managers
            </li>
            <li className="flex items-start">
              <span className="text-pink-600 mr-2">•</span>
              Transparent pricing and capacity information
            </li>
            <li className="flex items-start">
              <span className="text-pink-600 mr-2">•</span>
              User reviews and ratings
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-pink-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Why Choose Vow Venues?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl mb-2">🏛️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Curated Selection</h3>
            <p className="text-gray-600 text-sm">
              Hand-picked venues that meet our quality standards
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
            <p className="text-gray-600 text-sm">
              Competitive pricing and transparent cost breakdown
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
            <p className="text-gray-600 text-sm">
              Dedicated support team to help you every step of the way
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Find Your Venue?</h2>
        <a
          href="/"
          className="inline-block bg-pink-600 text-white px-8 py-3 rounded-md hover:bg-pink-700 transition-colors font-medium"
        >
          Browse Venues
        </a>
      </div>
    </div>
  )
}
