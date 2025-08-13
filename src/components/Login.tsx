import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Eye, EyeOff, Heart, Sparkles } from 'lucide-react'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement login logic
    setTimeout(() => {
      console.log('Login attempt:', formData)
      setIsLoading(false)
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100" />

      {/* Floating Hearts Animation */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-300"
          initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
          animate={{
            y: "-100vh",
            x: Math.random() * window.innerWidth,
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

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-pink-100 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full -translate-y-16 translate-x-16 opacity-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-400 to-pink-500 rounded-full translate-y-12 -translate-x-12 opacity-10" />

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Heart className="w-10 h-10 text-white fill-current" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your Vow Venues account</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border-2 border-pink-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your username"
                />
              </div>
            </motion.div>

            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-4 border-2 border-pink-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-pink-400 hover:text-pink-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 px-6 rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center relative overflow-hidden"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <motion.a
                href="#"
                className="text-pink-600 hover:text-pink-700 font-medium relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Sign up now
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            </p>

            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <motion.a
                href="#"
                className="hover:text-pink-600 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Forgot Password?
              </motion.a>
              <span>•</span>
              <motion.a
                href="#"
                className="hover:text-pink-600 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Need Help?
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
