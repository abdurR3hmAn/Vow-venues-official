import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Heart, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-white to-red-100 opacity-50" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Floating Hearts Animation */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-orange-300"
            initial={{ y: "100vh", x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200) }}
            animate={{
              y: "-100vh",
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              rotate: 360
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
          >
            <Heart className="w-6 h-6 fill-current opacity-20" />
          </motion.div>
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-6"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-orange-700 via-red-600 to-orange-800 bg-clip-text text-transparent">
                Find Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 via-orange-600 to-red-700 bg-clip-text text-transparent">
                Perfect Venue
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Discover breathtaking wedding halls and event venues in Pakistan.
              Create unforgettable memories in spaces designed for your special moments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-16"
            >
              <div className="bg-white/20 backdrop-blur-sm border border-orange-200 rounded-2xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center text-orange-600">
                  <Sparkles className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">Sign up to explore venues</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* City Selection Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            Vow Venues coming to your city
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="block bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-full hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-center"
              >
                Sign Up to Explore
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="block border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-full hover:bg-orange-600 hover:text-white transition-all duration-300 font-semibold text-center"
              >
                Already have an account?
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
