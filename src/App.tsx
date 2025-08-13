import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MapPin, Phone } from 'lucide-react'
import Home from './components/Home'
import Login from './components/Login'
import About from './components/About'
import VenueBooking from './components/VenueBooking'
import Feedback from './components/Feedback'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-yellow-200 sticky top-0 z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20">
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link to="/" className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center"
                    >
                      <Heart className="w-5 h-5 text-white fill-current" />
                    </motion.div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                      Vow Venues
                    </span>
                  </Link>
                </motion.div>
                <div className="flex items-center space-x-8">
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300 relative group">
                      Home
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/about" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300 relative group">
                      About
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/feedback" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-300 relative group">
                      Feedback
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link to="/login" className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-3 rounded-full hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                      Login
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/venue/:id" element={<VenueBooking />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
