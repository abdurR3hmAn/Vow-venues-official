import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const cities = [
  { id: 'peshawar', name: 'Peshawar', count: 58, icon: '🏛️' },
  { id: 'islamabad', name: 'Islamabad', count: 61, icon: '🏛️' },
  { id: 'rawalpindi', name: 'Rawalpindi', count: 59, icon: '🏛️' },
  { id: 'lahore', name: 'Lahore', count: 123, icon: '🏛️' },
  { id: 'karachi', name: 'Karachi', count: 73, icon: '🏛️' },
]

export default function CitySelection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
          Eventza coming to your city
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Explore the best marriage halls of your city with best prices
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
        {cities.map((city, index) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {city.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">{city.name}</h3>
              <p className="text-sm text-gray-500 flex items-center justify-center">
                <Users className="w-4 h-4 mr-1" />
                Marriage Halls ({city.count})
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-12 border border-orange-200"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Ready to explore venues?
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Sign up to discover and book the perfect venue for your special day
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-full hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Sign Up to Explore
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-full hover:bg-orange-600 hover:text-white transition-all duration-300 font-semibold"
          >
            Already have an account?
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
