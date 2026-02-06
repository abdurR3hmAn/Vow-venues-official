import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  feedbackType: {
    type: String,
    enum: ['general', 'venue', 'booking', 'support', 'feature'],
    default: 'general'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  venueExperience: {
    type: String
  },
  wouldRecommend: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export const Feedback = mongoose.model('Feedback', feedbackSchema)
