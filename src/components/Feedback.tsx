import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  MessageCircle, 
  Star, 
  Send, 
  Heart, 
  ThumbsUp, 
  ArrowLeft,
  CheckCircle,
  User,
  Mail,
  Phone
} from 'lucide-react'

interface FeedbackData {
  name: string
  email: string
  phone: string
  feedbackType: 'general' | 'venue' | 'booking' | 'support' | 'feature'
  rating: number
  subject: string
  message: string
  venueExperience: string
  wouldRecommend: boolean
}

const feedbackTypes = [
  { value: 'general', label: 'General Feedback', icon: '💬', color: 'from-blue-500 to-indigo-500' },
  { value: 'venue', label: 'Venue Experience', icon: '🏛️', color: 'from-purple-500 to-pink-500' },
  { value: 'booking', label: 'Booking Process', icon: '📅', color: 'from-green-500 to-teal-500' },
  { value: 'support', label: 'Customer Support', icon: '🤝', color: 'from-yellow-500 to-orange-500' },
  { value: 'feature', label: 'Feature Request', icon: '💡', color: 'from-red-500 to-rose-500' }
]

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)

export default function Feedback() {
  const navigate = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FeedbackData>({
    name: '',
    email: '',
    phone: '',
    feedbackType: 'general',
    rating: 0,
    subject: '',
    message: '',
    venueExperience: '',
    wouldRecommend: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      const result = await response.json()
      console.log('Feedback submitted:', result)

      setIsSubmitted(true)

      // Auto redirect after success
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FeedbackData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const StarRating = ({ rating, onRatingChange }: { rating: number, onRatingChange: (rating: number) => void }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRatingChange(star)}
          className={`p-1 transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} />
        </motion.button>
      ))}
    </div>
  )

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg mx-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Thank You!
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-6"
          >
            Your feedback has been submitted successfully. We appreciate your input and will use it to improve our services.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500"
          >
            Redirecting to home page in 3 seconds...
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-white hover:text-yellow-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </div>
          
          <FloatingElement>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <MessageCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Share Your Feedback
              </h1>
              <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
                Your opinion matters! Help us improve by sharing your experience with Vow Venues.
              </p>
            </div>
          </FloatingElement>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FloatingElement delay={0.3}>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Feedback Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {feedbackTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleInputChange('feedbackType', type.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                          formData.feedbackType === type.value
                            ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg`
                            : 'bg-white border-gray-200 text-gray-700 hover:border-yellow-300 hover:shadow-md'
                        }`}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="text-sm font-medium">{type.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Overall Rating *
                  </label>
                  <div className="flex items-center space-x-6">
                    <StarRating 
                      rating={formData.rating} 
                      onRatingChange={(rating) => handleInputChange('rating', rating)}
                    />
                    <span className="text-lg font-medium text-gray-600">
                      {formData.rating > 0 && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-orange-600"
                        >
                          {formData.rating === 1 && "Poor"}
                          {formData.rating === 2 && "Fair"}
                          {formData.rating === 3 && "Good"}
                          {formData.rating === 4 && "Very Good"}
                          {formData.rating === 5 && "Excellent"}
                        </motion.span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                    placeholder="Brief subject of your feedback"
                  />
                </div>

                {/* Detailed Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Feedback *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                    placeholder="Please share your detailed feedback, suggestions, or experience..."
                  />
                </div>

                {/* Venue Experience (if venue feedback) */}
                <AnimatePresence>
                  {formData.feedbackType === 'venue' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue Name & Experience Details
                      </label>
                      <textarea
                        rows={3}
                        value={formData.venueExperience}
                        onChange={(e) => handleInputChange('venueExperience', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                        placeholder="Which venue did you visit? How was your experience with the venue, staff, facilities, etc.?"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Recommendation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Would you recommend Vow Venues to others?
                  </label>
                  <div className="flex space-x-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleInputChange('wouldRecommend', true)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                        formData.wouldRecommend
                          ? 'bg-green-500 text-white border-green-500 shadow-lg'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Yes, I would recommend</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleInputChange('wouldRecommend', false)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                        !formData.wouldRecommend && formData.wouldRecommend !== null
                          ? 'bg-red-500 text-white border-red-500 shadow-lg'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-red-300'
                      }`}
                    >
                      <span>No, I wouldn't recommend</span>
                    </motion.button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message || formData.rating === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-12 py-4 rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </FloatingElement>

        {/* Additional Info */}
        <FloatingElement delay={0.5}>
          <div className="mt-12 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
              <Heart className="w-8 h-8 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Thank you for helping us improve!
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your feedback is invaluable to us. We read every submission and use your insights 
                to enhance our platform and provide better experiences for all users.
              </p>
            </div>
          </div>
        </FloatingElement>
      </div>
    </div>
  )
}
