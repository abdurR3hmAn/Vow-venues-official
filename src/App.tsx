import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Menu, X } from 'lucide-react'
import Home from './components/Home'
import Login from './components/Login'
import About from './components/About'
import VenueBooking from './components/VenueBooking'
import Feedback from './components/Feedback'
import Reviews from './components/Reviews'

const queryClient = new QueryClient()

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-orange-200 sticky top-0 z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20">
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link to="/" className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <span className="text-2xl font-bold text-white">VV</span>
                    </motion.div>
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-700 via-red-600 to-orange-800 bg-clip-text text-transparent">
                      Vow Venues
                    </span>
                  </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300 relative group">
                      Home
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-red-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300 relative group">
                      About
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-red-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/reviews" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300 relative group">
                      Reviews
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-red-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to="/feedback" className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300 relative group">
                      Feedback
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-red-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link to="/login" className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                      Login
                    </Link>
                  </motion.div>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="md:hidden flex items-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-300"
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Popup */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden bg-white/95 backdrop-blur-lg border-t border-orange-200"
                >
                  <div className="px-4 py-6 space-y-4">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        to="/"
                        onClick={closeMobileMenu}
                        className="block text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 py-2 border-b border-gray-100"
                      >
                        Home
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        to="/about"
                        onClick={closeMobileMenu}
                        className="block text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 py-2 border-b border-gray-100"
                      >
                        About
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        to="/reviews"
                        onClick={closeMobileMenu}
                        className="block text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 py-2 border-b border-gray-100"
                      >
                        Reviews
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        to="/feedback"
                        onClick={closeMobileMenu}
                        className="block text-lg font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 py-2 border-b border-gray-100"
                      >
                        Feedback
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="pt-4"
                    >
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block w-full bg-gradient-to-r from-orange-600 to-red-600 text-white text-center px-6 py-3 rounded-full hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-medium shadow-lg"
                      >
                        Login
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/venue/:id" element={<VenueBooking />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
