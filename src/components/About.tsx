import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, Shield, Clock, Users, Award, CheckCircle, Sparkles } from 'lucide-react'

const FeatureCard = ({ icon: Icon, title, description, delay }: {
  icon: any,
  title: string,
  description: string,
  delay: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-yellow-200 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <motion.div
      className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
      whileHover={{ rotate: 10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Icon className="w-8 h-8 text-white" />
    </motion.div>

    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
      {description}
    </p>
  </motion.div>
)

const StatItem = ({ number, label, delay }: { number: string, label: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    className="text-center"
  >
    <motion.div
      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {number}
    </motion.div>
    <p className="text-gray-600 font-medium">{label}</p>
  </motion.div>
)

export default function About() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-amber-50" />
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 10 }}
            animate={{
              boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0.4)", "0 0 0 20px rgba(245, 158, 11, 0)", "0 0 0 0 rgba(245, 158, 11, 0)"]
            }}
            transition={{
              scale: { type: "spring", stiffness: 300 },
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <Heart className="w-12 h-12 text-white fill-current" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
              About Vow Venues
            </span>
          </h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Your trusted partner in creating unforgettable moments. We transform dreams into reality
            by connecting you with the most exquisite venues for your special celebrations.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <StatItem number="50+" label="Premium Venues" delay={0.6} />
          <StatItem number="10K+" label="Happy Couples" delay={0.7} />
          <StatItem number="15+" label="Years Experience" delay={0.8} />
          <StatItem number="5⭐" label="Average Rating" delay={0.9} />
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-yellow-200 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full -translate-y-16 translate-x-16 opacity-10" />

            <div className="relative">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Heart className="w-8 h-8 text-white fill-current" />
              </motion.div>

              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                We believe every celebration deserves the perfect setting. Our mission is to connect
                couples and event planners with extraordinary venues in Peshawar, making the venue
                selection process seamless, transparent, and joyful.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-yellow-200 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-full translate-y-16 -translate-x-16 opacity-10" />

            <div className="relative">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                whileHover={{ scale: 1.1, rotate: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-6">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To become Pakistan's premier venue discovery platform, where every couple finds
                their dream venue effortlessly. We envision a future where perfect celebrations
                are just a click away.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Why Choose Vow Venues?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We go beyond just listing venues - we create experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Verified Quality"
              description="Every venue is personally inspected and verified to meet our premium standards"
              delay={1.4}
            />
            <FeatureCard
              icon={Star}
              title="Best Prices"
              description="Competitive pricing with transparent cost breakdown and no hidden fees"
              delay={1.5}
            />
            <FeatureCard
              icon={Clock}
              title="24/7 Support"
              description="Round-the-clock customer support to assist you at every step"
              delay={1.6}
            />
            <FeatureCard
              icon={Users}
              title="Expert Guidance"
              description="Professional event consultants to help you make the perfect choice"
              delay={1.7}
            />
            <FeatureCard
              icon={Award}
              title="Premium Service"
              description="White-glove service ensuring your venue booking experience is flawless"
              delay={1.8}
            />
            <FeatureCard
              icon={CheckCircle}
              title="Guaranteed Satisfaction"
              description="100% satisfaction guarantee with our commitment to excellence"
              delay={1.9}
            />
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl p-12 text-white relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Ready to Find Your Dream Venue?
            </motion.h2>
            <p className="text-xl mb-8 opacity-90">
              Start your journey to the perfect celebration today
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-flex items-center bg-white text-yellow-600 px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Explore Venues Now
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
