import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  Star, 
  MessageCircle, 
  PenTool, 
  ThumbsUp, 
  Calendar,
  User,
  Filter,
  SortDesc,
  Heart,
  ArrowLeft,
  Search
} from 'lucide-react'

interface Review {
  id: string
  name: string
  email: string
  rating: number
  subject: string
  message: string
  feedbackType: string
  venueExperience?: string
  wouldRecommend: boolean
  date: string
  verified?: boolean
}

// API function to fetch reviews
async function fetchReviews(): Promise<Review[]> {
  const response = await fetch('/api/reviews')
  if (!response.ok) {
    throw new Error('Failed to fetch reviews')
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

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${
          star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))}
  </div>
)

const ReviewCard = ({ review, index }: { review: Review, index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const getFeedbackTypeColor = (type: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      venue: 'bg-purple-100 text-purple-800',
      booking: 'bg-green-100 text-green-800',
      support: 'bg-yellow-100 text-yellow-800',
      feature: 'bg-red-100 text-red-800'
    }
    return colors[type as keyof typeof colors] || colors.general
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {review.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{review.name}</h3>
              {review.verified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3 mt-1">
              <StarRating rating={review.rating} />
              <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFeedbackTypeColor(review.feedbackType)}`}>
            {review.feedbackType.charAt(0).toUpperCase() + review.feedbackType.slice(1)}
          </span>
          {review.wouldRecommend && (
            <ThumbsUp className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">{review.subject}</h4>
        
        <p className={`text-gray-600 leading-relaxed ${
          !isExpanded && review.message.length > 200 ? 'line-clamp-3' : ''
        }`}>
          {review.message}
        </p>

        {review.message.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange-600 hover:text-yellow-700 text-sm font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {/* Venue Experience */}
        {review.venueExperience && (
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <h5 className="text-sm font-medium text-gray-700 mb-1">Venue Experience:</h5>
            <p className="text-sm text-gray-600">{review.venueExperience}</p>
          </div>
        )}

        {/* Recommendation */}
        {review.wouldRecommend && (
          <div className="flex items-center space-x-2 mt-3 text-green-600">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Recommends Vow Venues</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Reviews() {
  const navigate = useNavigate()
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch reviews data
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews
  })

  // Calculate average rating
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  // Filter and sort reviews
  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = searchTerm === '' ||
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.message.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRating = filterRating === null || review.rating === filterRating
      
      return matchesSearch && matchesRating
    })

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        default:
          return 0
      }
    })

    setFilteredReviews(filtered)
  }, [reviews, searchTerm, filterRating, sortBy])

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
                Customer Reviews
              </h1>
              <p className="text-xl text-yellow-100 max-w-2xl mx-auto mb-8">
                Read what our customers say about their experience with Vow Venues
              </p>
              
              {/* Write Review Button */}
              <motion.button
                onClick={() => navigate('/feedback')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <PenTool className="w-5 h-5" />
                <span>Write a Review</span>
              </motion.button>
            </div>
          </FloatingElement>
        </div>
      </div>

      {/* Stats Section */}
      <FloatingElement delay={0.3}>
        <div className="bg-white/80 backdrop-blur-sm border-y border-yellow-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{reviews.length}</div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-orange-600 mr-2">
                    {averageRating.toFixed(1)}
                  </span>
                  <StarRating rating={Math.round(averageRating)} />
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round((reviews.filter(r => r.wouldRecommend).length / reviews.length) * 100)}%
                </div>
                <div className="text-gray-600">Would Recommend</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {reviews.filter(r => r.verified).length}
                </div>
                <div className="text-gray-600">Verified Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </FloatingElement>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FloatingElement delay={0.4}>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                          filterRating === rating
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </button>
                    ))}
                    {filterRating && (
                      <button
                        onClick={() => setFilterRating(null)}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FloatingElement>

        {/* Reviews Grid */}
        <FloatingElement delay={0.5}>
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-yellow-200 border-t-yellow-600 rounded-full mx-auto mb-6"
                />
                <p className="text-xl text-gray-600">Loading reviews...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">😔</span>
                </div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Failed to load reviews</h3>
                <p className="text-gray-500">Please try refreshing the page</p>
              </div>
            ) : filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No reviews found</h3>
                <p className="text-gray-500">
                  {reviews.length === 0 ? 'No reviews yet. Be the first to write one!' : 'Try adjusting your search or filters'}
                </p>
              </div>
            )}
          </div>
        </FloatingElement>

        {/* Bottom CTA */}
        <FloatingElement delay={0.7}>
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Share Your Experience</h3>
              <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
                Help other couples find their perfect venue by sharing your experience with Vow Venues
              </p>
              <motion.button
                onClick={() => navigate('/feedback')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-3"
              >
                <PenTool className="w-5 h-5" />
                <span>Write Your Review</span>
              </motion.button>
            </div>
          </div>
        </FloatingElement>
      </div>
    </div>
  )
}
